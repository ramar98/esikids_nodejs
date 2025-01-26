import { pool } from "../db.js";

export const getGames = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM game");
        res.json(rows);
    } catch (err) {
        console.error(err.message);
    }
};
