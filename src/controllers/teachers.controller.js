import { pool } from "../db.js";

export const getTeachers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM teacher");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const getTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM teacher WHERE id = ?", [
      id,
    ]);

    if (rows.length <= 0) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("DELETE FROM teacher WHERE id = ?", [id]);

    if (rows.affectedRows <= 0) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const createTeacher = async (req, res) => {
  try {
    const { user_id, name, lastname, birthdate, avatar, dni } = req.body;
    const age = new Date().getFullYear() - new Date(birthdate).getFullYear();
    const [rows] = await pool.query(
      "INSERT INTO teacher (user_id, name, lastname, birthdate, age, avatar, dni) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [user_id, name, lastname, birthdate, age, avatar, dni]
    );
    res.status(201).json({ id: rows.insertId, user_id, name, lastname, birthdate, age, avatar, dni });
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, name, lastname, birthdate, avatar } = req.body;
    let age = null;
    if (birthdate) {
      age = new Date().getFullYear() - new Date(birthdate).getFullYear();
    }

    const [result] = await pool.query(
      "UPDATE teacher SET user_id = IFNULL(?, user_id), name = IFNULL(?, name), lastname = IFNULL(?, lastname), age = IFNULL(?, age), avatar = IFNULL(?, avatar) WHERE id = ?",
      [user_id, name, lastname, age, avatar, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Teacher not found" });

    const [rows] = await pool.query("SELECT * FROM teacher WHERE id = ?", [
      id,
    ]);

    res.json(true);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};
