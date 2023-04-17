const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userModel } = require("../models/user.model");
const { blacklistModel } = require("../models/blacklist.model");

//register
userRouter.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  console.log(password);
  try {
    const isUserPresent = await userModel.findOne({ email });
    console.log(isUserPresent);
    if (isUserPresent.length > 0) {
      return res.status(400).send({ msg: "User Already present" });
    }

    // const hashPassword = bcrypt.hashSync(password, 10);
    bcrypt.hash(password, 1, async function (err, hash) {
      // Store hash in your password DB.
      if (hash) {
        console.log(hash);
        const user = new userModel({
          name,
          email,
          password: hash,
          role,
        });
        await user.save();
        res.status(200).send({ msg: "User Registered Successfully" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: error.message });
  }
});
//login
userRouter.post("/login", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const isUserPresent = await userModel.findOne({ email });
    console.log(isUserPresent);
    if (isUserPresent.length == 0) {
      return res
        .status(400)
        .send({ msg: "Email does not exist, register first" });
    }
    const mainPassword = isUserPresent.password;
    console.log(password, mainPassword);
    bcrypt.compare(password, mainPassword, (err, result) => {
      if (result) {
        const accessToken = jwt.sign(
          { email: isUserPresent.email, role: isUserPresent.role },
          process.env.ACCESS_SECRET,
          { expiresIn: "1m" }
        );
        const refreshToken = jwt.sign(
          { email: isUserPresent.email, role: isUserPresent.role },
          process.env.REFRESH_SECRET,
          { expiresIn: "3m" }
        );
        console.log(accessToken, refreshToken);
        res.status(200).send({
          msg: "User logged in successfully",
          "Access token": accessToken,
          "refresh token": refreshToken,
        });
      } else if (err) {
        console.log(err);
        res.status(400).send({ msg: "Password wrong" });
      }
    });
    // if (correctHashPassword) {
    //   const accessToken = jwt.sign(
    //     { email: isUserPresent.email, role: isUserPresent.role },
    //     process.env.ACCESS_SECRET,
    //     { expiresIn: "1m" }
    //   );
    //   const refreshToken = jwt.sign(
    //     { email: isUserPresent.email, role: isUserPresent.role },
    //     process.env.REFRESH_SECRET,
    //     { expiresIn: "3m" }
    //   );
    //   console.log(accessToken, refreshToken);
    //   res.status(200).send({
    //     msg: "User logged in successfully",
    //     "Access token": accessToken,
    //     "refresh token": refreshToken,
    //   });
    // }
    //  else {
    //   res.status(400).send({ msg: "Password wrong" });
    // }
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: error.message });
  }
});

//log out

userRouter.get("/logout", async (req, res) => {
  //   const { name, email, password, role } = req.body;
  const accessToken = req.headers.authorization1;
  const refreshToken = req.headers.authorization2;

  console.log(accessToken, refreshToken);
  try {
    const blacklistAcessToken = new blacklistModel({ token: accessToken });
    const blacklistRefreshToken = new blacklistModel({ token: refreshToken });

    await blacklistAcessToken.save();
    await blacklistRefreshToken.save();
    res.status(200).send({
      msg: "User logged out successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: error.message });
  }
});

//get new token

userRouter.get("/getnewtoken", async (req, res) => {
  //   const { name, email, password, role } = req.body;

  const refreshToken = req.headers.authorization2;

  console.log(refreshToken);
  try {
    const blacklistedToken = await blacklistModel.findOne({
      token: refreshToken,
    });
    if (blacklistedToken) {
      return res.status(400).send({ msg: "token expired" });
    }
    const tokenValid = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    if (!tokenValid) {
      return res.status(400).send({ msg: "invalid token " });
    }

    const newAccessToken = jwt.sign(
      { email: tokenValid.email, role: tokenValid.role },
      process.env.ACCESS_SECRET,
      { expiresIn: "1m" }
    );
    res.status(200).send({
      msg: "User logged in successfully",
      "Access token": newAccessToken,
      "refresh token": refreshToken,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: error.message });
  }
});

module.exports = { userRouter };
