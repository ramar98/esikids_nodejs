import { config } from "dotenv";
config();

export const PORT = process.env.PORT || 8080;
export const DB_HOST = process.env.DB_HOST || "mysql.railway.internal";
export const DB_USER = process.env.DB_USER || "root";
export const DB_PASSWORD = process.env.DB_PASSWORD || "SwtNhdYMFyatIrWhfjCbAegCZYRAJWIv";
export const DB_DATABASE = process.env.DB_DATABASE || "railway";
export const DB_PORT = process.env.DB_PORT || 3306;
export const JWT_SECRET = process.env.JWT_SECRET || "secret";
