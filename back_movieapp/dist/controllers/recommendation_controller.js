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
exports.getRecommendationsByYears = exports.getRecommendedMovies = void 0;
const DataBase_1 = require("../DataBase");
const API_KEY = '08c6fb59f7c71d29805136fe34281282';
function printError(error, res) {
    let message = 'An error occurred, but it is not an instance of Error.';
    if (error instanceof Error)
        message = `An error occurred: ${error.message}`;
    console.error(message);
    return res.status(500).json('Internal Server Error.');
}
function getMovieGenres(movieId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`);
            if (!response.ok) {
                throw new Error(`Error al obtener los géneros de la película ${movieId}. Código de estado: ${response.status}`);
            }
            const data = yield response.json();
            // Obtener los IDs de géneros de la película
            const genres = data.genres.map((genre) => genre.id);
            return genres;
        }
        catch (error) {
            throw new Error(`Error al obtener los géneros de la película ${movieId}: ${error}`);
        }
    });
}
function getActorsByMovie(movieId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`);
            if (!response.ok) {
                throw new Error(`Error al obtener los actores de la película ${movieId}. Código de estado: ${response.status}`);
            }
            const data = yield response.json();
            const actors = data.cast.map((actor) => ({
                id: actor.id,
                name: actor.name,
            }));
            return actors;
        }
        catch (error) {
            throw new Error(`Error al obtener los actores de la película ${movieId}: ${error}`);
        }
    });
}
function getFavoriteGenres(movieIds) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const promises = movieIds.map(movieId => getMovieGenres(movieId));
            const genresArrays = yield Promise.all(promises);
            const genres = Array.from(new Set(genresArrays.reduce((acc, val) => acc.concat(val), [])));
            return genres;
        }
        catch (error) {
            throw new Error(`Error al obtener géneros de las películas favoritas: ${error}`);
        }
    });
}
function getFavoriteActors(movieIds) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const promises = movieIds.map(movieId => getActorsByMovie(movieId));
            const actorsArrays = yield Promise.all(promises);
            const actors = actorsArrays.reduce((acc, val) => {
                val.forEach(actor => {
                    if (!acc.find(a => a.id === actor.id)) {
                        acc.push(actor);
                    }
                });
                return acc;
            }, []);
            return actors.map(actor => actor.id);
        }
        catch (error) {
            throw new Error(`Error al obtener actores de las películas favoritas: ${error}`);
        }
    });
}
function getMoviesByYear(year) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&primary_release_year=${year}`);
            if (!response.ok) {
                throw new Error(`Error al obtener las películas del año ${year}. Código de estado: ${response.status}`);
            }
            const data = yield response.json();
            const movies = data.results.map((movie) => ({
                id: movie.id,
                title: movie.title,
                genre_ids: movie.genre_ids,
                overview: movie.overview,
                release_date: movie.release_date
            }));
            return movies;
        }
        catch (error) {
            throw new Error(`Error al obtener las películas del año ${year}: ${error}`);
        }
    });
}
function obtenerGeneroPorId(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = new URL(`https://api.themoviedb.org/3/genre/${id}?api_key=${API_KEY}`);
        try {
            const response = yield fetch(url.toString());
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.json();
            let gender = {
                id: data.id,
                name: data.name
            };
            return gender;
        }
        catch (error) {
            console.error(`Error al obtener el género con ID ${id}:`, error);
            throw error;
        }
    });
}
function obtenerGenerosPorIds(ids) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fetchPromises = ids.map(id => obtenerGeneroPorId(id));
            const genres = yield Promise.all(fetchPromises);
            return genres;
        }
        catch (error) {
            console.error('Error al obtener los géneros:', error);
            throw error;
        }
    });
}
// Función para obtener sugerencias de películas
function getSuggestedMovies(movieIds, recommendationQuantity) {
    return __awaiter(this, void 0, void 0, function* () {
        const favoriteGenres = yield getFavoriteGenres(movieIds);
        const favoriteActors = yield getFavoriteActors(movieIds);
        const suggestions = [];
        const currentYear = new Date().getFullYear();
        for (let year = currentYear; year >= 1900 && suggestions.length < recommendationQuantity; year--) {
            try {
                let movies = yield getMoviesByYear(year);
                movies = movies.filter(movie => !movieIds.includes(movie.id));
                for (let movie of movies) {
                    if (suggestions.length >= recommendationQuantity) {
                        break;
                    }
                    const matchedGenres = movie.genre_ids.some(genre => favoriteGenres.includes(genre));
                    let matchedActors = false;
                    if (!matchedGenres) {
                        const movieActors = yield getActorsByMovie(movie.id);
                        let actor = movieActors.find(actor => favoriteActors.includes(actor.id));
                        matchedActors = actor !== undefined;
                        movie.actorMatch = actor;
                    }
                    if (matchedGenres || matchedActors) {
                        movie.genders = yield obtenerGenerosPorIds(movie.genre_ids);
                        suggestions.push(movie);
                    }
                }
            }
            catch (error) {
                console.error(`Error al obtener películas del año ${year}: ${error}`);
            }
        }
        return suggestions;
    });
}
// Uso de la función getSuggestedMovies con una lista de IDs de películas favoritas
const getRecommendedMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const recommendationQuantity = parseInt((_a = req.query.recommendationQuantity) !== null && _a !== void 0 ? _a : 10);
        const response = yield DataBase_1.pool.query('SELECT movie_id FROM public.user_movie WHERE user_id=$1', [(_b = req.usuario) === null || _b === void 0 ? void 0 : _b.userId]);
        if (((_c = response.rowCount) !== null && _c !== void 0 ? _c : 0) > 0) {
            const favoriteMoviesIds = response.rows.map(x => x.movie_id);
            let recommendations = yield getSuggestedMovies(favoriteMoviesIds, recommendationQuantity);
            const transformedRecommendations = recommendations.map(movie => {
                const genders = movie.genre_ids.map(genreId => {
                    const foundGenre = movie.genders.find(genre => genre.id === genreId);
                    return foundGenre ? foundGenre.name : '';
                });
                return {
                    id: movie.id,
                    title: movie.title,
                    overview: movie.overview,
                    release_date: movie.release_date,
                    genders
                };
            });
            const actorsByMovieId = yield getActorsByMovies(recommendations);
            const transformedMoviesWithActors = transformedRecommendations.map(movie => {
                const actors = actorsByMovieId[movie.id] || []; // Obtener los actores para la película actual o un array vacío si no hay información
                const movieActors = actors.map(x => x.name);
                return Object.assign(Object.assign({}, movie), { movieActors });
            });
            return res.status(200).json(transformedMoviesWithActors);
        }
        else {
            const result = yield getTopMoviesForEachGenre(recommendationQuantity);
            return res.status(200).json(result);
        }
    }
    catch (error) {
        return printError(error, res);
    }
    function getActorsByMovies(recommendations) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = recommendations.map(x => x.id).map(movieId => getActorsByMovie(movieId));
            const actorsArrays = yield Promise.all(promises);
            const actorsByMovieId = {};
            recommendations.forEach((movie, index) => {
                const movieId = movie.id;
                actorsByMovieId[movieId] = actorsArrays[index];
            });
            return actorsByMovieId;
        });
    }
});
exports.getRecommendedMovies = getRecommendedMovies;
// Obtener las dos películas más populares por género sin repetir películas y limitando a 2 por género
function getTopMoviesByGenre(genreId, moviesAlreadyAdded) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`http://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&with_genres=${genreId}&api_key=${API_KEY}`);
        const data = yield response.json();
        const topMovies = data.results.filter((movie) => !moviesAlreadyAdded.includes(movie.id)).slice(0, 2);
        topMovies.forEach((movie) => moviesAlreadyAdded.push(movie.id));
        return topMovies;
    });
}
// falta implementar recommendationQuantity 
// Obtener las dos películas principales por género para todos los géneros sin repeticiones
function getTopMoviesForEachGenre(recommendationQuantity) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let genres = [
                { id: 35, name: "Comedy" },
                { id: 53, name: "Thriller" },
                { id: 10751, name: "Family" },
                { id: 28, name: "Action" },
                { id: 12, name: "Adventure" }
            ];
            let moviesAdded = [];
            let results = [];
            for (const genre of genres) {
                const topMovies = yield getTopMoviesByGenre(genre.id, moviesAdded);
                results.push({ genre: genre.name, topMovies });
            }
            const enrichResult = yield enrichMoviesWithDetails(results);
            return enrichResult;
        }
        catch (error) {
            console.error('Error:', error);
        }
    });
}
function enrichMoviesWithDetails(movies) {
    return __awaiter(this, void 0, void 0, function* () {
        const enrichedMovies = [];
        const fetchMovieDetails = (movie) => __awaiter(this, void 0, void 0, function* () {
            const movieDetailsPromise = getMovieDetails(movie.id);
            // const actorsPromise = getActorsForMovie(movie.id);
            const [movieDetails] = yield Promise.all([movieDetailsPromise]);
            return movieDetails;
        });
        for (const genreMovies of movies) {
            if (genreMovies) {
                const moviesPromises = genreMovies.topMovies.map((movie) => fetchMovieDetails(movie));
                const moviesDetails = yield Promise.all(moviesPromises);
                enrichedMovies.push(...moviesDetails);
            }
        }
        return enrichedMovies;
    });
}
// Función para obtener los actores de una película por su ID
function getActorsForMovie(movieId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`http://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`);
        const data = yield response.json();
        return data.cast.map((actor) => actor.name);
    });
}
// Función para obtener detalles adicionales de una película por su ID
function getMovieDetails(movieId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`http://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`);
        const data = yield response.json();
        const genres = data.genres.map((genre) => genre.name);
        const actors = yield getActorsForMovie(movieId);
        return {
            id: data.id,
            title: data.title,
            overview: data.overview,
            release_date: data.release_date,
            genres: genres,
            movieActors: actors
        };
    });
}
//----------------------------------------
//RECOMENDADOR 2
const getRecommendationsByYears = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f;
    try {
        const recommendationQuantity = parseInt((_d = req.query.recommendationQuantity) !== null && _d !== void 0 ? _d : 10);
        console.log("recommendationQuantity", recommendationQuantity);
        const response = yield DataBase_1.pool.query('SELECT movie_id FROM public.user_movie WHERE user_id=$1', [(_e = req.usuario) === null || _e === void 0 ? void 0 : _e.userId]);
        if (((_f = response.rowCount) !== null && _f !== void 0 ? _f : 0) > 0) {
            const resultRec = yield recomendacionPorAnioDeFavoritos(response.rows.map(x => x.movie_id), recommendationQuantity);
            return res.status(200).json(resultRec);
        }
        else {
            const result = yield getTopMoviesForEachGenre(recommendationQuantity);
            return res.status(200).json(result);
        }
    }
    catch (error) {
        return printError(error, res);
    }
});
exports.getRecommendationsByYears = getRecommendationsByYears;
function fetchMovies(year, recoCount) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`http://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=es&sort_by=popularity.desc&primary_release_year=${year}`);
        if (!response.ok) {
            console.error(`No se pudo obtener películas para el año ${year}.`);
            return [];
        }
        const data = yield response.json();
        const movies = data.results.slice(0, recoCount);
        return movies;
    });
}
function recommendMovies(recommendations) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const promises = recommendations.map(({ year, recoCount }) => fetchMovies(year, recoCount));
            const movieLists = yield Promise.all(promises);
            return movieLists.flat();
        }
        catch (error) {
            console.error('Hubo un error al obtener las recomendaciones de películas:', error);
        }
    });
}
function getMoviesInfoParallel(ids) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const movieInfoPromises = ids.map((id) => getMovieInfo(id));
            const moviesInfo = yield Promise.all(movieInfoPromises);
            return moviesInfo;
        }
        catch (error) {
            // Manejo de errores
            console.error('Error al obtener información de películas en paralelo:', error);
            throw error;
        }
    });
}
function getMovieInfo(movieId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`);
            if (!response.ok) {
                throw new Error(`Error al obtener información de la película con ID ${movieId}`);
            }
            const movieData = yield response.json();
            const { id, release_date } = movieData;
            // Extraer el año de la fecha de lanzamiento
            const releaseYear = (release_date && new Date(release_date).getFullYear()) || null;
            return { id, year: releaseYear };
        }
        catch (error) {
            // Manejo de errores
            console.error(`Error al obtener información de la película con ID ${movieId}:`, error);
            throw error;
        }
    });
}
function recomendacionPorAnioDeFavoritos(ids, recommendationQuantity) {
    return __awaiter(this, void 0, void 0, function* () {
        const favoriteMovies = yield getMoviesInfoParallel(ids);
        const yearsMap = favoriteMovies.reduce((acc, movie) => {
            acc[movie.year] = (acc[movie.year] || 0) + 1;
            return acc;
        }, {});
        const totalFavoriteMovies = favoriteMovies.length;
        const percentages = {};
        for (const year in yearsMap) {
            percentages[year] = (yearsMap[year] / totalFavoriteMovies) * 100;
        }
        const totalMovies = recommendationQuantity; // Total de películas recomendadas
        const movieCounts = [];
        for (const yearKey in percentages) {
            if (percentages.hasOwnProperty(yearKey)) {
                const percentage = percentages[yearKey];
                const Recommendation = Math.trunc((percentage * totalMovies) / 100);
                movieCounts.push({ year: Number(yearKey), recoCount: Recommendation });
            }
        }
        // Encontrar la película con el recocount más alto 
        let maxCountMovie = movieCounts[0].recoCount;
        let maxIndex = 0;
        for (let i = 1; i < movieCounts.length; i++) {
            if (movieCounts[i].recoCount > maxCountMovie) {
                maxCountMovie = movieCounts[i].recoCount;
                maxIndex = i;
            }
        }
        // Calculando la suma total actual de las recomendaciones
        const totalCurrentRecommendations = movieCounts.reduce((total, movie) => total + movie.recoCount, 0);
        const diff = recommendationQuantity - totalCurrentRecommendations;
        movieCounts[maxIndex].recoCount += diff;
        const result = yield recommendMovies(movieCounts);
        const moviesWithDetails = yield Promise.all(result.map((x) => x.id).map((movieId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const movieDetails = yield getMovieDetails(movieId);
                return movieDetails;
            }
            catch (error) {
                console.error(`Error obteniendo detalles para la película con ID ${movieId}: ${error}`);
                return null;
            }
        })));
        // console.log("Recommendation final: ");
        // console.log(moviesWithDetails);
        return moviesWithDetails;
        //peliculas del año orden por puntuacion
    });
}
