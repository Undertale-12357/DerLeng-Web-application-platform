import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  category_name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

export default mongoose.model("Category", categorySchema);
