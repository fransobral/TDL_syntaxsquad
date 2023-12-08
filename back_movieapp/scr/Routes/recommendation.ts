import { Router } from "express";
import {
    getRecommendedMovies,getRecommendationsByYears
} from '../controllers/recommendation_controller'

const router = Router();

router.get('/recommendations/:userId', getRecommendedMovies);
router.get('/getRecommendationsByYears/:userId', getRecommendationsByYears);


export default router;