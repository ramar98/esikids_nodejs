import { Router } from "express";
import {
    //addStudentsToCourse,
    getStudentsByCourse,
    updateCourseStudents
} from "../controllers/courses_students.controller.js";
import { verifyToken } from "../middlewares/authJwt.js";
const router = Router();

//router.post('/courses/:course_id/students', verifyToken, addStudentsToCourse);
router.get('/courses/:course_id/students', verifyToken, getStudentsByCourse);
router.post('/courses/:course_Id/students', verifyToken, updateCourseStudents);

export default router;
