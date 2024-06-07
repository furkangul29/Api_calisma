const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5001;
require("./src/db/dbContext");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hoş Geldiniz.");
});
app.use(
  mongoSanitize({
    allowDots: true,
    replaceWith: "_",
  })
);
const router = require("./src/routers");

app.use("/api", router);

app.listen(port, () => {
  console.log(`Server ${port} portundan çalışıyor...`);
});
