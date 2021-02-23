const { Admin } = require("../model/admin");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const token = req.header("authorization");
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const decodedToken = await jwt.decode(token, process.env.SECRET_KEY);

  if (Date.now() >= decodedToken.exp)
    return res.status(401).json({ message: "session expired, please login" });

  const decode = jwt.verify(token, process.env.SECRET_KEY);
  if (!decode) return res.status(401).json({ message: "Unauthorizedzed" });

  const user = await Admin.findById(decode.sub);
  if (!user) return res.json({ message: "Unathorized: user does not exist" });
  req.user = user;
  console.log(req.user);
  next();
};
