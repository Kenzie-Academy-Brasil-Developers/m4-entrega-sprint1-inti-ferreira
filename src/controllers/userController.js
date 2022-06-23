import {
  createUserService,
  loginUserService,
  readUsersDatabaseService,
  readUserProfileService,
  updateUserService,
  deleteUserService,
} from "../services/userServices";

const createUserController = async (req, res) => {
  const { name, email, password, isAdm } = req.body;
  const { status, message } = await createUserService(
    name,
    email,
    password,
    isAdm
  );
  return res.status(status).json(message);
};

const loginUserController = (req, res) => {
  const { email, password } = req.body;
  const { status, message } = loginUserService(email, password);
  return res.status(status).json(message);
};

const readUsersDatabaseController = (_, res) => {
  const { status, message } = readUsersDatabaseService();
  return res.status(status).json(message);
};

const readUserProfileController = (req, res) => {
  const token = req.headers.authorization
  const { status, message } = readUserProfileService(token);
  return res.status(status).json(message);
};

const updateUserController = (req, res) => {
  const { uuid } = req.params;
  const { status, message } = updateUserService(uuid, req.body, req.user);
  return res.status(status).json(message);
};

const deleteUserController = (req, res) => {
  const { uuid } = req.params;
  const { status, message } = deleteUserService(uuid, req.user);
  return res.status(status).json(message);
};

export {
  createUserController,
  loginUserController,
  readUsersDatabaseController,
  readUserProfileController,
  updateUserController,
  deleteUserController,
};

// sudo kill -9 $(sudo lsof -t -i:3000)