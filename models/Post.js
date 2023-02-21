import mongoose from "mongoose";

const PostScheme = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    text: {
      type: String,
      require: true,
      unique: true,
    },
    tags: {
      type: Array,
      require: true,
      unique: true,
    },
    imageUrl: {
      type: String,
      require: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    user: {
      // в базе данних есть специальная айдишка которую и указываем
      type: mongoose.Schema.Types.ObjectId,
      // своййство юзхер будет ссылаться на отдельную модель
      ref: "User",
      required: true,
    },
    imageUrl: String,
  },
  { timestamps: true }
);
// timestamps дата создания

export default mongoose.model("Post", PostScheme);
