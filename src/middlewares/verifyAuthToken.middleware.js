import jwt  from "jsonwebtoken";

const verifyAuthTokenMiddleware = (req, res, next) => {
  let authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ "message": "Missing authorization headers" });
  };

  jwt.verify(authToken, "SECRET_KEY", (error, decoded) => {
    if (error) {
      return res.status(401).json({ "message": "Missing authorization headers" });
    };
    request.decoded = decoded;
    next();
  });
};

export default verifyAuthTokenMiddleware;
