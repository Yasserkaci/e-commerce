import jwt from "jsonwebtoken";

const genToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV,
    maxAge: 30 * 60 * 60 * 24 * 1000,
  });

  return token
};

export default genToken
