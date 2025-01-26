import { Router } from "express";
import {
    createUserStage,
    getUserStages,
    getUserStageByUserId
} from "../controllers/users_stages.controller.js";
import { verifyToken } from "../middlewares/authJwt.js";

const router = Router();

router.post("/users_stages", verifyToken, createUserStage);
router.get("/users_stages", verifyToken, getUserStages);
router.get("/users_stage", verifyToken, getUserStageByUserId);

export default router;