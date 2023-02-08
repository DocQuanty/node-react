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
