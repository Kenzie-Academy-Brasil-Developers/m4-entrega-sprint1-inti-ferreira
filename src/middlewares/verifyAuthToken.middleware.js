import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verifyAuthTokenMiddleware = (req, res, next) => {
  const authToken = req.headers.authorization?.split(" ")[1];

  if (!authToken) {
    return res.status(401).json({ message: "Missing authorization headers" });
  }

  return jwt.verify(authToken, process.env.SECRET_KEY, (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Missing authorization headers" });
    }

    req.decoded = decoded;

    return next();
  });
};

export default verifyAuthTokenMiddleware;
