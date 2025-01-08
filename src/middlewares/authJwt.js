import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import { pool } from "../db.js";

export const verifyToken = async (req, res, next) => {
    const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).json("A token is required for authentication");
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json("Invalid token");
        }
        req.id = decoded.userId;
    });

    console.log(req.id);

    const [rows] = await pool.query("SELECT * FROM user WHERE id = ?", [
        req.id,
    ]);

    if (rows.length <= 0) {
        return res.status(404).json({ message: "User not found" });
    }

    next();
}