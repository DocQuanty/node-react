import { Model } from "mongoose";
import PostModel from "../models/Post.js";

export const getAllPosts = async (req, res) => {
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
    // функиционал вместе с увелечением просмотров
    PostModel.findOneAndUpdate(
      // 1м параметром найти по _id
      {
        _id: postId,
      },
      // 2м параметром инкрементируем viewCount на 1. Специфический синтаксис.
      // Увеоичиваем просмотри
      {
        $inc: { viewCount: 1 },
      },
      // 3м параметром передаем опции что после обновления вернуть актуальный (обновленный документ)
      {
        returnDocument: "after",
      },
      // функция которая будет обноваляться, после всего вывести ошибку или вернуть документ
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
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Post wasn't deleted!",
          });
        }
        if (!doc) {
          return res.status(500).json({
            message: "Post wasn't found!",
          });
        }
        res.json({
          message: "Post are deleted!",
        });
      }
    );
  } catch (e) {
    console.log(e);
    res.status(500).json({
      massage: "Post is not created, something went wrong!",
    });
  }
};
export const createPost = async (req, res) => {
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
export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const doc = PostModel.updateOne(
      // находит по первому параметру
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        //   то что приходит не с клиента, а с бекенда
        user: req.userId,
      }
    );
    res.json({
      message: "Post are updated!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      massage: "Post is not created, something went wrong!",
    });
  }
};
