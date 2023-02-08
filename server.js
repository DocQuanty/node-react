import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { registerValidation } from "./validation/auth.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import UserModel from "./models/User.js";
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
// ======
const app = express();
// ====middleware====
app.use(express.json());

// ======routes======
app.get("/", (req, res) => {
  res.send("123");
});
// проверка вторым параметром, если прошла успешно тогда выполняеться колбек
app.post("/auth/registration", registerValidation, async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      // при ошибке вернет масив с обьектом про ошибку
      return res.status(400).json(error.array());
    }
    // получение пароля
    const UserPassword = req.body.password;

    const salt = await bcrypt.genSalt(10);
    //   зашифрованый пароль котрый очень тяжело хакнуть
    const passwordHash = await bcrypt.hash(UserPassword, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash,
    });
    // зашифровуєм с помощью JWT наш Id
    const token = jwt.sign(
      // что хотим зашифровать
      { _id: doc._id },
      // кодовое слово с помощью которого хотим зашифровать (строка)
      "secret123",
      // срок действие токена(жетона) сколько будет он жить
      { expiresIn: "30d" }
    );
    //   сохраняем user в бд
    const user = await doc.save();
    //   возвращаем ответ котрый должен быть один(user обьект хранит в себе намного больший обьект потому разворачиваем его полглст'ю)
    res.json({ ...user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
});

app.get("/test", (req, res) => {});

app.listen(PORT, () => {
  console.log(`SERVER START AND WORK AT ${PORT} PORT`);
});
