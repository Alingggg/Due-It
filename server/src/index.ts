import express from "express";
import connectDb from "./db.ts";

const PORT = Number(process.env.PORT ?? 3000);

const app = express();

app.use(express.json());

await connectDb();

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
