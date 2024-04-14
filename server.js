const express = require("express");
const app = express();

const jwt = require("jsonwebtoken");

require("dotenv").config({ path: "./.env" });
app.use(express.json());

const PORT = process.env.PORT || 8000;
const secretKey = process.env.secretKey;
const expiresIn = process.env.expiresIn;

// Data Base
const userdb = [
  { _id: 1, email: "mahmoud1@gmail.com", password: "pass123", role: "user" },
  { _id: 2, email: "ali1@gmail.com", password: "pass123", role: "admin" },
];

// @desc Login Create Token
// @Route POST /login
// @Access [user, admin, manger]
app.route("/login").post((req, res) => {
  // 1) Get Password and email
  const { password, email } = req.body;
  // 2) find user
  const user = userdb.filter(
    (user) => user.email === email && user.password === password
  );
  // 3) Check if user Not SignUp
  if (user.length === 0) {
    throw res.status(404).json({
      status: "Error",
      message: "Not Match any user, Please do a signup",
    });
  }

  // 4) Create Jwt And Token
  const token = jwt.sign(
    {
      id: user[0]._id,
      email: user[0].email,
      password: user[0].password,
      role: user[0].role,
    },
    secretKey,
    {
      expiresIn,
    }
  );

  res.status(201).json({ message: "success", token, data: user[0] });
});

// @desc addCart Verify Token
// @Route POST /addCart
// @Access user
app.route("/addCart").post((req, res) => {
  // 1) get token
  const { token } = req.body;

  // 2) Verify token
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      throw res.status(401).json({
        status: "Error",
        message: err.message,
        expiredAt: err.expiredAt,
      });
    }

    if (decoded.role !== "admin") {
      throw res.status(401).json({
        status: "Error",
        message: "Cant Delete This user",
      });
    }

    res.status(200).json({ message: "success", token, message: "Deleted" });
  });
});














const qrcode = require("qrcode");
app.get("/qrcode", (req, res) => {
  const text = "Hello My Name Is Mahmoud Abdullah";

  qrcode.toDataURL(text, (err, url) => {
    res.status(200).send(`<img src='${url}'/>`)
  })
})




app.listen(PORT, () => {
  console.log("Server listen on port http://localhost:8000");
});
