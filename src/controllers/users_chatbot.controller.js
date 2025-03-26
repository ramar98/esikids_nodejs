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

export const getUsersChatbotByCourse = async (req, res) => {
    try {
        const { course_id } = req.params;
        const [rows] = await pool.query("SELECT uc.* FROM user_chatbot uc JOIN student s ON uc.user_id = s.user_id JOIN course_student cs ON s.id = cs.student_id WHERE cs.course_id = ?",
            [course_id]
        );
        res.json(rows);
    } catch (err) {
        console.error(err.message);
    }
}
