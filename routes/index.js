var express = require('express');
var router = express.Router();
const axios = require('axios');/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const AverageMovies = async (res_movies) => {
  await res_movies.forEach(movie_s => {
    let averate_vote = parseInt(movie_s.vote_average * 10);
    movie_s.averate_vote_base = averate_vote;
    if  (averate_vote == 0) {
      movie_s.averate_vote_color = "grey";
    } else if (averate_vote < 50) {
      movie_s.averate_vote_color = "red";
    }else if (averate_vote >= 50 && averate_vote < 70) {
      movie_s.averate_vote_color = "yellow";
    } else if(averate_vote >= 70) {
      movie_s.averate_vote_color = "green";
    } else {
      movie_s.averate_vote_color = "grey";
    }
  });
  return true;
}

router.get('/browse', async function(req, res, next)  {
  let movies = [];
  axios.get("https://api.themoviedb.org/3/movie/popular?api_key=d4f7b87d7cedfdfbbb297f46aa3e8779&language=en-US&page=1")
  .then(async (res_movies) => {
    const movies = res_movies.data.results;
    const movies_modified = await AverageMovies(movies);

    if (movies_modified) {
      console.log(movies);
      res.render('browse', { title: 'Express', movies });
    }
  })
  .catch(err => console.log(err));  
});

router.get('/movie/:id', function(req, res, next) {

  axios.get("https://api.themoviedb.org/3/movie/"+req.params.id+"?api_key=d4f7b87d7cedfdfbbb297f46aa3e8779&language=en-US")
  .then(movie => {
    console.log(movie.data);
    movie.data.release_year = movie.data.release_date.substring(0, 4);
    let averate_vote = parseInt(movie.data.vote_average * 10);
    if  (averate_vote == 0) {
      movie.data.averate_vote_color = "grey";
    } else if (averate_vote < 50) {
      movie.data.averate_vote_color = "red";
    }else if (averate_vote >= 50 && averate_vote < 70) {
      movie.data.averate_vote_color = "yellow";
    } else if(averate_vote >= 70) {
      movie.data.averate_vote_color = "green";
    } else {
      movie.data.averate_vote_color = "grey";
    }

    res.render('movie', { movie: movie.data });
  })
  .catch(err => console.log(err)); 
});

router.get('/about', function(req, res, next) {
  res.render('about');
});

module.exports = router;
