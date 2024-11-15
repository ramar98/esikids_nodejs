import { pool } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import nodemailer from "nodemailer";


export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await pool.query(
            "SELECT * FROM user WHERE username = ? ",
            [username]
        );

        if (rows.length === 0) {
            return res.status(401).json("Invalid credentials");
        }

        const match = await bcrypt.compare(password, rows[0].password);
        if (!match) {
            return res.status(401).json("Invalid credentials");
        }

        // Generate JWT token
        const token = jwt.sign({ userId: rows[0].id }, JWT_SECRET, {
            expiresIn: "1h"
        });

        let studentData;
        if (rows[0].rol === 'student') {
            [studentData] = await pool.query(
            "SELECT * FROM student WHERE user_id = ?",
            [rows[0].id]
            );
        } else if (rows[0].rol === 'teacher') {
            [studentData] = await pool.query(
            "SELECT * FROM teacher WHERE user_id = ?",
            [rows[0].id]
            );
        } else if (rows[0].rol === 'tutor') {
            [studentData] = await pool.query(
            "SELECT * FROM tutor WHERE user_id = ?",
            [rows[0].id]
            );
        }

        if (studentData.length === 0) {
            return res.status(404).json("Student data not found");
        }

        return res.json({ success: true, token: token, studentData: studentData[0] });

    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server error");
    }
};

export const registerUser = async (req, res) => {
    const { username, password, email, studentEmail, rol } = req.body;
    console.log(req.body);
    try {
        const [existingUser] = await pool.query(
            "SELECT * FROM user WHERE username = ?",
            [username]
        );

        if (existingUser.length > 0) {
            return res.json({
                success: false,
                key: "username"
            });
        }

        // Generate a salt to use for hashing
        const salt = await bcrypt.genSalt(10);
        // Hash the password using the generated salt
        const hashedPassword = await bcrypt.hash(password, salt);

        const [rows] = await pool.query(
            "INSERT INTO user (username, password, email, studentemail, rol) VALUES (?, ?, ?, ?, ?)",
            [username, hashedPassword, email, studentEmail, rol]
        );
        return res.json({ success: true, id: rows.insertId, username, hashedPassword, email, studentEmail, rol });
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server error");
    }
};

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "esikidstesis@gmail.com",
        pass: "vwwi eatk leyw rxqn",
    },
});

export const sendVerificationCode = async (req, res) => {
    const { username } = req.body;

    try {
        // Generate a verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        const [user] = await pool.query(
            "SELECT * FROM user WHERE username = ?",
            [username]
        );

        if (user.length === 0) {
            return res.status(404).json("User not found");
        }

        const userId = user[0].id;
        const email = user[0].email;
        const studentemail = user[0].studentemail;

        // Calcular la fecha de expiración (ejemplo: 15 minutos desde ahora)
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        // Almacenar el código en la base de datos
        await pool.query(
            "INSERT INTO password_reset_code (user_id, code, expires_at, used) VALUES (?, ?, ?, FALSE)",
            [userId, verificationCode, expiresAt]
        );

        // Configurar el email
        const mailOptions = {
            from: '"EsiKids" <esikidstesis@gmail.com>',
            to: [email, studentemail],
            subject: "Restablece tu contraseña",
            text: `Your verification code is: ${verificationCode}`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        return res.json({ success: true, verificationCode });
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server error");
    }
};

export const validateCode = async (req, res) => {
    const { username, code } = req.body;

    try {
        // Verificar que el código existe, no ha expirado, y no ha sido usado
        const [rows] = await pool.query(
            "SELECT * FROM password_reset_code WHERE user_id = (SELECT id FROM user WHERE username = ?) AND code = ? AND expires_at > NOW() AND used = FALSE",
            [username, code]
        );

        if (rows.length === 0) {
            return res.status(400).json({ message: "Invalid or expired code" });
        }

        // Si es válido, marcar el código como usado
        await pool.query(
            "UPDATE password_reset_code SET used = TRUE WHERE id = ?",
            [rows[0].id]
        );

        return res.json({ success: true });

    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server error");
    }
};

export const resetPassword = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Generar un salt para usar en el hash
        const salt = await bcrypt.genSalt(10);
        // Hash the password using the generated salt
        const hashedPassword = await bcrypt.hash(password, salt);

        // Actualizar la contraseña en la base de datos
        await pool.query(
            "UPDATE user SET password = ? WHERE username = ?",
            [hashedPassword, username]
        );
        return res.json({ success: true, message: "Password updated" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server error");
    }
};

export const sendUserByEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const [users] = await pool.query(
            "SELECT * FROM user WHERE email = ? or studentemail = ?",
            [email, email]
        );

        if (users.length === 0) {
            return res.status(404).json("No users found");
        }

        const mailOptions = {
            from: '"EsiKids" <esikidstesis@gmail.com>',
            to: [email],
            subject: "Usuarios asociados a tu email",
            text: `Users: ${users.map(user => user.username).join(", ")}`,
        };

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, users });
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server error");
    }
};



