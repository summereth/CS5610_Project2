import { MongoClient } from "mongodb";
import "dotenv/config";

const client = new MongoClient(process.env.MONGO_URI);

export default async function connectDB() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("MongoDB connected successfully");
    return client;
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }
}
