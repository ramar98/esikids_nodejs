import { pool } from "../db.js";

export const getStudents = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM student");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const getStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM student WHERE id = ?", [
      id,
    ]);

    if (rows.length <= 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("DELETE FROM student WHERE id = ?", [id]);

    if (rows.affectedRows <= 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const createStudent = async (req, res) => {
  try {
    const { user_id, name, lastname, birthdate, avatar } = req.body;
    const age = new Date().getFullYear() - new Date(birthdate).getFullYear();
    const [rows] = await pool.query(
      "INSERT INTO student (user_id, name, lastname, birthdate, age, avatar) VALUES (?, ?, ?, ?, ?, ?)",
      [user_id, name, lastname, birthdate, age, avatar]
    );
    res.status(201).json({ id: rows.insertId, user_id, name, lastname, age});
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, name, lastname, birthdate, avatar } = req.body;
    let age = null;
    if (birthdate) {
      age = new Date().getFullYear() - new Date(birthdate).getFullYear();
    }

    const [result] = await pool.query(
      "UPDATE student SET user_id = IFNULL(?, user_id), name = IFNULL(?, name), lastname = IFNULL(?, lastname), birthdate = IFNULL(? , birthdate), age = IFNULL(?, age), avatar = IFNULL(?, avatar) WHERE id = ?",
      [user_id, name, lastname, birthdate, age, avatar, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Student not found" });

    const [rows] = await pool.query("SELECT * FROM student WHERE id = ?", [
      id,
    ]);

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};
