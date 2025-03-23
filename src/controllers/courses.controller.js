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

export const getStudentsCompletedAllGames = async (req, res) => {
  try {
    const { course_id } = req.params;
    const [rows] = await pool.query(
      "WITH juegos_del_curso AS (SELECT g.id AS game_id FROM game g JOIN course c ON g.age = c.courseAge WHERE c.id = ?), stages_por_curso AS (SELECT s.id AS stage_id FROM stage s WHERE s.game_id IN(SELECT game_id FROM juegos_del_curso)), alumnos_del_curso AS (SELECT cs.student_id FROM course_student cs WHERE cs.course_id = ?), alumnos_con_stages_completados AS( SELECT us.user_id FROM user_stage us WHERE us.stage_id IN(SELECT stage_id FROM stages_por_curso) AND us.user_id IN(SELECT s.user_id FROM student s WHERE s.id IN(SELECT student_id FROM alumnos_del_curso)) GROUP BY us.user_id HAVING COUNT(DISTINCT us.stage_id) = (SELECT COUNT(*) FROM stages_por_curso)) SELECT u.id AS student_id, u.username, u.email FROM alumnos_con_stages_completados acsc JOIN user u ON acsc.user_id = u.id", [
      course_id, course_id
    ]);

    if (rows.length <= 0) {
      return res.json([]);
    }

    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};


