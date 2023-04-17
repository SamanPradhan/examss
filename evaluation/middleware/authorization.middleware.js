const authorization = (data) => {
  return (req, res, next) => {
    const role = req.role;
    if (data == role) {
      next();
    } else {
      return res.status(400).send({ msg: "dont have access " });
    }
  };
};

module.exports = { authorization };
