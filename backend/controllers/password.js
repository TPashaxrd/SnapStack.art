const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const dotenv = require("dotenv")
const crypto = require("crypto"); 

dotenv.config()

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_ADDRESS,
      to: user.email,
      subject: "Your password has been reset ✅",
      text: `Hi ${user.username},\n\nYour password has been successfully reset.\n\nIf you did not request this, please contact support immediately.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Password successfully reset and email sent." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const token = crypto.randomBytes(20).toString("hex");
  
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000;
      await user.save();
  
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_ADDRESS,
          pass: process.env.GMAIL_PASS,
        },
      });
  
      const resetURL = `http://localhost:3000/reset-password/${token}`;
      const mailOptions = {
        from: process.env.GMAIL_ADDRESS,
        to: user.email,
        subject: "Password Reset Request",
        text: `Hi ${user.username},\n\nYou requested a password reset. Click here to reset: ${resetURL}\n\nIf you didn't request this, ignore this email.`,
      };
  
      await transporter.sendMail(mailOptions);
  
      res.json({ message: "Password reset email sent." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  };

module.exports = { resetPassword, forgotPassword };