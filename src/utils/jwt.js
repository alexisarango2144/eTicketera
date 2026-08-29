import jwt from "jsonwebtoken";

export const generateJWT = (user) => {
  return jwt.sign(
    {
      id: user.id.toString(),
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h"
    }
  );
};

export const verifyJWT = token => {
  return jwt.verify(token, process.env.JWT_SECRET);
}