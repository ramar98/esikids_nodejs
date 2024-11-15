import { Router } from "express";
import {
  createStudent,
  deleteStudent,
  getStudent,
  getStudents,
  updateStudent,
} from "../controllers/students.controller.js";
import { verifyToken } from "../middlewares/authJwt.js";

const router = Router();

// GET all Students
router.get("/students", verifyToken, getStudents);

// GET An Student
router.get("/students/:id", getStudent);

// DELETE An Student
router.delete("/students/:id", deleteStudent);

// INSERT An Student
router.post("/students", createStudent);

router.put("/students/:id", updateStudent);

export default router;
