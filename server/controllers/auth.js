import * as config from "../config.js";
import jwt from "jsonwebtoken";

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
    const token = jwt.sign({ email, password }, config.JWT_SECRET, {
      expiresIn: "1h",
    });

    config.AWSSES.sendEmail(
      {
        Source: config.EMAIL_FROM,
        Destination: {
          ToAddresses: ["najim.eng.3@gmail.com"],
        },
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: `
              <html>
                <h1>Welcome to Realist App</h1>
                <p>Please click the link below to activate your account.</p>
                <a href="${config.CLIENT_URL}/auth/account-activate/${token}">Activate my account</a>
             </html>
            `,
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: "Welcome to Realist",
          },
        },
      },
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
    console.log(req.body);
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something went wrong. Try again." });
  }
};
