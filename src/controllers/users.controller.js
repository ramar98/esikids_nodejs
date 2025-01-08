import { pool } from "../db.js";

export const getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM user");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const getUserWithDataByToken = async (req, res) => {
  try {
    const user_id = req.id;
    console.log(user_id);
    const [userRows] = await pool.query(
      "SELECT * FROM user WHERE id = ?", [
      user_id,
    ]);

    if (userRows.length <= 0) {
      return res.json(false);
    }

    const user = userRows[0];
    let additionalData = {};

    if (user.rol === 'student') {
      const [studentRows] = await pool.query(
        "SELECT * FROM student WHERE user_id = ?", [
        user_id,
      ]);
      additionalData = studentRows[0] || {};
    } else if (user.rol === 'teacher') {
      const [teacherRows] = await pool.query(
        "SELECT * FROM teacher WHERE user_id = ?", [
        user_id,
      ]);
      additionalData = teacherRows[0] || {};
    } else if (user.rol === 'tutor') {
      const [tutorRows] = await pool.query(
        "SELECT * FROM tutor WHERE user_id = ?", [
        user_id,
      ]);
      additionalData = tutorRows[0] || {};
    }

    res.json({ ...user, ...additionalData });
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const validateStudentEmail = async (req, res) => {
  try {
    const { studentEmail } = req.body;
    const [rows] = await pool.query("SELECT * FROM user WHERE email = ? or studentemail = ?", [
      studentEmail, studentEmail,
    ]);

    if (rows.length <= 0) {
      return res.json(true);
    }
    else {
      return res.json(false);
    }
  }
  catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
}

export const validateEmail = async (req, res) => {
  try {
    const { email, rol } = req.body;
    if (rol !== 'student') {
      const [rows] = await pool.query("SELECT * FROM user WHERE studentemail = ? OR (email = ? AND rol = ?)", [
        email, email, rol,
      ]);

      if (rows.length <= 0) {
        return res.json(true);
      }
      else {
        return res.json(false);
      }
    }
    else if (rol === 'student') {
      const [rows] = await pool.query("SELECT * FROM user WHERE studentemail = ?", [
        email,
      ]);

      if (rows.length <= 0) {
        return res.json(true);
      }
      else {
        return res.json(false);
      }
    }
  }
  catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
}


export const validateDni = async (req, res) => {
  try {
    const { dni } = req.body;
    console.log(dni);
    const [rows] = await pool.query("SELECT * FROM teacher WHERE dni = ?", [
      dni,
    ]);

    if (rows.length <= 0) {
      return res.json(true);
    }
    else {
      return res.json(false);
    }
  }
  catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
}

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM user WHERE id = ?", [
      id,
    ]);

    if (rows.length <= 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("DELETE FROM user WHERE id = ?", [id]);

    if (rows.affectedRows <= 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { username, pass, email } = req.body;
    const [rows] = await pool.query(
      "INSERT INTO user (username, pass, email) VALUES (?, ?, ?)",
      [username, pass, email]
    );
    res.status(201).json({ id: rows.insertId, username, pass, email });
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, pass, email } = req.body;

    const [result] = await pool.query(
      "UPDATE user SET username = IFNULL(?, username), pass = IFNULL(?, pass) , email = IFNULL(?, email) WHERE id = ?",
      [username, pass, email, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "User not found" });

    const [rows] = await pool.query("SELECT * FROM user WHERE id = ?", [
      id,
    ]);

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};
