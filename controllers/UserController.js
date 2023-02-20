import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
// ===============
export const login = async (req, res) => {
  try {
    // проверка по email, находим пользователя
    const user = await UserModel.findOne({
      email: req.body.email,
    });
    // Если пользователь не найден
    if (!user) {
      return res.status(404).json({
        message: "Error authorization",
      });
    }
    // проверка на валидность пароля, сравниваеться пароль с запроса с паролем из документа хеша
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    // Если пароль неверний возвращаем сообщение про неверность данних
    if (!isValidPass) {
      return res.status(404).json({
        message: "Invalid password or login",
      });
    }
    // проверка на валидные данные, создаем новый токен
    const token = jwt.sign({ _id: user._id }, "secret123", {
      expiresIn: "30d",
    });
    // вытаскиваем хешированый пароль из обьеката user._doc
    const { passwordHash, ...userData } = user._doc;
    // формируем ответ
    res.status(200).json({ ...userData, token });
  } catch (error) {
    res.status(500).json({ message: "Problem with login" });
  }
};

export const registration = async (req, res) => {
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
    const hash = await bcrypt.hash(UserPassword, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
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
    // вытаскиваем значение passwordHash из обьекта и не передаем его в ответ json
    const { passwordHash, ...userData } = user._doc;
    //   возвращаем ответ котрый должен быть один(user обьект хранит в себе намного больший обьект потому разворачиваем его полглст'ю)
    res.status(201).json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Problem with registration",
    });
  }
};

export const getInfo = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.send({
        message: "User not found!",
      });
    } else {
      const { passwordHash, ...userData } = user._doc;
      res.json({ ...userData });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Not a access!",
    });
  }
};
