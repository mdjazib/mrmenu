import mongoose, { Schema } from "mongoose";

const dealSchema = new Schema(
    {
        uid: String,
        name: String,
        slug: String,
        price: String,
        save: String,
        items: Array,
        available: { type: Boolean, default: true }
    }, { timestamps: true }
)

export default mongoose.models.deal || mongoose.model("deal", dealSchema);