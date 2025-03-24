const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

const AuthMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Token is not valid" });
  }

  try {
    const decoder = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoder;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, message: "Invalid token", error });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(40)
      .json({ success: false, message: "Required admin login" });
  }
  next();
};

const validateBook = [
  body("title").notEmpty().withMessage("Title is required"),
  body("author_id")
    .notEmpty()
    .isInt()
    .withMessage("Author ID must be an integer"),
  body("publication")
    .optional()
    .isDate()
    .withMessage("Publication date must be a valid date (YYYY-MM-DD)"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

const validateAuthor = [
  body("name").notEmpty().withMessage("Name is required"),
  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female, or other"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

module.exports = { AuthMiddleware, isAdmin, validateAuthor, validateBook };
