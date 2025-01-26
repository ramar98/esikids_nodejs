import { Router } from "express";
import {
    getGames,
} from "../controllers/games.controller.js";
import { verifyToken } from "../middlewares/authJwt.js";

const router = Router();

router.get("/games", verifyToken, getGames);

export default router;