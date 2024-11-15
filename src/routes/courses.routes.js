import { Router } from "express";
import {
    getCoursesByUserId,
} from "../controllers/courses.controller.js";
import { verifyToken } from "../middlewares/authJwt.js";
const router = Router();

router.get('/coursesByUserId/', verifyToken, getCoursesByUserId);

export default router;
