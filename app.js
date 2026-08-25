import express from "express";
import "dotenv/config";
import { connectDB } from "./src/config/database.js";
import apiRouter from "./src/routes/index.js";
import cookieParser from "cookie-parser";

export const app = express();

const port = process.env.PORT;

app.listen(port, () => console.log(`Server running on port ${port}`));

app.use(express.json());
app.use(cookieParser());

// app.use(
//   session({
//     secret: "secret-sessions",
//     cookie: {
//       httpOnly: true,
//       sameSite: "lax",
//       secure: process.env.NODE_ENV == "production",
//       maxAge: 60 * 60 * 1000,
//     },
//   }),
// );

app.use(express.urlencoded({ extended: true }));

connectDB();

// Rutas API
app.use("/api", apiRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));
