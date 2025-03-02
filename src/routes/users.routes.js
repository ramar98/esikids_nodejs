import { Router } from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  validateStudentEmail,
  validateEmail,
  validateDni,
  getUserWithDataByToken
} from "../controllers/users.controller.js";
import { verifyToken } from "../middlewares/authJwt.js";

const router = Router();

// GET all Users
router.get("/users", getUsers);

// GET An User
router.get("/users/:id", getUser);

// GET An User by Token
router.get("/usertoken", verifyToken, getUserWithDataByToken);

// DELETE An User
router.delete("/users/:id", deleteUser);

// UPDATE An User
router.patch("/users/:id", verifyToken, updateUser);

// VALIDATE STUDENTEMAIL
router.post("/users/validateStudentEmail", validateStudentEmail);
// VALIDATE EMAIL
router.post("/users/validateEmail", validateEmail);

// VALIDATE DNI
router.post("/users/validateDni", validateDni);


export default router;
