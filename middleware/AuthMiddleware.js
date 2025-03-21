const jwt = require("jsonwebtoken");

const AuthMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // if (!token) {
  //     return res.status(401).json({success : false , message : "Token is not valid"})
  // }

  try {
    const decoder = jwt.verify(
      token,
      "sfasAKfoneinr21onsCON2indnsk2n352eflknwEM"
    );
    console.log(decoder);
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

module.exports = {AuthMiddleware , isAdmin};
