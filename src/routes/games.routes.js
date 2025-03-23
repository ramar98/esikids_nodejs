import { Router } from "express";
import {
    getGames,
    getMostPlayedGameByCourse
} from "../controllers/games.controller.js";
import { verifyToken } from "../middlewares/authJwt.js";

const router = Router();

router.get("/games", verifyToken, getGames);
router.get("/games/getMostPlayedGameByCourse/:course_id", verifyToken, getMostPlayedGameByCourse);

export default router;