import { Router } from "express";
import {
    login,
    registerUser,
    sendVerificationCode,
    validateCode,
    resetPassword,
    sendUserByEmail
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/authJwt.js";

const router = Router();

router.post("/login", login);
router.post("/registerUser", registerUser);
router.post("/sendVerificationCode", sendVerificationCode);
router.post("/validateCode", validateCode);
router.post("/resetPassword", resetPassword);
router.post("/sendUserByEmail", sendUserByEmail);

export default router;
