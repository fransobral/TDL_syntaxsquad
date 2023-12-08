import { Router } from "express";
import {
    loginEndpoint
} from '../controllers/authService_controller'

const router = Router();

router.get('/Login', loginEndpoint);



export default router;