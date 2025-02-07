import { pool } from "../db.js";

export const getStudentsByCourse = async (req, res) => {
    const { course_id } = req.params; // ID del curso desde la URL.

    try {
        const query = `
            SELECT s.id, s.name, u.username, u.id AS user_id
            FROM student s
            JOIN course_student cs ON s.id = cs.student_id
            JOIN user u ON s.user_id = u.id
            WHERE cs.course_id = ?
        `;
        const [students] = await pool.query(query, [course_id]);

        res.json(students);
    }
    catch (error) {
        console.error("Error al obtener los alumnos del curso:", error);
        res.json(false);
    }
}

export const updateCourseStudents = async (req, res) => {

    const { course_Id } = req.params; // ID del curso desde la URL.
    const { studentIds } = req.body; // Lista de alumnos seleccionados

    try {
        // Obtener la lista actual de alumnos asociados al curso
        const [currentStudents] = await pool.query(
            'SELECT student_id FROM course_student WHERE course_id = ?',
            [course_Id]
        );
        const currentStudentIds = currentStudents.map(row => row.student_id);


        // Determinar alumnos para agregar
        const studentsToAdd = studentIds.filter(id => !currentStudentIds.includes(id));

        // Determinar alumnos para eliminar
        const studentsToRemove = currentStudentIds.filter(id => !studentIds.includes(id));

        // Obtener los nombres de usuario de los alumnos a agregar
        let usernamesToAdd = [];
        if (studentsToAdd.length > 0) {
            const [rows] = await pool.query(
                'SELECT u.username FROM user u JOIN student s ON u.id = s.user_id WHERE s.id IN (?)',
                [studentsToAdd]
            );
            usernamesToAdd = rows.map(row => row.username);
        }

        // Obtener los nombres de usuario de los alumnos a eliminar
        let usernamesToRemove = [];
        if (studentsToRemove.length > 0) {
            const [rows] = await pool.query(
                'SELECT u.username FROM user u JOIN student s ON u.id = s.user_id WHERE s.id IN (?)',
                [studentsToRemove]
            );
            usernamesToRemove = rows.map(row => row.username);
        }

        // Agregar nuevos alumnos
        if (studentsToAdd.length > 0) {
            const values = studentsToAdd.map(id => [course_Id, id]);
            await pool.query('INSERT INTO course_student (course_id, student_id) VALUES ?', [values]);
        }

        // Eliminar alumnos desasociados
        if (studentsToRemove.length > 0) {
            await pool.query(
                'DELETE FROM course_student WHERE course_id = ? AND student_id IN (?)',
                [course_Id, studentsToRemove]
            );
        }

        res.json({ success: true, usernamesToAdd, usernamesToRemove });
    } catch (error) {
        console.error('Error updating course students:', error);
        res.status(500).json({ error: 'Error actualizando el curso' });
    }
};

export const addStudentsToCourse = async (req, res) => {
    const { course_id } = req.params; // ID del curso desde la URL.
    const { students } = req.body; // Lista de IDs de students en el cuerpo de la solicitud.

    if (!Array.isArray(students) || students.length === 0) {
        return res.status(400).json({ message: "Debe proporcionar una lista de students." });
    }

    try {
        const values = students.map(student_id => [course_id, student_id]); // Crear un array de [curso_id, alumno_id]

        // Usamos el INSERT con múltiples valores.
        const query = `
      INSERT INTO course_student (course_id, student_id)
      VALUES ?
    `;

        await pool.query(query, [values]);

        res.json(true);
    } catch (error) {
        console.error("Error al agregar students al curso:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};
