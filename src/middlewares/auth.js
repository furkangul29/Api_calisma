const jwt = require("jsonwebtoken");
const user = require("../models/userModel");
require("dotenv").config();

const createToken = async (user, res) => {
  const payload = {
    sub: user._id,
    name: user.name,
  };

  const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    algorithm: "HS512",
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return res.status(201).json({
    success: true,
    token,
    message: "Başarılı",
  });
};

const tokenCheck = async (req, res, next) => {
  const headerToken =
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ");

  console.log(headerToken);
  if (!headerToken) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Geçersiz Oturum Lütfen Oturum Açınız.",
      });
  }
  const token = req.headers.authorization.split(" ")[1];
  console.log(token);
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    if (err)
      return res
        .status(401)
        .json({ success: false, message: "Geçersiz Token" });

    const userInfo = await user
      .findById(decoded.sub)
      .select("_id name lastName email");
    console.log(userInfo);

    if (!userInfo) {
      return res
        .status(401)
        .json({ success: false, message: "Kullanıcı Bulunamadı" });
    }
    req.user = userInfo;
    next();
  });
};

const createTempToken = async (userId, email) => {
  const payload = {
    sub: userId,
    email,
  };
  const token = await jwt.sign(payload, process.env.JWT_TEMP_KEY, {
    algorithm: "HS512",
    expiresIn: process.env.JWT_TEMP_EXPIRES_IN,
  });
  console.log(token);
  return "Bearer " + token;
};

const decodedTempToken = (tempToken) => {
  return new Promise((resolve, reject) => {
    const token = tempToken.split(" ")[1];
    jwt.verify(token, process.env.JWT_TEMP_KEY, async (err, decoded) => {
      if (err) {
        reject({ success: false, message: "Geçersiz Token" });
      } else {
        const userInfo = await user
          .findById(decoded.sub)
          .select("_id name lastName email");
        if (!userInfo) {
          reject({ success: false, message: "Kullanıcı bulunamadı" });
        } else {
          resolve(userInfo);
        }
      }
    });
  });
};

module.exports = { createToken, tokenCheck, createTempToken, decodedTempToken };
