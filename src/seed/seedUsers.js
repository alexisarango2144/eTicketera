import "dotenv/config";
import mongoose from "mongoose";

import { UserDAO } from "../dao/users.dao.js";
import { createHash } from "../utils/hash.js";
const userDAO = new UserDAO();

// ======================================================
// SEED: crear los 3 usuarios de prueba para los roles
//   user      -> role "user"
//   organizer -> role "organizer"
//   admin     -> role "admin"
//
// Uso:  npm run seed:users
// ======================================================

const USERS = [
  {
    first_name: "Ana",
    last_name: "Gomez",
    email: "user@example.com",
    password: "123456",
    role: "user",
  },
  {
    first_name: "Carlos",
    last_name: "Lopez",
    email: "organizer@example.com",
    password: "123456",
    role: "organizer",
  },
  {
    first_name: "Diego",
    last_name: "Perez",
    email: "organizer2@example.com",
    password: "123456",
    role: "organizer",
  },
  {
    first_name: "Elena",
    last_name: "Diaz",
    email: "admin@example.com",
    password: "123456",
    role: "admin",
  },
];

async function seedUsers() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB conectado");

  for (const u of USERS) {
    const existing = await userDAO.findByEmail(u.email);
    if (existing) {
      console.log(`SKIP — ${u.email} (ya existe, role=${existing.role})`);
      continue;
    }

    const hashedPassword = await createHash(u.password);
    await userDAO.create({
      first_name: u.first_name,
      last_name: u.last_name,
      email: u.email,
      password: hashedPassword,
      role: u.role,
      provider: "local",
      providerId: null,
    });
    console.log(`OK — ${u.email} creada con role=${u.role}`);
  }

  console.log("\nCredenciales de login:");
  console.log("  user        -> user@example.com / 123456");
  console.log("  organizer   -> organizer@example.com / 123456");
  console.log("  organizer2  -> organizer2@example.com / 123456");
  console.log("  admin       -> admin@example.com / 123456");

  await mongoose.disconnect();
  process.exit(0);
}

seedUsers().catch((error) => {
  console.error("Error en seed:", error);
  process.exit(1);
});
