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
  const { email } = req.decoded;
  const { status, message } = readUserProfileService(email);
  return res.status(status).json(message);
};

const updateUserController = async (req, res) => {
  const userUpdateService = await updateUserService(req);
  const { status, message } = userUpdateService;
  return res.status(status).json(message);
};

const deleteUserController = async (req, res) => {
  const userDeleteService = await deleteUserService(req);
  const { status, message } = userDeleteService;
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
