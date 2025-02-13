import { pool } from "../db.js";

export const getCoursesByUserId = async (req, res) => {
  try {
    const user_id = req.id;
    const [rows] = await pool.query(
      "SELECT course.*, escuela.nombre AS schoolName FROM course JOIN escuela ON course.school_id = escuela.id JOIN teacher ON course.teacher_id = teacher.id WHERE teacher.user_id = ?", [
      user_id,
    ]);

    if (rows.length <= 0) {
      return res.json(false);
    }

    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const user_id = req.id;
    const { course_id } = req.params;
    const [rows] = await pool.query(
      "SELECT course.*, escuela.nombre as schoolName FROM course JOIN escuela ON course.school_id = escuela.id WHERE course.teacher_id = (SELECT id FROM teacher WHERE user_id = ?) AND course.id = ?", [
      user_id, course_id
    ]);

    if (rows.length <= 0) {
      return res.json(false);
    }

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
}

export const updateCourse = async (req, res) => {
  try {
    const user_id = req.id;
    const { name, school_id, courseAge, course_id } = req.body;
    const [rows] = await pool.query(
      "UPDATE course SET name = ?, school_id = ?, courseAge = ? WHERE teacher_id = (SELECT id FROM teacher WHERE user_id = ?) AND id = ?", [
      name, school_id, courseAge, user_id, course_id
    ]);

    if (rows.affectedRows <= 0) {
      return res.json(false);
    }

    res.json(true);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
}

export const createCourse = async (req, res) => {
  try {
    const user_id = req.id;
    const { name, school_id, courseAge } = req.body;
    const [teachers] = await pool.query(
      "SELECT id FROM teacher WHERE user_id = ?", [
      user_id,
    ]);
    if (teachers.length <= 0) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    const teacher_id = teachers[0].id;
    const [rows] = await pool.query(
      "INSERT INTO course (teacher_id, name, school_id, courseAge) VALUES (?, ?, ?, ?)", [
      teacher_id, name, school_id, courseAge
    ]);

    res.json(true);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
}

export const deleteCourse = async (req, res) => {
  try {
    const user_id = req.id;
    const { course_id } = req.params;
    const [rows] = await pool.query(
      "DELETE FROM course WHERE teacher_id = (SELECT id FROM teacher WHERE user_id = ?) AND id = ?", [
      user_id, course_id
    ]);

    if (rows.affectedRows <= 0) {
      return res.json(false);
    }

    res.json(true);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
}


