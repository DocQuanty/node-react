import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  if (token) {
  } else {
    return res.status(403).json({
      message: "Not access!",
    });
  }

  res.json({
    token,
  });
};
