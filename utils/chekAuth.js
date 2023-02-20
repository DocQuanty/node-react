import jwt from "jsonwebtoken";

// функиця мидлвейр которая должна обьязательно что-то ВЕРНУТЬ (next())
export default (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  if (token) {
    try {
      // декодируем с помощью verify
      const decoded = jwt.verify(token, "secret123");
      // вынимаем айди пользователя с токена
      req.userId = decoded._id;
      next();
    } catch (e) {
      return res.status(403).json({
        message: "Not access!",
      });
    }
  } else {
    return res.status(403).json({
      message: "Not access!",
    });
  }
};
