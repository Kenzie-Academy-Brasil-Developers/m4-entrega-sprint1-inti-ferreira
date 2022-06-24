import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import { users }from "../database"

dotenv.config()

const verifyIsAdmMiddleware = (req, res, next) => {
  const authToken = req.headers.authorization?.split(" ")[1];
  const user = jwt.decode(authToken, process.env.SECRET_KEY)
  console.log(user)

  const isUserAdm = users.find((el) => el.email === user.email);

  if (!isUserAdm.isAdm) {
    return res.status(401).json({ "message": "Unauthorized" });
  }

  return next();
};

export default verifyIsAdmMiddleware;
