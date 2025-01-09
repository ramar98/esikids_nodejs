import { pool } from "../db.js";

export const getCoursesByUserId = async (req, res) => {
  try {
    const user_id = req.id;
    const [rows] = await pool.query(
      //"SELECT COURSE.*, escuela.nombre as schoolName FROM COURSE JOIN escuela ON COURSE.school_id = escuela.id WHERE COURSE.teacher_id = (SELECT id FROM //teacher WHERE user_id = ?)", [
      "select * from course",[
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
      "SELECT COURSE.*, escuela.nombre as schoolName FROM COURSE JOIN escuela ON COURSE.school_id = escuela.id WHERE COURSE.teacher_id = (SELECT id FROM teacher WHERE user_id = ?) AND COURSE.id = ?", [
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
    const { name, schoolName, courseAge, course_id } = req.body;
    console.log(name, schoolName, courseAge, user_id, course_id);
    const [rows] = await pool.query(
      "UPDATE COURSE SET name = ?, schoolName = ?, courseAge = ? WHERE teacher_id = (SELECT id FROM teacher WHERE user_id = ?) AND id = ?", [
      name, schoolName, courseAge, user_id, course_id
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
      "INSERT INTO COURSE (teacher_id, name, school_id, courseAge) VALUES (?, ?, ?, ?)", [
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
      "DELETE FROM COURSE WHERE teacher_id = (SELECT id FROM teacher WHERE user_id = ?) AND id = ?", [
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


