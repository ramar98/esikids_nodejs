import { pool } from "../db.js";

export const createUserChatbot = async (req, res) => {
    try {
        const user_id = req.id;
        const [rows] = await pool.query(
            "INSERT INTO user_chatbot (user_id) VALUES(?)",
            [user_id]
        );
        res.json(rows[0]);
    } catch (err) {
        console.error(err.message);
    }
}

export const getUsersChatbot = async (req, res) => {
    try {
        const allUsersChatbot = await pool.query("SELECT * FROM user_chatbot");
        res.json(allUsersChatbot.rows);
    } catch (err) {
        console.error(err.message);
    }
}
