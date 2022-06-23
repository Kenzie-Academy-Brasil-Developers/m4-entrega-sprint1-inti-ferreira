import jwt from "jsonwebtoken";
import { users } from "../database";

const verifyIsAdmMiddleware = (req, res, next) => {
  const { headers } = req;

  const userAuth = jwt.decode(headers.authorization);

  const isAdm = users.filter((el) => el.id === userAuth.id);

  if (!isAdm.isAdm) {
    return res.status(401).json({ "message": "Unauthorized" });
  }

  return next();
};

export default verifyIsAdmMiddleware;
