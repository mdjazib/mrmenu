import mongoose, { Schema } from "mongoose";

const accountSchema = new Schema(
    {
        name: String,
        email: String,
        username: String,
        password: String,
        picture: String
    }, { timestamps: true }
)

export default mongoose.models.account || mongoose.model("account", accountSchema);