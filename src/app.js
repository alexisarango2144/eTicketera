import express from "express";
import { __dirname } from "./utils/utils.js";
import apiRouter from "./routes/index.js"

export const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Rutas API
app.use("/api", apiRouter);