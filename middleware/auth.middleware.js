const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const jwt = require("jsonwebtoken");

const blacklistModel = require("../models/blacklist.model");

const auth = async (req, res, next) => {
  const accessToken = req.headers.authorization1;
  const refreshToken = req.headers.authorization2;
  console.log(accessToken);
  console.log("---------------");
  console.log(refreshToken);
  // const blacklistedToken = await blacklistModel.findOne({
  //   token: accessToken,
  // });

  // if (blacklistedToken) {
  //   return res.status(400).send({ msg: "token expired" });
  // }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_SECRET,
    async function (err, decoded) {
      if (err) {
        console.log(err);
        if (err.message == "jwt expired") {
          const newToken = await fetch(
            "http://localhost:4900/users/getnewtoken",
            {
              headers: {
                "Content-Type": "application/json",
                authorization2: refreshToken,
              },
            }
          ).then((res) => res.json());
          console.log(res);
          next();
        }
      } else if (decoded) {
        // console.log(decoded);
        req.body.role = decoded.role;
        req.body.email = decoded.email;
        next();
      }
    }
  );
};
module.exports = { auth };
