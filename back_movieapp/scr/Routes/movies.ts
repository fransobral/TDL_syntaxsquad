import { Router } from "express";
import {
    getMovieByName,
    getMoviesByActor,
    getMoviesByGenre,
    getMoviesByNationality,
    getMoviesByYear,
    getTopMoviesByActor,
    getTopMoviesByGenre,
    getTopMoviesByNationality,
    getTopMoviesByYear
} from '../controllers/movies_controller'

const router = Router();

router.get('/movies/name', getMovieByName);
router.get('/movies/actor', getMoviesByActor);
router.get('/movies/top_actor', getTopMoviesByActor);
router.get('/movies/year', getMoviesByYear);
router.get('/movies/top_year', getTopMoviesByYear);
router.get('/movies/nationality', getMoviesByNationality);
router.get('/movies/top_nationality', getTopMoviesByNationality);
router.get('/movies/genre', getMoviesByGenre);
router.get('/movies/top_genre', getTopMoviesByGenre);

export default router;