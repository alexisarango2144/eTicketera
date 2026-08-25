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

app.use(express.urlencoded({ extended: true }));

connectDB();

// Rutas API
app.use("/api", apiRouter);

// Manejo de error 404
app.use((req, res, next) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    message: `La ruta ${req.originalUrl} no existe en este servidor`
  });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
