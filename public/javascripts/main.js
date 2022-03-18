
const menu = document.getElementById("menu");
const list = document.getElementById("list");
const getFilmBtn = document.getElementById("getFilmBtn");
console.log("fhg");

menu.addEventListener("click", (e) => {
    e.preventDefault();

    if (list.style.display === "block")
        list.style.display = "none";
    else
        list.style.display = "block";
}); 

const updateCustomField = async (customfieldID, value) => {

    try {
            const updateCardReq = await fetch(`https://api.trello.com/1/cards/62347ae168ab022818ef572d/customField/${customfieldID}/item?token=ae4a73cb0e40c46f6e642f5f7429394534b35e3b5a4c7c21438e5389eec20497&key=6eb508bda626ff893db446eff50d0066` , {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                value: {
                    text: value
                }
            })
        });
        
        const updateCard = await updateCardReq.json();
        
        if (updateCard.id) {
            return true;
        } else {
            return false;
        }

    } catch(err) {
        return false;
    }
}

const creatTrelloCard = async (fullname) => {
    try {
        const createCardReq = await fetch("https://api.trello.com/1/cards?idList=5a4b3c4cbe0188ca9c0b2059&token=ae4a73cb0e40c46f6e642f5f7429394534b35e3b5a4c7c21438e5389eec20497&key=6eb508bda626ff893db446eff50d0066&name=" + fullname , {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            }
        });
        const createCard = await createCardReq.json();
        console.log(createCard);
        if (createCard?.id) {
            return true;
        } else {
            return false;
        }
    } catch(err) {
        return false;
    }
}

getFilmBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const firstname = document.getElementById("firstname").value;
    const surname = document.getElementById("surname").value;
    const email = document.getElementById("email").value;
    const number = document.getElementById("number").value;
    const movie = e.target.getAttribute("data-movie");

    if  (!firstname || !surname || !email || !number) {
        alert("All fields Required!");
        return;
    }

    const fullname = `${firstname} ${surname}`;

    if (creatTrelloCard(fullname)) {

        const [firstnameObj, surnameObj, emailObj, numberObj, movieObj] = await Promise.all([
            updateCustomField("5ffc223c1b802319cb6192fb", firstname),
            updateCustomField("5ffc224be427094809dd7b7c", surname),
            updateCustomField("5ffc22574a33172aa21ccda1", email),
            updateCustomField("5ffc22612d199f8b0e325ef4", number),
            updateCustomField("5ffc672ef7f3ca718a1a9b93", movie),
        ])

        if (firstnameObj && surnameObj && emailObj && numberObj && movieObj) {
            console.log("All updated");
            alert("Trello Card Created and Updated");
        } else {
            alert("Trello Card Creation Failed");
        }
    }
}); 
