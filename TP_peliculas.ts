const get = require('node-fetch');

const url = 'https://api.themoviedb.org/3/search/movie?query=cars&include_adult=true&language=en-US&page=1';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwOGM2ZmI1OWY3YzcxZDI5ODA1MTM2ZmUzNDI4MTI4MiIsInN1YiI6IjY1NDdlZWI1ZmQ0ZjgwMDEwMWI2NjQ2YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4WyKoXflFM4maKB0N3BE6H6pIb12dGRiXnkmZ5-y2Qg'
  }
};

get(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error('error:' + err));