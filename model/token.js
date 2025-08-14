import mongoose, { Schema } from "mongoose";

const tokenSchema = new Schema({
    token: String,
    next: Object,
    expiresAt: {
        type: Date,
        index: { expires: 0 }
    }
})

export default mongoose.models.token || mongoose.model("token", tokenSchema);