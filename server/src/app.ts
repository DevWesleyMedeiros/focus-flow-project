import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { authRouter } from "./routes/authRoutes";

const app = express();
app.disabled("x-powered-by");
app.set("trust proxy", 1);

// Middlewares globais
app.use(helmet());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env["CLIENT_ORIGIN"] || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

// Rotas
app.use("/api/auth", authRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export { app };
