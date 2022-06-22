import { users } from "../database"

const verifyEmailAvailabilityMiddleware = (req, res, next) => {
  const { email } = req.body;

  const isEmailInvalid = users.find((el) => el.email === email.toLowerCase());

  if (isEmailInvalid) {
    return res.status(400).json({ "message": "E-mail already registered", });
  }

  return next();
};

export default verifyEmailAvailabilityMiddleware;
