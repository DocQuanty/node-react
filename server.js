import express, { application } from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validation.js";

import { handleValidationErrors, chekAuth } from "./utils/index.js";
import { UserController, PostController } from "./controllers/index.js";

const PORT = 3000;
// ======connect DB
const userDB = "Kostya";
const pathDB = `mongodb+srv://${userDB}:jY3DFmwE5yo8NkXp@cluster0.muq21xi.mongodb.net/blog?retryWrites=true&w=majority`;
mongoose
  .set("strictQuery", true)
  .connect(pathDB)
  .then(() => {
    console.log("Connect DB is success");
  })
  .catch((err) => {
    console.log("Error with connect DB");
    console.log(err);
  });
// ======multer======
// создаем хранилище destination для загрузки картинки multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const uploads = multer({ storage: storage });

// ======multer======
const app = express();
// ====middleware====
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
// ======routes======
app.get("/", (req, res) => {
  res.send("123");
});
// загрузка картинки с помощью multer
app.post("/uploads", chekAuth, uploads.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});
// авторизация
app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
//регистрация- проверка вторым параметром, если прошла успешно тогда выполняеться колбек
app.post(
  "/auth/registration",
  registerValidation,
  handleValidationErrors,
  UserController.registration
);
// до авторизации передаем функцию проверку chekAuth которая обьязательно должна вернуть next , проверка на авторизацию
app.get("/auth/info", chekAuth, UserController.getInfo);
// ===CRUD operations===
// операции выполняються по очереди один за одиним
// chekAuth - проверка на авторизацию
// postCreateValidation - проверка на валидацию
app.get("/post/:id", handleValidationErrors, PostController.getOnePost);
app.get("/posts", PostController.getAllPosts);
// защищенные роуты
app.post("/posts", chekAuth, postCreateValidation, PostController.createPost);
app.delete("/post/:id", chekAuth, PostController.deletePost);
// patch для обновления
app.patch(
  "/post/:id",
  chekAuth,
  postCreateValidation,
  PostController.updatePost
);
// app.post("/posts", PostController.create);

app.listen(PORT, () => {
  console.log(`SERVER START AND WORK AT ${PORT} PORT`);
});
