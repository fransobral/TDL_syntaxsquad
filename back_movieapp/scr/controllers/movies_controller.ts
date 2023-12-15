import { Request, Response } from 'express';

const apiKey = "08c6fb59f7c71d29805136fe34281282";

function printError(error: unknown, res: Response<any, Record<string, any>>) {
    let message = 'An error occurred, but it is not an instance of Error.';
    if (error instanceof Error) message = `An error occurred: ${error.message}`;
    console.error(message);
    return res.status(500).json('Internal Server Error.')
}

async function fetchFromAPI(url: string | URL | globalThis.Request) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error en la búsqueda de películas. Código de estado: ${response.status}`);
    }
    return await response.json();
}

export const getMovieByName = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name } = req.query;

        if (name == undefined ) return res.status(500).json("The expected 'name' parameter was not received.");

        const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURI(name.toString())}`;
        const searchData = await fetchFromAPI(searchUrl);

        if (!searchData.results || searchData.results.length < 1) return res.status(500).json('No results found for the movie.');

        const firstMovie = searchData.results[0];
        const movieId = firstMovie.id;

        const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;
        const result = await fetchFromAPI(movieUrl);

        return res.status(200).json(result);
    } catch (error) {
        return printError(error, res);
    }
}

export const getMoviesByActor = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name } = req.query;
        if (name == undefined) return res.status(500).json("The expected 'name' parameter was not received.");

        const actorUrl = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURI(name.toString())}`;
        const actorData = await fetchFromAPI(actorUrl);

        if (!actorData.results || actorData.results.length < 1) return res.status(500).json('No results found for the movie.');

        return res.status(200).json(actorData.results);
    } catch (error) {
        return printError(error, res);
    }
}

export const getTopMoviesByActor = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name, top } = req.query;
        if (name == undefined || top == undefined) return res.status(500).json("The expected 'name' parameter was not received.");

        const actorUrl = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURI(name.toString())}`;
        const actorData = await fetchFromAPI(actorUrl);

        if (!actorData.results || actorData.results.length < 1) return res.status(500).json('No results found for the movie.');

        const movies = actorData.results[0].known_for.slice(0, top);

        return res.status(200).json(movies.sort((a: { vote_average: number; }, b: { vote_average: number; }) => b.vote_average - a.vote_average));
    } catch (error) {
        return printError(error, res);
    }
}

export const getMoviesByYear = async (req: Request, res: Response): Promise<Response> => {
    try {
        let { year } = req.query;
        if (year == undefined) return res.status(500).json("The expected 'year' parameter was not received.");

        let nyear = Number(year);
        if (isNaN(nyear) || !Number.isInteger(nyear)) return res.status(500).json("Parameter 'year' does not contain valid data.");

        const yearUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&primary_release_year=${nyear}`;
        const yearData = await fetchFromAPI(yearUrl);

        if (!yearData.results || yearData.results.length < 1) return res.status(500).json('No results found for the movie.');

        return res.status(200).json(yearData.results);
    } catch (error) {
        return printError(error, res);
    }
}

export const getTopMoviesByYear = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { year, top } = req.query;
        if (year == undefined || top == undefined) return res.status(500).json("The expected 'year' and/or 'top' parameters were not received.");

        const yearUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&primary_release_year=${year}`;
        const yearData = await fetchFromAPI(yearUrl);

        if (!yearData.results || yearData.results.length < 1) return res.status(500).json('No results found for the movie.');

        return res.status(200).json(yearData.results.slice(0, top).sort((a: { vote_average: number; }, b: { vote_average: number; }) => b.vote_average - a.vote_average));
    } catch (error) {
        return printError(error, res);
    }
}

export const getMoviesByNationality = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { nationality } = req.query;
        if (nationality == undefined) return res.status(500).json("The expected 'nationality' parameter was not received.");

        const nationalityUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&region=${nationality.toString()}`;
        const nationalityData = await fetchFromAPI(nationalityUrl);

        if (!nationalityData.results || nationalityData.results.length < 1) return res.status(500).json('No results found for the movie.');

        return res.status(200).json(nationalityData.results);

    } catch (error) {
        return printError(error, res);
    }
}

export const getTopMoviesByNationality = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { nationality, top } = req.query;
        if (nationality == undefined || top == undefined ) return res.status(500).json("The expected 'nationality' and/or 'top' parameters were not received.");

        const nationalityUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&region=${nationality}`;
        const nationalityData = await fetchFromAPI(nationalityUrl);

        if (!nationalityData.results || nationalityData.results.length < 1) return res.status(500).json('No results found for the movie.');

        return res.status(200).json(nationalityData.results.slice(0, top).sort((a: { vote_average: number; }, b: { vote_average: number; }) => b.vote_average - a.vote_average));
    } catch (error) {
        return printError(error, res);
    }

}

export const getMoviesByGenre = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { genre } = req.query;
        if (genre == undefined) return res.status(500).json("The expected 'genre' parameter was not received.");

        const genreUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}`;
        const genreData = await fetchFromAPI(genreUrl);

        if (!genreData.results || genreData.results.length < 1) return res.status(500).json('No results found for the movie.');

        return res.status(200).json(genreData.results);
    } catch (error) {
        return printError(error, res);
    }
}

export const getTopMoviesByGenre = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { genre, top } = req.query;
        if (genre == undefined|| top == undefined) return res.status(500).json("The expected 'genre' and/or 'top' parameters were not received.");

        const genreUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}&sort_by=vote_average.desc`;
        const genreData = await fetchFromAPI(genreUrl);

        if (!genreData.results || genreData.results.length < 1) return res.status(500).json('No results found for the movie.');

        return res.status(200).json(genreData.results.slice(0, top));

    } catch (error) {
        return printError(error, res);
    }

}