import { pool } from "../db.js";

export const getSchools = async (req, res) => {
    try {
        const user_id = req.id;
        const [rows] = await pool.query(
            "SELECT * FROM escuela");

        if (rows.length <= 0) {
            return res.status(404).json({ message: "Escuelas not found" });
        }

        res.json(rows);
    } catch (error) {
        return res.status(500).json({ message: "Something goes wrong" });
    }
};

export const getSchool = async (req, res) => {
    try {
        const user_id = req.id;
        const { id } = req.params;
        const [rows] = await pool.query(
            "SELECT * FROM escuela WHERE id = ?", [id]);

        if (rows.length <= 0) {
            return res.status(404).json({ message: "Escuela not found" });
        }

        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({ message: "Something goes wrong" });
    }
}