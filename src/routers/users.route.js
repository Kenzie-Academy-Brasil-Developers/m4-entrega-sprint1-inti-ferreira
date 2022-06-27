import { Router } from "express";
const router = Router();

import {
  createUserController,
  loginUserController,
  readUsersDatabaseController,
  readUserProfileController,
  updateUserController,
  deleteUserController,
} from "../controllers/userController";

import {
  verifyAuthTokenMiddleware,
  verifyEmailAvailabilityMiddleware,
  verifyIsAdmMiddleware,
} from "../middlewares/index.js";

router.post("/users", verifyEmailAvailabilityMiddleware, createUserController);

router.post("/login", loginUserController);

router.get(
  "/users/profile",
  verifyAuthTokenMiddleware,
  readUserProfileController
);

router.get(
  "/users",
  verifyAuthTokenMiddleware,
  verifyIsAdmMiddleware,
  readUsersDatabaseController
);

router.patch(
  "/users/:uuid",
  verifyAuthTokenMiddleware,
  verifyIsAdmMiddleware,
  updateUserController
);

router.delete(
  "/users/:uuid",
  verifyAuthTokenMiddleware,
  verifyIsAdmMiddleware,
  deleteUserController
);

export default router;
