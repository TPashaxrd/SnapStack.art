const express = require("express")
const User = require("../models/User")
const Arts = require("../models/Arts")
const Subscribe = require("../models/Subscribe")
const dotenv = require("dotenv")
const bannedUser = require("../models/bannedUser")
const nodemailer = require("nodemailer")

dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_ADDRESS,
    pass: process.env.GMAIL_PASS
  }
})

const totals = async (req, res) => {
    try {
      const UserCount = await User.countDocuments();
      const ArtCount = await Arts.countDocuments();
      const SubsCount = await Subscribe.countDocuments();
      const CommentsCount = await Arts.aggregate([{ $unwind: "$comments" }, { $count: "totalComments" }]);
  
      const dashboard = {
        UserCount,
        ArtCount,
        SubsCount,
        CommentsCount: CommentsCount[0]?.totalComments || 0
      };
  
      res.status(200).json({ success: true, dashboard });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

const users = async (req, res) => {
    try {
        const users = await User.find()
        res.status(201).json({ users })
    } catch (error) {
       res.status(500).json({ message: error.message }) 
    }
}

const arts = async (req, res) => {
  try {
    const arts = await Arts.find()
    res.status(201).json({ arts })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const DeleteUser = async (req, res) => {
  try {
    const { reason, userUserId, userEmail, userUsername } = req.body;
    const userId = req.params.id;

    const deleteUser = await User.findByIdAndDelete(userId);
    if (!deleteUser) 
      return res.status(404).json({ success: false, message: "User not found." });

    const formattedDate = new Date().toLocaleString();
    await transporter.sendMail({
      from: '"SnapStack.art - Sorry, Deleted Account!" <contact@snapstack.art>',
      to: userEmail || deleteUser.email,
      subject: "Your account has been deleted.",
      html: `
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f3f4f6;padding:24px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 30px rgba(16,24,40,0.08);">
            <tr>
              <td style="padding:28px 32px 0 32px;background:linear-gradient(90deg,#ef4444,#dc2626);color:#fff;">
                <div style="display:flex;align-items:center;gap:12px;">
                  <div style="width:48px;height:48px;border-radius:10px;background:rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:20px;">
                    SS
                  </div>
                  <div>
                    <h1 style="margin:0;font-size:20px;line-height:1;color:#fff;font-weight:700;">SnapStack.art</h1>
                    <div style="margin-top:2px;font-size:13px;opacity:0.95;">Account Deletion Notice</div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 18px 32px;">
                <h2 style="margin:0 0 8px 0;font-size:22px;color:#0f172a;">Account Deleted ❌</h2>
                <p style="margin:0 0 18px 0;color:#475569;font-size:15px;line-height:1.5;">
                  Hello <strong>${userUsername}</strong>, your account associated with the email <strong>${userEmail}</strong> has been <span style="color:#dc2626;font-weight:600;">deleted</span>.
                </p>

                <table cellpadding="0" cellspacing="0" role="presentation" style="width:100%;margin:16px 0 22px 0;">
                  <tr>
                    <td style="background:#fef2f2;border-radius:10px;padding:12px 14px;color:#991b1b;font-size:13px;">
                      <strong>Deletion Details</strong><br>
                      Reason: <span style="color:#dc2626;">${reason}</span><br>
                      Date: <span style="color:#0f172a;">${formattedDate}</span>
                    </td>
                  </tr>
                </table>

                <p style="margin:18px 0 0 0;color:#94a3b8;font-size:13px;">
                  If you believe this was a mistake, please contact our support team: 
                  <a href="mailto:support@snapstack.art" style="color:#ef4444;text-decoration:none;">support@snapstack.art</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px;">
                <hr style="border:none;height:1px;background:#fee2e2;margin:0 0 18px 0;">
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 28px 32px;">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
                  <div style="font-size:13px;color:#64748b;">
                    © ${new Date().getFullYear()} SnapStack.art. All rights reserved.
                  </div>
                  <div style="display:flex;gap:8px;">
                    <a href="https://facebook.com/snapstack" style="text-decoration:none;padding:8px;border-radius:8px;background:#f1f5f9;display:inline-block;font-size:12px;color:#0f172a;">Facebook</a>
                    <a href="https://instagram.com/snapstack" style="text-decoration:none;padding:8px;border-radius:8px;background:#f1f5f9;display:inline-block;font-size:12px;color:#0f172a;">Instagram</a>
                    <a href="https://twitter.com/snapstack" style="text-decoration:none;padding:8px;border-radius:8px;background:#f1f5f9;display:inline-block;font-size:12px;color:#0f172a;">Twitter</a>
                  </div>
                </div>
              </td>
            </tr>
          </table>
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;margin-top:12px;">
            <tr>
              <td align="center" style="font-size:12px;color:#9ca3af;">
                This email was sent to <strong>${userEmail}</strong>. If you no longer wish to receive these emails you can <a href="{{unsubscribeUrl}}" style="color:#ef4444;text-decoration:none;">unsubscribe</a>.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`
    });

    const banned = new bannedUser({
      reason: reason || "No reason.",
      userUserId: userUserId || deleteUser._id.toString(),
      userEmail: userEmail || deleteUser.email,
      userUsername: userUsername || deleteUser.username,
    });

    await banned.save();

    res.json({ success: true, message: "User deleted & banned", user: deleteUser, banned });

  } catch (error) {
    console.error("DeleteUser error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



const UpdateUser = async (req, res) => {
  try {
    const { username, email, bio, avatarUrl } = req.body;
    const userId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, bio, avatarUrl },
      { new: true }
    )
    if(!UpdateUser) {
      return res.status(404).json({ success: false, message: "User not found." })
    }

    res.json({ success: true, message: "User updated", user: updatedUser})
  } catch (error) {
    res.status(500).json({ usccess: false, message: error.message })
  }
}

const DeleteArt = async(req, res) => {
  try {
    const artId = req.params.id;
    const art = await Arts.findByIdAndDelete(artId);
    if(!art) {
      return res.status(404).json({ message: "Art not found" })
    }

    res.json({ message: "Art not found." })
  } catch (error) {
    res.status(500).json({ message: message.error })
  }
}

const UpdateArt = async(req, res) => {
  try {
    const artId = req.params.id;
    const updateData = req.body;

    const art = await Arts.findByIdAndUpdate(artId, updateData, { new: true })
    if(!art) return res.status(404).json({ message: "Art not found" })

    res.json({ message: "Art updated successfully." })
  } catch (error) {
    res.status(505).json({ message: error.message })
  }
}

const ShowAllBanneds = async (req, res) => {
  try {
    const banneds = await bannedUser.find()
    res.status(201).json(banneds)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { totals, users, arts, DeleteUser, UpdateUser, DeleteArt, UpdateArt, ShowAllBanneds }