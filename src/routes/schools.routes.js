import { Router } from "express";
import {
    getSchools
} from "../controllers/schools.controllers.js";
const router = Router();

router.get('/schools', getSchools);

export default router;
