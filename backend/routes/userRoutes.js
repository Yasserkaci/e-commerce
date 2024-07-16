import express from "express";
import {
  creatUser,
  loginUser,
  logout,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getUserById,
  updateUserById,
} from "../controllers/userControler.js";
const router = express.Router();

import {
  authenticated,
  authorizeAdmin,
} from "../middlewares/authMiddleware.js";

router
  .route("/")
  .post(creatUser)
  .get(authenticated, authorizeAdmin, getAllUsers);
router.post("/auth", loginUser);
router.post("/logout", logout);
router
  .route("/profile")
  .get(authenticated, getUserProfile)
  .put(authenticated, updateUserProfile);

router
  .route("/:id")
  .delete(authenticated, authorizeAdmin, deleteUser)
  .get(authenticated, authenticated, getUserById)
  .put(authenticated, authorizeAdmin, updateUserById);

export default router;
