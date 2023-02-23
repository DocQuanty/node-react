import { Model } from "mongoose";
import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
  try {
    // связываем теблицы с помощью populate, одной связью
    const allPosts = await PostModel.find().populate("user").exec();
    res.json(allPosts);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      massage: "Post is not created, something went wrong!",
    });
  }
};
// возврат одной статьи
export const getOnePost = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndUpdate(
      // 1м параметром найти по _id
      {
        _id: postId,
      },
      // 2м параметром инкрементируем viewCount на 1. Специфический синтаксис.
      {
        $inc: { viewCount: 1 },
      },
      // 3м параметром передаем опции что после обновления вернуть актуальный (обновленный документ)
      {
        returnDocument: "after",
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Post is not returned!",
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: "Post is not found!",
          });
        }

        res.json(doc);
      }
    );
  } catch (e) {
    console.log(e);
    res.status(500).json({
      massage: "Post is not created, something went wrong!",
    });
  }
};

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
    console.log(doc);

    const post = await doc.save();
    res.json(post);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      massage: "Post is not created, something went wrong!",
    });
  }
};
