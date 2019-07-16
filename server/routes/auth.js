const express = require("express");
const validator = require("validator");
const passport = require("passport");
const router = new express.Router();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const users = require("mongoose").model("User");
const jwt = require("jsonwebtoken");
const PassportLocalStrategy = require("passport-local").Strategy;

let croqeeBodyParser = body => {
  var reqBody = {};
  for (var key in body) {
    reqBody = JSON.parse(key);
  }
  return reqBody;
};

/**
 * Validate the sign up form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateSignupForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = "";

  if (
    !payload ||
    typeof payload.email !== "string" ||
    !validator.isEmail(payload.email)
  ) {
    isFormValid = false;
    errors.email = "Please provide a correct email address.";
  }

  if (
    !payload ||
    typeof payload.password !== "string" ||
    payload.password.trim().length < 8
  ) {
    isFormValid = false;
    errors.password = "Password must have at least 8 characters.";
  }

  if (
    !payload ||
    typeof payload.name !== "string" ||
    payload.name.trim().length === 0
  ) {
    isFormValid = false;
    errors.name = "Please provide your name.";
  }

  if (!isFormValid) {
    message = "Check the form for errors.";
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

/**
 * Validate the login form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateLoginForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = "";

  if (
    !payload ||
    typeof payload.email !== "string" ||
    payload.email.trim().length === 0
  ) {
    isFormValid = false;
    errors.email = "Please provide your email address.";
  }

  if (
    !payload ||
    typeof payload.password !== "string" ||
    payload.password.trim().length === 0
  ) {
    isFormValid = false;
    errors.password = "Please provide your password.";
  }

  if (!isFormValid) {
    message = "Check the form for errors.";
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

router.post("/signup", (req, res, next) => {
  req.body = croqeeBodyParser(req.body);
  const validationResult = validateSignupForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }

  return passport.authenticate("local-signup", err => {
    if (err) {
      if (err.name === "MongoError" && err.code === 11000) {
        // the 11000 Mongo code is for a duplication email error
        // the 409 HTTP status code is for conflict error
        return res.status(409).json({
          success: false,
          message: "Check the form for errors.",
          errors: {
            email: "This email is already taken."
          }
        });
      }

      return res.status(400).json({
        success: false,
        message: "Could not process the form."
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "You have successfully signed up! Now you should be able to log in."
    });
  })(req, res, next);
});

router.post("/login", (req, res, next) => {
  req.body = croqeeBodyParser(req.body);
  const validationResult = validateLoginForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }

  return passport.authenticate("local-login", (err, token, userData) => {
    if (err) {
      console.log(token);

      if (err.name === "IncorrectCredentialsError") {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      return res.status(400).json({
        success: false,
        message: "Could not process the form."
      });
    }
    return res.json({
      success: true,
      message: "You have successfully logged in!",
      token,
      user: userData
    });
  })(req, res, next);
});

//forgot password reset request
router.post("/forgot", (req, res) => {
  const parsedBody = croqeeBodyParser(req.body);
  console.log(parsedBody.email);
  if (parsedBody.email === "") {
    res.status(400).send("email required");
  }

  users
    .findOne({
      email: parsedBody.email
    })
    .then(user => {
      console.log("to check the email:" + user.email);
      if (user === null) {
        console.error("email not in database");
        res.status(403).send("email not in db");
      } else {
        const token = crypto.randomBytes(20).toString("hex");

        const expiryTime = Date.now() + 360000;
        user.resetPasswordToken = token;
        user.resetPasswordExpires = expiryTime;

        user.save(function(err, obj) {
          if (err) {
            console.log("there was an error");
          } else {
            console.log(obj);
          }
        });

        const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: "soniamianji1@gmail.com",
            pass: "Tryharder1313??"
          }
        });

        const mailOptions = {
          from: "soniamianji1@gmail.com",
          to: `${user.email}`,
          subject: "Link To Reset Password",
          text:
            "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
            "Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n" +
            `http://localhost:3000/reset/${token}\n\n` +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n"
        };
        console.log(user.email);

        console.log("sending mail");

        transporter.sendMail(mailOptions, (err, response) => {
          if (err) {
            console.error("there was an error: ", err);
          } else {
            console.log("here is the res: ", response);
            res.status(200).json("recovery email sent");
          }
        });
      }
    });
});

router.get("/reset", (req, res, next) => {
  console.log(req.query.resetPasswordToken);
  users
    .findOne({
      resetPasswordToken: req.query.resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() }
    })
    .then(user => {
      if (!user) {
        console.log("password reset link is invalid or has expired");
        res.json("password reset link is invalid or has expired");
      } else {
        res.status(200).send({
          email: user.email,
          message: "password reset link a-ok"
        });
      }
    });
});
let myBodyParser = body => {
  var reqBody = {};
  for (var key in body) {
    reqBody = JSON.parse(key);
  }
  return reqBody;
};

router.put("/updatePassViaMail", (req, res) => {
  req.body = myBodyParser(req.body);

  users
    .findOne({
      resetPasswordToken: req.body.resetPasswordToken,
      email: req.body.email
    })
    .then(user => {
      if (!user) {
        console.log("password reset link is invalid or has expired");
        res.json("password reset link is invalid or has expired");
      } else {
        console.log(req.body.password);
        user.password = req.body.password;
        console.log(user.password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.save(function(err, obj) {
          if (err) {
            console.log("there was an error");
            // res.status(200).json({ data: req });
          } else {
            console.log(obj);
            res.status(200).send({
              message: "password successfully updated"
            });
          }
        });
      }
    });
});

// router.put("/updatePassViaMail", (req, res, next) => {
//   console.log(req.);
//   // users
//   //   .findOne({
//   //     resetPasswordToken: req.query.resetPasswordToken
//   //   })
//   //   .then(user => {
//   // if (!user) {
//   //   console.log("password reset link is invalid or has expired");
//   //   res.json("password reset link is invalid or has expired");
//   // } else {
//   //   console.log(req.query.password);
//   //   user.password = req.query.password;
//   //   user.resetPasswordToken = null;
//   //   user.resetPasswordExpires = null;
//   //   user.save(function(err, obj) {
//   //     if (err) {
//   //       console.log("there was an error");
//   //       res.status(200).json({ data: req });
//   //     } else {
//   //       console.log(obj);
//   //       res.status(200).json({
//   //         message: "your password has been successfully set!"
//   //       });
//   //     }
//   //   });
//   // }
//   // });
// });

module.exports = router;
