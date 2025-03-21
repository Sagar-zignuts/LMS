const jwt = require("jsonwebtoken");
const SendMail = require("../util/SendMail");
const { CreateUser, FindUser } = require("../models/User");
const bcrypt = require("bcrypt");

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid format of email",
      });
    }

    await CreateUser(username, email, password);
    await SendMail(email, username);

    return res
      .status(200)
      .json({ success: true, message: "User register successfuly" });
  } catch (error) {
    console.log(error);
    if (error.code === "23505") {
      // PostgreSQL unique constraint violation
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    return res.status(500).json({ success: false, error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Field is requird" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid format of email",
      });
    }
    const user = await FindUser(email);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      "sfasAKfoneinr21onsCON2indnsk2n352eflknwEM",
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      success: true,
      message: {
        username: user.username,
        email: user.email,
        role:
          user.role === "admin"
            ? "admin loged in successfully"
            : "User loged in successfully",
      },
      token : token
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error in login user" });
  }
};

module.exports = { register, login };
