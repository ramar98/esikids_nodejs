import express from "express";
import morgan from "morgan";

import studentsRoutes from "./routes/students.routes.js";
import tutorsRoutes from "./routes/tutors.routes.js";
import usersRoutes from "./routes/users.routes.js";
import indexRoutes from "./routes/index.routes.js";
import authRoutes from "./routes/auth.routes.js";
import teachersRoutes from "./routes/teachers.routes.js";
import coursesRoutes from "./routes/courses.routes.js";
import schoolsRoutes from "./routes/schools.routes.js";
import courses_studentsRoutes from "./routes/courses_students.routes.js";
import users_stagesRoutes from "./routes/users_stages.routes.js";
import games from "./routes/games.routes.js";
import stages from "./routes/stages.routes.js";
import users_chatbot from "./routes/users_chatbot.routes.js";

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/", indexRoutes);
app.use("/api", usersRoutes);
app.use("/api", studentsRoutes);
app.use("/api", authRoutes);
app.use("/api", teachersRoutes);
app.use("/api", coursesRoutes);
app.use("/api", schoolsRoutes);
app.use("/api", tutorsRoutes);
app.use("/api", courses_studentsRoutes);
app.use("/api", users_stagesRoutes);
app.use("/api", games);
app.use("/api", stages);
app.use("/api", users_chatbot);


app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

export default app;
