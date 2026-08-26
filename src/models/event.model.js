import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true
    },
    descripcion: {
      type: String,
      required: true,
      trim: true
    },
    categoria: {
      type: String,
      trim: true
    },
    capacidad_maxima: {
      type: Number
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model(
  "Event", eventSchema
);



