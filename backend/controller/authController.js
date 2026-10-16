import uploadOnCloudary from "../config/cloudinary.js";
import genToken from "../config/token.js";
import User from "../model/userModel.js";
import validator from "validator";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";

//------------signUP----------//
/*
1. input from user
2. email exist
3. email validation
4. password validation
5. upload profile photo
6. password hash
7. create user
8. token generate
*/

export const signUp = async (req, res) => {
  try {
    // 1. Input from user
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({
        message: "Fill all the fields",
      });
    }

    // 2. Email validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Invalid email",
      });
    }

    // 3. Password validation
    if (password.length < 8) {
      return res.status(400).json({
        message: "Enter strong password",
      });
    }

    // 4. Check existing user
    const existUser = await User.findOne({ email });

    if (existUser) {
      return res.status(400).json({
        message: "User is already exist",
      });
    }

    // 5. Check profile photo
    if (!req.file) {
      return res.status(400).json({
        message: "Please choose a profile picture",
      });
    }

    // 6. Upload photo to Cloudinary
    const photoUrl = await uploadOnCloudary(req.file.path);

    if (!photoUrl) {
      return res.status(500).json({
        message: "Profile picture upload failed",
      });
    }

    // 7. Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // 8. Create user
    const user = await User.create({
      userName,
      email,
      password: hashPassword,
      photoUrl,
    });

    // 9. Generate token
    const token = await genToken(user._id);

    // 10. Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 11. Send response
    return res.status(201).json({
      message: "Account created successfully",
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        photoUrl: user.photoUrl,
      },
    });
  } catch (error) {
    console.error("SignUp error:", error);

    return res.status(500).json({
      message: "SignUp failed",
    });
  }
};

//------------signIN----------//
/*
1. input from user
2. find user
3. compare password
4. generate token
5. set cookie
*/

export const signIn = async (req, res) => {
  try {
    // 1. Input from user
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Fill all the fields",
      });
    }

    // 2. Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Invalid email",
      });
    }

    // 3. Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User is not found",
      });
    }

    // 4. Compare password
    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res.status(400).json({
        message: "Incorrect password",
      });
    }

    // 5. Generate token
    const token = await genToken(user._id);

    // 6. Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 7. Send response
    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        photoUrl: user.photoUrl,
      },
    });
  } catch (error) {
    console.error("SignIn error:", error);

    return res.status(500).json({
      message: "SignIn failed",
    });
  }
};

//------------signOUT----------//

export const signOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "SignOut successfully",
    });
  } catch (error) {
    console.error("SignOut error:", error);

    return res.status(500).json({
      message: "SignOut failed",
    });
  }
};
