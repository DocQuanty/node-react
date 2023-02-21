import { Model } from "mongoose";
import PostModel from "../models/Post.js";

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      // req.body - то что передает полльзователь
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      //   то что приходит не с клиента, а с бекенда
      user: req.userId,
    });

    const post = await doc.save();
    res.json(post);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      massage: "Post is not created, somthing went wrong!",
    });
  }
};
