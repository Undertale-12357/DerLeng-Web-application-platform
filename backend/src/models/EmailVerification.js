import mongoose from "mongoose";
const emailVerificationSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true,
  },
  code: {
    type: String,
    require: true,
  },
  expiresAt: {
    type: Date,
    require: true,
  },
});

export default mongoose.model("EmailVerification", emailVerificationSchema);
