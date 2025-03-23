import { pool } from "../db.js";

export const getGames = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM game");
        res.json(rows);
    } catch (err) {
        console.error(err.message);
    }
};

export const getMostPlayedGameByCourse = async (req, res) => {
    const { course_id } = req.params;
    try {
        const [rows] = await pool.query(
            "WITH juegos_del_curso AS (Select g.id as game_id from game g join course c on g.age = c.courseAge where c.id = ?), stages_por_juego AS (Select s.id as stage_id, s.game_id from stage s join juegos_del_curso j on s.game_id = j.game_id), alumnos_del_curso AS (Select cs.student_id from course_student cs where cs.course_id = ?), completaciones_por_juego AS (Select spj.game_id, count(*) as completaciones from user_stage us join stages_por_juego spj on us.stage_id = spj.stage_id where us.user_id in (Select s.user_id from student s where s.id in (Select student_id from alumnos_del_curso)) group by spj.game_id) Select g.id as game_id, g.name, cpj.completaciones from completaciones_por_juego cpj join game g on cpj.game_id = g.id order by cpj.completaciones desc limit 1;",[
                course_id, course_id
            ]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "No games found for this course" });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
