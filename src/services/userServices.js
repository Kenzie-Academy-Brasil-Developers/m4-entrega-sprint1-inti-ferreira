import { v4 } from "uuid";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { users } from "../database/index";

dotenv.config();

const createUserService = async (name, email, password, isAdm) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    isAdm,
    createdOn: new Date(),
    updatedOn: new Date(),
    id: v4(),
  };

  users.push(newUser);

  return {
    status: 201,
    message: {
      uuid: newUser.id,
      createdOn: newUser.createdOn,
      updatedOn: newUser.updatedOn,
      name: newUser.name,
      email: newUser.email,
      isAdm: newUser.isAdm,
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

const updateUserService = ({ user, body}) => {
  if (body.password) {
    const hashedPass = await bcrypt.hash(body.password, 10);
    body.password = hashedPass;
  }

  if (body.email) body.email.toLowerCase()
  if (body.isAdm) body.isAdm = false;
  
  body.updatedOn = new Date();
  Object.assign(user, body);

  return {
    status: 200,
    message: { "message": user }
  }
};

const deleteUserService = (uuid) => {
  const removeThisUser = users.findIndex((el) => el.id === uuid);

  if (removeThisUser || removeThisUser.isAdm) {
    users.splice(removeThisUser, 1);
    return {
      status: 200, 
      message: { "message": "User deleted with success", }
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
