import { Router } from "express";
import {
    getCoursesByUserId,
    createCourse,
    getCourseById,
    deleteCourse,
    updateCourse,
} from "../controllers/courses.controller.js";
import { verifyToken } from "../middlewares/authJwt.js";
const router = Router();

router.get('/coursesByUserId/', getCoursesByUserId);
router.post('/courses/createCourse', verifyToken, createCourse);
router.get('/courses/:course_id', verifyToken, getCourseById);
router.delete('/courses/:course_id', verifyToken, deleteCourse);
router.put('/courses/updateCourse', verifyToken, updateCourse);

export default router;
