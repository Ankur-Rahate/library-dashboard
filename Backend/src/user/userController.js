import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import userModel from "./userModel.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

const createUser = async (req, res, next) => {
  // validation
  const { name, email, password } = req.body;
  console.log({ name, email, password });

  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  try {
    // Database call
    const user = await userModel.findOne({ email: email });

    // createError if userExist
    if (user) {
      const error = createHttpError(
        400,
        "User already exists with this email"
      );
      return next(error);
    }
  } catch (err) {
    const error = createHttpError(500, "Error while getting user");
    return next(error);
  }

  // password -> hash
  const hashPassword = await bcrypt.hash(password, 10);

  // create new user
  let newUser;
  try {
    newUser = await userModel.create({
      name,
      email,
      password: hashPassword,
    });
  } catch (err) {
    return next(createHttpError(500, "Error While creating user"));
  }

  try {
    // jwtToken generation
    const token = jwt.sign(
      { sub: newUser._id },
      config.jwtSecret,
      { expiresIn: "7d" }
    );

    // response
    res.status(200).json({ accessToken: token });
  } catch (err) {
    return next(createHttpError(500, "Error while Signing jwt token"));
  }
};

const loginUser = async (req, res, next) => {
  console.log(req.body);

  // Extract email and password from request body
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return next(createHttpError(400, "All fields are required"));
  }

  let user;
  try {
    // Database call
    user = await userModel.findOne({ email });

    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
  } catch (err) {
    return next(createHttpError(500, "Error while getting user"));
  }

  // Compare password
  try {
    const isMatch = bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(
        createHttpError(400, "Username or password incorrect!")
      );
    }
  } catch (err) {
    return next(
      createHttpError(400, "Error while checking password")
    );
  }

  // JWT token generation
  try {
    const token = jwt.sign(
      { sub: user._id },
      config.jwtSecret,
      { expiresIn: "7d" }
    );

    res.status(201).json({ accessToken: token });
  } catch (err) {
    return next(
      createHttpError(500, "Error while signing JWT token")
    );
  }
};

export { createUser };
export { loginUser };
