import express from "express";
import { connectDB } from "./src/config/database.js";
import apiRouter from "./src/routes/index.js";
import cookieParser from "cookie-parser";
import passport from "./src/config/passport.config.js";

export const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

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


