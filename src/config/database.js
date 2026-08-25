import mongoose from "mongoose";
import { CustomError } from "../utils/custom-error.js";

export const connectDB = async()=>{
  try {
    const mongoURI = process.env.MONGO_URI;
    if(!mongoURI) throw new CustomError("Error inicializando la base de datos del servidor. MONGO_URI no ha sido definida en el archivo .env", 500);
    
    await mongoose.connect(mongoURI);

    console.log("Conectado a MongoDB");
    
  } catch (error) {
    console.error("Error conectando a MongoDB", error);
  }
}