const { response } = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../utils/sendMail");
const moment = require("moment");
const {
  createToken,
  createTempToken,
  decodedTempToken,
} = require("../middlewares/auth");

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Kullanıcı bulunamadı" });
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (passwordCompare == false) {
      return res
        .status(401)
        .json({ success: false, message: "Kullanıcı adı veya E mail hatalı" });
    }
    createToken(user, res);
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Giriş işlemi başarısız oldu" });
  }
};

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCheck = await User.findOne({ email });
    if (userCheck) {
      return res.status(401).json({
        success: false,
        message: "Girmiş olduğunuz email kullanımda!",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword;
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    return res.status(201).json({
      success: true,
      data: savedUser,
      message: "Kayıt Başarı ile Eklendi.",
    });
  } catch (error) {
    console.error("Register error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Kayıt işlemi başarısız oldu" });
  }
};

const me = async (req, res) => {
  return res.status(200).json({ success: true, data: req.user });
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const userInfo = await User.findOne({ email }).select(
      "name lastName email"
    );
    if (!userInfo) {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz kullanıcı" });
    }

    const resetCode = crypto.randomBytes(3).toString("hex");
    await sendEmail({
      from: process.env.EMAIL_USER,
      to: userInfo.email,
      subject: "Şifre Sıfırlama",
      text: `Şifre Sıfırlamak için Doğrulama Kodunuz: ${resetCode}`,
    });

    await User.updateOne(
      { email },
      {
        reset: {
          code: resetCode,
          time: moment(new Date())
            .add(15, "minute")
            .format("YYYY-MM-DD HH:mm:ss"),
        },
      }
    );

    return res
      .status(200)
      .json({ success: true, message: "Lütfen mail kutunuzu kontrol ediniz!" });
  } catch (error) {
    console.error("Şifre sıfırlama işlemi başarısız oldu:", error);
    return res.status(500).json({
      success: false,
      message: "Bir hata oluştu. Lütfen tekrar deneyiniz.",
    });
  }
};

const resetCodeCheck = async (req, res) => {
  const { email, code } = req.body;
  const userInfo = await User.findOne({ email }).select(
    "_id name lastName email reset"
  );
  if (!userInfo) {
    return res
      .status(400)
      .json({ success: false, message: "Kullanıcı bulunamadı" });
  }
  const dbCodeTime = moment(userInfo.reset.time);
  const nowTime = moment(new Date());
  const timeDiff = dbCodeTime.diff(nowTime, "minutes");
  console.log("Zaman farkı: ", timeDiff);
  console.log("code:", code);
  if (timeDiff <= 0 || userInfo.reset.code !== code) {
    return res.status(401).json({ success: false, message: "Geçersiz Kod" });
  }

  const tempToken = await createTempToken(userInfo._id, userInfo.email);

  return res.status(200).json({
    success: true,
    data: { tempToken },
    message: "Şifre Sıfırlama işlemini gerçekleştirebilirsiniz",
  });
};

const resetPassword = async (req, res) => {
  try {
    const { password, tempToken } = req.body;
    const decodedToken = await decodedTempToken(tempToken);
    console.log("Decoded Token: ", decodedToken);
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(
      {
        _id: decodedToken._id,
      },
      {
        reset: {
          code: null,
          time: null,
        },
        password: hashedPassword,
      }
    );
    return res.status(200).json({
      success: true,
      message: "Şifre sıfırlama işlemi başarıyla gerçekleştirildi",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      success: false,
      message: "Bir hata oluştu. Lütfen tekrar deneyiniz.",
    });
  }
};

module.exports = {
  login,
  register,
  me,
  forgetPassword,
  resetCodeCheck,
  resetPassword,
};
