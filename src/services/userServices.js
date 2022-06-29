import { v4 } from "uuid";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { users } from "../database/index";

dotenv.config();

const createUserService = async (name, email, password, isAdm) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    isAdm,
    createdOn: new Date(),
    updatedOn: new Date(),
    id: v4(),
  };

  users.push(user);

  return {
    status: 201,
    message: {
      uuid: user.id,
      createdOn: user.createdOn,
      updatedOn: user.updatedOn,
      name: user.name,
      email: user.email,
      isAdm: user.isAdm,
    },
  };
};

const loginUserService = (email, password) => {
  const isUser = users.find((el) => el.email === email);
  const isPassword = bcrypt.compareSync(password, isUser.password);

  if (!isUser || isPassword === null) {
    return {
      status: 401,
      message: { message: "invalid email adress or password" },
    };
  }

  const authToken = jwt.sign({ email: isUser.email }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRES_IN,
  });

  return {
    status: 200,
    message: { token: authToken },
  };
};

const readUsersDatabaseService = () => {
  return {
    status: 200,
    message: users,
  };
};

const readUserProfileService = (email) => {
  const profile = users.find((el) => el.email === email);

  if (profile) {
    return {
      status: 200,
      message: {
        uuid: profile.id,
        createdOn: profile.createdOn,
        updatedOn: profile.updatedOn,
        name: profile.name,
        email: profile.email,
        isAdm: profile.isAdm,
      },
    };
  }
};

const updateUserService = async (req) => {
  const { body } = req;
  const { uuid } = req.params;

  const token = req.headers.authorization.split(" ")[1];
  const authToken = jwt.decode(token, process.env.SECRET_KEY);

  const isUserAdm = users.find((el) => el.email === authToken.email);
  const user = users.find((el) => el.id === uuid);

  if (!isUserAdm.isAdm && !user) {
    return {
      status: 401,
      message: { message: "Missing admin permissions" },
    };
  }

  if (user || isUserAdm.isAdm === true) {
    if (body.password) {
      const hashedPass = await bcrypt.hash(body.password, 10);
      body.password = hashedPass;
    }

    if (body.email) body.email.toLowerCase();
    if (body.isAdm) body.isAdm = false;
    Object.assign(user, body);
  }

  return { status: 200, message: user };
};

const deleteUserService = async (req) => {
  const { uuid } = req.params;
  const token = req.headers.authorization.split(" ")[1];
  const authToken = await jwt.decode(token, process.env.SECRET_KEY);

  const isUserAdm = users.find((el) => el.email === authToken.email);
  const user = users.find((el) => el.id === uuid);

  console.log(isUserAdm.isAdm);
  if (!isUserAdm.isAdm && !user) {
    return {
      status: 401,
      message: { message: "Missing admin permissions" },
    };
  }
  if (user || isUserAdm.isAdm === true) {
    users.splice(user, 1);
    return {
      status: 200,
      message: { message: "User deleted with success" },
    };
  }
};

export {
  createUserService,
  loginUserService,
  readUsersDatabaseService,
  readUserProfileService,
  updateUserService,
  deleteUserService,
};
