import { body } from "express-validator";

export const registerValidation = [
  // проверки на подлиность данных
  body("email", "Invalid email").isEmail().normalizeEmail(),
  body("password", "The name must consist of 5 characters").isLength({
    min: 6,
  }),
  body("fullName", "Please write correct name").isLength({ min: 4 }),
  //   опционально, проверка на ссылку
  body("avatarUrl", "Please write the link of img").optional().isURL(),
];

export const loginValidation = [
  // проверки на подлиность данных
  body("email", "Invalid email").isEmail().normalizeEmail(),
  body("password", "The name must consist of 5 characters").isLength({
    min: 6,
  }),
];

export const postCreateValidation = [
  // проверки на подлиность данных
  body("title", "Pls write a title of post!").isLength({ min: 3 }).isString(),
  body("text", "Pls write the text of post!").isLength({ min: 5 }).isString(),
  body("tags", "Invalid tag array specify !(an array)").optional().isString(),
  body("imageURL", "Invalid link on image").optional().isString(),
];
