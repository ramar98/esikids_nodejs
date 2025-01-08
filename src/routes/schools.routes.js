import { Router } from "express";
import {
    getSchools,
    getSchool
} from "../controllers/schools.controllers.js";
const router = Router();

router.get('/schools', getSchools);
router.get('/schools/:id', getSchool);

export default router;
