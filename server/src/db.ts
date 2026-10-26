import mongoose from "mongoose";
import "./models/index.ts";

const MONGO_URL = process.env.MONGO_URL;
const MONGO_DB = process.env.MONGO_DB ?? "due_it";

async function connectDb() {
  if (!MONGO_URL) throw new Error("MONGO_URL is not set");

  await mongoose.connect(MONGO_URL, { dbName: MONGO_DB });
}

export default connectDb;
