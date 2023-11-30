import { Router } from "express";
import {
    getRecommendedMovies,
} from '../controllers/recommendation_controller'

const router = Router();

router.get('/recommendations', getRecommendedMovies);

export default router;