import mongoose, { Schema } from "mongoose";

const loginSchema = new Schema(
    {
        deviceId: String,
        accountId: String,
        ip: String,
        pixels: String,
        platform: String,
        geo: Object,
        expiresAt: {
            type: Date,
            expires: { index: 0 }
        }
    }, { timestamps: true }
)

export default mongoose.models.login || mongoose.model("login", loginSchema);