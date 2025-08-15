import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
    {
        uid: { type: String, default: "" },
        name: String,
        slug: String,
        fixed: { type: Boolean, default: false }
    }, { timestamps: true }
)

export default mongoose.models.category || mongoose.model("category", categorySchema);