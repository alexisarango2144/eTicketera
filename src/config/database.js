import mongoose from "mongoose";
import { CustomError } from "../utils/custom-error.js";

export const connectDB = async()=>{
  try {
    const mongoURI = process.env.MONGO_URI;
    if(!mongoURI) throw CustomError.internal("Error inicializando la base de datos del servidor. MONGO_URI no ha sido definida en el archivo .env");
    
    await mongoose.connect(mongoURI);

    console.log("Conectado a MongoDB");
    
  } catch (error) {
    throw CustomError.internal("Error inicializando la base de datos del servidor", { cause: error });
  }
}