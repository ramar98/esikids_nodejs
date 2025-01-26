import { Router } from "express";
import {
    getStages,
    getStagesWithCompletion,
    getStagesWithCompletionByUserId
} from "../controllers/stages.controller.js";
import { verifyToken } from "../middlewares/authJwt.js";

const router = Router();

router.get("/stages", verifyToken, getStages);
router.get("/stages-with-completion", verifyToken, getStagesWithCompletion);
router.get("/stages-with-completion/:user_id", verifyToken, getStagesWithCompletionByUserId);

export default router;