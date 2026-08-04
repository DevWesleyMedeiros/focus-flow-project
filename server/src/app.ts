// TODO: Arquivo principal do Express app - configurar middlewares, rotas, CORS
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { authRoutes } from "./routes/authRoutes";

const app = express();

// Middlewares globais
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000" }));
app.use(express.json());

// Rotas
app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export { app };
