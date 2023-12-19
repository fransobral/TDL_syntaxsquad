"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopMoviesByGenre = exports.getMoviesByGenre = exports.getTopMoviesByNationality = exports.getMoviesByNationality = exports.getTopMoviesByYear = exports.getMoviesByYear = exports.getTopMoviesByActor = exports.getMoviesByActor = exports.getMovieByName = void 0;
const apiKey = "08c6fb59f7c71d29805136fe34281282";
function printError(error, res) {
    let message = 'An error occurred, but it is not an instance of Error.';
    if (error instanceof Error)
        message = `An error occurred: ${error.message}`;
    console.error(message);
    return res.status(500).json('Internal Server Error.');
}
function fetchFromAPI(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url);
        if (!response.ok) {
            throw new Error(`Error en la búsqueda de películas. Código de estado: ${response.status}`);
        }
        return yield response.json();
    });
}
const getMovieByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        if (name == undefined || name.trim() == "")
            return res.status(500).json("The expected 'name' parameter was not received.");
        const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURI(name.trim())}`;
        const searchData = yield fetchFromAPI(searchUrl);
        if (!searchData.results || searchData.results.length < 1)
            return res.status(500).json('No results found for the movie.');
        const firstMovie = searchData.results[0];
        const movieId = firstMovie.id;
        const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;
        const result = yield fetchFromAPI(movieUrl);
        return res.status(200).json(result);
    }
    catch (error) {
        return printError(error, res);
    }
});
exports.getMovieByName = getMovieByName;
const getMoviesByActor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        if (name == undefined || name.trim() == "")
            return res.status(500).json("The expected 'name' parameter was not received.");
        const actorUrl = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURI(name.trim())}`;
        const actorData = yield fetchFromAPI(actorUrl);
        if (!actorData.results || actorData.results.length < 1)
            return res.status(500).json('No results found for the movie.');
        return res.status(200).json(actorData.results);
    }
    catch (error) {
        return printError(error, res);
    }
});
exports.getMoviesByActor = getMoviesByActor;
const getTopMoviesByActor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, top } = req.body;
        if (name == undefined || name.trim() == "" || top == undefined || top !== true)
            return res.status(500).json("The expected 'name' parameter was not received.");
        const actorUrl = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURI(name.trim())}`;
        const actorData = yield fetchFromAPI(actorUrl);
        if (!actorData.results || actorData.results.length < 1)
            return res.status(500).json('No results found for the movie.');
        const movies = actorData.results[0].known_for.slice(0, 10);
        return res.status(200).json(movies.sort((a, b) => b.vote_average - a.vote_average));
    }
    catch (error) {
        return printError(error, res);
    }
});
exports.getTopMoviesByActor = getTopMoviesByActor;
const getMoviesByYear = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { year } = req.body;
        if (year == undefined || year.trim() == "")
            return res.status(500).json("The expected 'year' parameter was not received.");
        year = Number(year.trim());
        if (isNaN(year) || !Number.isInteger(year))
            return res.status(500).json("Parameter 'year' does not contain valid data.");
        const yearUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&primary_release_year=${year}`;
        const yearData = yield fetchFromAPI(yearUrl);
        if (!yearData.results || yearData.results.length < 1)
            return res.status(500).json('No results found for the movie.');
        return res.status(200).json(yearData.results);
    }
    catch (error) {
        return printError(error, res);
    }
});
exports.getMoviesByYear = getMoviesByYear;
const getTopMoviesByYear = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { year, top } = req.body;
        if (year == undefined || year.trim() == "" || top == undefined || top !== true)
            return res.status(500).json("The expected 'year' and/or 'top' parameters were not received.");
        const yearUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&primary_release_year=${year}`;
        const yearData = yield fetchFromAPI(yearUrl);
        if (!yearData.results || yearData.results.length < 1)
            return res.status(500).json('No results found for the movie.');
        return res.status(200).json(yearData.results.slice(0, 10).sort((a, b) => b.vote_average - a.vote_average));
    }
    catch (error) {
        return printError(error, res);
    }
});
exports.getTopMoviesByYear = getTopMoviesByYear;
const getMoviesByNationality = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nationality } = req.body;
        if (nationality == undefined || nationality.trim() == "")
            return res.status(500).json("The expected 'nationality' parameter was not received.");
        const nationalityUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&region=${nationality.trim()}`;
        const nationalityData = yield fetchFromAPI(nationalityUrl);
        if (!nationalityData.results || nationalityData.results.length < 1)
            return res.status(500).json('No results found for the movie.');
        return res.status(200).json(nationalityData.results);
    }
    catch (error) {
        return printError(error, res);
    }
});
exports.getMoviesByNationality = getMoviesByNationality;
const getTopMoviesByNationality = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nationality, top } = req.body;
        if (nationality == undefined || nationality.trim() == "" || top == undefined || top !== true)
            return res.status(500).json("The expected 'nationality' and/or 'top' parameters were not received.");
        const nationalityUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&region=${nationality}`;
        const nationalityData = yield fetchFromAPI(nationalityUrl);
        if (!nationalityData.results || nationalityData.results.length < 1)
            return res.status(500).json('No results found for the movie.');
        return res.status(200).json(nationalityData.results.slice(0, 10).sort((a, b) => b.vote_average - a.vote_average));
    }
    catch (error) {
        return printError(error, res);
    }
});
exports.getTopMoviesByNationality = getTopMoviesByNationality;
const getMoviesByGenre = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { genre } = req.body;
        if (genre == undefined || genre.trim() == "")
            return res.status(500).json("The expected 'genre' parameter was not received.");
        const genreUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}`;
        const genreData = yield fetchFromAPI(genreUrl);
        if (!genreData.results || genreData.results.length < 1)
            return res.status(500).json('No results found for the movie.');
        return res.status(200).json(genreData.results);
    }
    catch (error) {
        return printError(error, res);
    }
});
exports.getMoviesByGenre = getMoviesByGenre;
const getTopMoviesByGenre = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { genre, top } = req.body;
        if (genre == undefined || genre.trim() == "" || top == undefined || top !== true)
            return res.status(500).json("The expected 'genre' and/or 'top' parameters were not received.");
        const genreUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}&sort_by=vote_average.desc`;
        const genreData = yield fetchFromAPI(genreUrl);
        if (!genreData.results || genreData.results.length < 1)
            return res.status(500).json('No results found for the movie.');
        return res.status(200).json(genreData.results.slice(0, 10));
    }
    catch (error) {
        return printError(error, res);
    }
});
exports.getTopMoviesByGenre = getTopMoviesByGenre;
