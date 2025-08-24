import mongoose from "mongoose";

const cached = (global as any).mongoose || { conn: null, promise: null };

export default async function connectDB() {
  mongoose.set("strictQuery", true);
  if (!process.env.MONGODB_URL) return console.log("MONGODB_URL not found");

  if (cached.conn) return cached.conn;

  try {
    if (!cached.promise) {
      cached.promise = mongoose
        .connect(process.env.MONGODB_URL!)
        .then((conn) => conn.connection);
    }
    cached.conn = await cached.promise;
    (global as any).mongoose = cached;
    console.log("Connected to MongoDB");
    return cached.conn;
  } catch (e) {
    console.log(e);
  }
}
