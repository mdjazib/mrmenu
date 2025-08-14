import mongoose from "mongoose"
export async function connection() { if (mongoose.connection.readyState === 0) await mongoose.connect(process.env.MONGO_URI) }