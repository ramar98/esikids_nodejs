import { Router } from "express";
import {
  createTutor,
  deleteTutor,
  getTutor,
  getTutors,
  updateTutor,
} from "../controllers/tutors.controller.js";
import { verifyToken } from "../middlewares/authJwt.js";

const router = Router();

// GET all Tutors
router.get("/tutors", verifyToken, getTutors);

// GET An Tutor
router.get("/tutors/:id", getTutor);

// DELETE An Tutor
router.delete("/tutors/:id", deleteTutor);

// INSERT An Tutor
router.post("/tutors", createTutor);

router.put("/tutors/:id", updateTutor);

export default router;
