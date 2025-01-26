import { pool } from "../db.js";

export const createUserStage = async (req, res) => {
    try {
        const user_id = req.id;
        const { stage_id } = req.body;
        const [rows] = await pool.query(
            "INSERT INTO user_stage (user_id, stage_id) VALUES(?, ?)",
            [user_id, stage_id]
        );
        res.json(rows[0]);
    } catch (err) {
        console.error(err.message);
    }
}

export const getUserStages = async (req, res) => {
    try {
        const allStages = await pool.query("SELECT * FROM user_stage");
        res.json(allStages.rows);
    } catch (err) {
        console.error(err.message);
    }
}

export const getUserStageByUserId = async (req, res) => {
    try {
        const user_id = req.id;
        const stage = await pool.query("SELECT * FROM user_stage WHERE id = $1", [user_id]);
        res.json(stage.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
}
