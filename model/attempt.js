import mongoose, { Schema } from "mongoose";

const attemptSchema = new Schema({
    device: String,
    attempts: { type: Number, default: 6 },
    expiresAt: {
        type: Date,
        expires: { index: 0 }
    }
})

export default mongoose.models.attempt || mongoose.model("attempt", attemptSchema);