import { pool } from "../db.js";

export const getStudents = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM student");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const getStudentsWithUsername = async (req, res) => {
  const { school_id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT s.*, u.username FROM student s JOIN user u ON s.user_id = u.id WHERE s.school_id = ?",
      [school_id]
    );
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
    const { user_id, name, lastname, birthdate, school_id, avatar } = req.body;
    const [rows] = await pool.query(
      "INSERT INTO student (user_id, name, lastname, birthdate, school_id, avatar) VALUES (?, ?, ?, ?, ?, ?)",
      [user_id, name, lastname, birthdate, school_id, avatar]
    );
    res.status(201).json({ id: rows.insertId, user_id, name, lastname, school_id, avatar });
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, name, lastname, birthdate, school_id, avatar } = req.body;
    const [result] = await pool.query(
      "UPDATE student SET user_id = IFNULL(?, user_id), name = IFNULL(?, name), lastname = IFNULL(?, lastname), birthdate = IFNULL(? , birthdate), school_id = IFNULL(?, school_id), avatar = IFNULL(?, avatar) WHERE id = ?",
      [user_id, name, lastname, birthdate, school_id, avatar, id]
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
