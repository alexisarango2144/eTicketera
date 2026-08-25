import mongoose from "mongoose";

export const connectDB = async()=>{
  try {
    const mongoURI = process.env.MONGO_URI;
    if(!mongoURI) throw new Error("MONGO_URI no ha sido definida en el archivo .env");
    
    await mongoose.connect(mongoURI);

    console.log("Conectado a MongoDB");
    
  } catch (error) {
    console.error("Error conectando a MongoDB", error);
  }
}