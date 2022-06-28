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

const updateUserService = async (uuid, { user, body }) => {
  const updateThisUser = users.findIndex((el) => el.id === uuid);

  if (!updateThisUser && user.isAdm === false) {
    return {
      status: 401,
      message: { message: "Missing admin permissions" },
    };
  }

  if (updateThisUser || user.isAdm === true) {
    if (body.password) {
      const hashedPass = await bcrypt.hash(body.password, 10);
      body.password = hashedPass;
    }

    if (body.email) body.email.toLowerCase();
    if (body.isAdm) body.isAdm = false;

    Object.assign(user, body);
    return {
      status: 200,
      message: {
        uuid: user.id,
        createdOn: user.createdOn,
        updatedOn: new Date(),
        name: user.name,
        email: user.email,
        isAdm: user.isAdm,
      },
    };
  }
};

const deleteUserService = (uuid, req) => {
  const removeThisUser = users.findIndex((el) => el.id === uuid);

  if (!removeThisUser && req.user.isAdm === false) {
    return {
      status: 401,
      message: { message: "Missing admin permissions" },
    };
  }

  if (removeThisUser || req.user.isAdm === true) {
    users.splice(removeThisUser, 1);
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
