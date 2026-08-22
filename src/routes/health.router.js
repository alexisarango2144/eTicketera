import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    res.status(200).send({ status: "ok", message: "Servidor activo" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
