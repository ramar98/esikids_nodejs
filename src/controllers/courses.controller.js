import { pool } from "../db.js";

export const getCoursesByUserId = async (req, res) => {
    try {
      const user_id  = req.id;
      const [rows] = await pool.query(
        "SELECT * FROM COURSE WHERE teacher_id = (SELECT id FROM teacher WHERE user_id = ?)", [
        user_id,
      ]);
  
      if (rows.length <= 0) {
        return res.status(404).json({ message: "Course not found" });
      }
  
      res.json(rows);
    } catch (error) {
      return res.status(500).json({ message: "Something goes wrong" });
    }
  };

  