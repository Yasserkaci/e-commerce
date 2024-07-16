import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";

const creatUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;
  if (!userName || !email || !password) {
    throw new Error("Please fill all inputes");
  }
  const userExsist =
    (await User.findOne({ email })) || (await User.findOne({ userName }));

  if (userExsist) {
    res.status(400).send("User already exists.");
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    console.log(hashPassword);

    const newUser = new User({ userName, email, password: hashPassword });

    try {
      await newUser.save();
      console.log({ userName, email, password });
      createToken(res, newUser._id);

      res.status(201).json({
        _id: newUser._id,
        username: newUser.userName,
        email: newUser.email,
        isAadmin: newUser.isAdmin,
      });
    } catch (error) {
      res.status(400);
      throw new Error("invalid user data");
    }
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(401);
    throw new Error("Please fill all inputes");
  }
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const isValid = await bcrypt.compare(password, existingUser.password);
    if (isValid) {
      createToken(res, existingUser._id);
      res.status(201).json({
        _id: existingUser._id,
        username: existingUser.userName,
        email: existingUser.email,
        isAadmin: existingUser.isAdmin,
      });
      return 0;
    } else {
      throw new Error("Wrong password");
    }
  }
});

const logout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ massage: "Logged out " });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const allUsers = await User.find({});
  console.log(allUsers);
  res.json(allUsers);
});

const getUserProfile = asyncHandler(async (req, res) => {
  const currentuser = await User.findById(req.user._id);
  if (currentuser) {
    res.json({
      id: currentuser._id,
      email: currentuser.email,
      username: currentuser.userName,
    });
  } else {
    res.status(401);
    throw new Error("Not logged in.");
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.userName = req.body.username || user.userName;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashPassword;
      const updatedUser = await user.save();
      res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
      });
      res.status(200).json({ massage: "Logged out " });
    } else {
      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        email: updatedUser.email,
        username: updatedUser.userName,
      });
    }
  } else {
    res.status(401);
    throw new Error("User not found.");
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(200);
      throw new Error("Cannot delete an admin.");
    }
    await User.deleteOne({ _id: user.id });
    res.json({ massage: "user deleted successfully" });
  } else {
    res.stastus(400);
    throw new Error("user not found");
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(400);
    throw new Error("user not found");
  }
});

const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.userName = req.body.username || user.userName;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean  (req.body.isAadmin) || user.isAdmin;

    const updateduser = await user.save();

    res.json({
      "_id": updateduser._id,
      "username": updateduser.userName,
      "email": updateduser.email,
      "isAdmin": updateduser.isAadmin
    });
  }
});

export {
  creatUser,
  loginUser,
  logout,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getUserById,
  updateUserById,
};
