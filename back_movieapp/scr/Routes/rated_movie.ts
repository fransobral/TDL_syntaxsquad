import { Router } from "express";
import { createRatedMovie, deleteRatedMovie, getRatedMovie, getRatedMovieById, getRatedMovieByUserId, updateRatedMovie } from '../controllers/rated_movie_controller'

const router = Router();

router.get('/rated_movie', getRatedMovie);
router.get('/rated_movie/:id', getRatedMovieById);
router.get('/rated_movie/user/:id', getRatedMovieByUserId);
router.post('/rated_movie', createRatedMovie);
router.put('/rated_movie/:id', updateRatedMovie);
router.delete('/rated_movie/:id', deleteRatedMovie);

export default router;