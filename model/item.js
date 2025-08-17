import mongoose, { Schema } from "mongoose";

const itemSchema = new Schema(
    {
        uid: String,
        name: String,
        slug: String,
        category: String,
        price: Schema.Types.Mixed,
        inStock: Boolean
    }, { timestamps: true }
)

export default mongoose.models.item || mongoose.model("item", itemSchema);