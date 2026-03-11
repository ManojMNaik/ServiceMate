const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {signup,login} = require("../controllers/authController");

// validation rules for signup
const signupValidation = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

// validation rules for login
const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password").exists().withMessage("Password is required"),
];

router.post("/signup", signupValidation, signup);

router.post("/login", loginValidation, login);

module.exports = router;