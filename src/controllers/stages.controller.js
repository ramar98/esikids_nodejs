import { pool } from "../db.js";

export const getStages = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM stage");
        res.json(rows);
    } catch (err) {
        console.error(err.message);
    }
};

export const getStagesWithCompletion = async (req, res) => {
    const user_id = req.id;
    try {

        const [stages] = await pool.query("SELECT * FROM stage");
        const [userStages] = await pool.query("SELECT stage_id FROM user_stage WHERE user_id = ?", [user_id]);

        const completedStages = new Set(userStages.map(us => us.stage_id));

        const stagesWithCompletion = stages.map(stage => ({
            ...stage,
            completed: completedStages.has(stage.id)
        }));

        res.json(stagesWithCompletion);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const getStagesWithCompletionByUserId = async (req, res) => {
    const { user_id } = req.params;
    try {

        const [stages] = await pool.query("SELECT * FROM stage");
        const [userStages] = await pool.query("SELECT stage_id FROM user_stage WHERE user_id = ?", [user_id]);

        const completedStages = new Set(userStages.map(us => us.stage_id));

        const stagesWithCompletion = stages.map(stage => ({
            ...stage,
            completed: completedStages.has(stage.id)
        }));

        res.json(stagesWithCompletion);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};
