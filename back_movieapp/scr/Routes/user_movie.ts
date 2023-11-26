import { Router } from "express";
import { createUserMovie, deleteUserMovie, getUserMovie, getUserMovieId, getUserMovieUserId} from '../controllers/user_movie_controller'

const router = Router();

router.get('/user_movie', getUserMovie);
router.get('/user_movie/user/:id', getUserMovieUserId);
router.post('/user_movie', createUserMovie);
router.get('/user_movie/:id', getUserMovieId);
router.delete('/user_movie/:id', deleteUserMovie);

export default router;