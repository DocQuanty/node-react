import express from "express";
import mongoose from "mongoose";
import { registerValidation } from "./validation/auth.js";
import chekAuth from "./utils/chekAuth.js";
import * as userController from "./controllers/UserController.js";

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
// авторизация
app.post("/auth/login", userController.login);
//регистрация- проверка вторым параметром, если прошла успешно тогда выполняеться колбек
app.post("/auth/registration", registerValidation, userController.registration);
// до авторизации передаем функцию проверку chekAuth которая обьязательно должна вернуть next , проверка на авторизацию
app.get("/auth/info", chekAuth, userController.getInfo);

app.listen(PORT, () => {
  console.log(`SERVER START AND WORK AT ${PORT} PORT`);
});
