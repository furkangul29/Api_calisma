const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("MongoDb Bağlandı");
  })
  .catch((err) => {
    console.log("Veritabanına bağlanırken hata oluştu:", err);
  });
