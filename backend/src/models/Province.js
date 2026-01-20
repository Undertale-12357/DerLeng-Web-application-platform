import mongoose from "mongoose";

const provinceSchema = new mongoose.Schema({
  province_name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

export default mongoose.model("Province", provinceSchema);
