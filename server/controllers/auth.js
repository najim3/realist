import * as config from "../config.js";
import jwt from "jsonwebtoken";
import { emailTemplate } from "../helpers/email.js";
import { hashPassword, comparePassword } from "../helpers/auth.js";
import User from "../models/user.js";
import { nanoid } from "nanoid";
import validator from "email-validator";

export const welcome = (req, res) => {
  res.json({
    data: "hello from nodejs api from routes...",
  });
};

export const preRegister = async (req, res) => {
  // create jwt with email and password then email as clickable link
  // only when user click on that email link, registation completes.
  try {
    //console.log(req.body);
    const { email, password } = req.body;
    // validation
    if (!validator.validate(email)) {
      return res.json({ error: "A valid email is required." });
    }
    if (!password) {
      return res.json({ error: "A password is required." });
    }
    if (password && password?.length < 6) {
      return res.json({ error: "Password should be at least 6 charecters." });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.json({ error: "Email is taken." });
    }
    const token = jwt.sign({ email, password }, config.JWT_SECRET, {
      expiresIn: "1h",
    });

    config.AWSSES.sendEmail(
      emailTemplate(
        email,
        `<p>Please click the link below to activate your account.</p>
       <a href="${config.CLIENT_URL}/auth/account-activate/${token}">Activate my account</a>`,
        config.REPLY_TO,
        "Activate your account"
      ),
      (err, data) => {
        if (err) {
          console.log(err);
          return res.json({ ok: false });
        } else {
          console.log(data);
          return res.json({ ok: true });
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something went wrong. Try again." });
  }
};

export const register = async (req, res) => {
  try {
    //console.log(req.body);
    const { email, password } = jwt.verify(req.body.token, config.JWT_SECRET);
    //console.log(decoded);
    const hashedPassword = await hashPassword(password);

    const user = await new User({
      username: nanoid(6),
      email,
      password: hashedPassword,
    }).save();

    const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.password = undefined;
    user.resetCode = undefined;

    return res.json({
      token,
      refreshToken,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something went wrong. Try again." });
  }
};
