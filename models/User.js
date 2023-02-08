import mongoose from "mongoose";

const UserScheme = new mongoose.Schema(
  {
    fullName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      // уникальность
      unique: true,
    },
    passwordHash: {
      type: String,
      require: true,
    },
    avatarUrl: String,
  },
  { timestamps: true }
);
// timestamps дата создания

export default mongoose.model("Users", UserScheme);
