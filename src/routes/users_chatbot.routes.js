import { Router } from "express";
import {
    createUserChatbot,
    getUsersChatbot,
    getUsersChatbotByCourse
} from "../controllers/users_chatbot.controller.js";
import { verifyToken } from "../middlewares/authJwt.js";

const router = Router();

router.post("/users_chatbot", verifyToken, createUserChatbot);
router.get("/users_chatbot", verifyToken, getUsersChatbot);
router.get("/users_chatbot/:course_id", verifyToken, getUsersChatbotByCourse);

export default router;