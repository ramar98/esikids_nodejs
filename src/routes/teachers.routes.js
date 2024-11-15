import { Router } from "express";
import {
  createTeacher,
  deleteTeacher,
  getTeacher,
  getTeachers,
  updateTeacher,
} from "../controllers/teachers.controller.js";

const router = Router();

// GET all Teachers
router.get("/teachers", getTeachers);

// GET An Teacher
router.get("/teachers/:id", getTeacher);

// DELETE An Teacher
router.delete("/teachers/:id", deleteTeacher);

// INSERT An Teacher
router.post("/teachers", createTeacher);

router.put("/teachers/:id", updateTeacher);

export default router;