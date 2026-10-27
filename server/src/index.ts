import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import mongoose from "mongoose";
import multer from "multer";
import * as z from "zod";
import connectDb from "./db.ts";
import { assistantRouter, authRouter, workspaceRouter } from "./routes/index.ts";
import { HttpError } from "./utils/index.ts";

const PORT = Number(process.env.PORT ?? 3000);

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/workspaces", workspaceRouter);
app.use("/api/assistant", assistantRouter);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ message: err.message });
    return;
  }

  if (err instanceof z.ZodError) {
    res.status(400).json({ message: z.prettifyError(err) });
    return;
  }

  if (
    err instanceof mongoose.Error.ValidationError ||
    err instanceof mongoose.Error.CastError ||
    err instanceof multer.MulterError ||
    err instanceof SyntaxError
  ) {
    res.status(400).json({ message: err.message });
    return;
  }

  if ((err as { code?: unknown }).code === 11000) {
    res.status(409).json({ message: "Already exists" });
    return;
  }

  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

await connectDb();

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
