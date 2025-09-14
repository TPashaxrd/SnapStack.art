const dotenv = require("dotenv")
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Arts = require("../models/Arts");
const nodemailer = require("nodemailer")

dotenv.config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.GMAIL_PASS
    }
})

const now = new Date();
const formattedDate = now.toLocaleDateString("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
});


const CreateUser = async (req, res) => {
    const { username, email, password, IP_Address } = req.body;
    try {
        if(!username || !email || !password || !IP_Address) {
            return res.status(400).json({ message: "All fields are required." })
        }
        const existing = await User.findOne({ email })
        if(existing) return res.status(400).json({ message: "Email already exists"})
        const existingUsername = await User.findOne({ username })
        if(existingUsername) return res.status(400).json({ message: "Username already exist." })
        const hashed = await bcrypt.hash(password, 10)

        const now = new Date()
        const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        
        const user = await User.create({ 
            username, 
            email, 
            password: hashed, 
            IP_Address,
            badges: [
                { name: "New User", awardedAt: now, expiresAt: expires }
            ]
        })
        
        req.session.userId = user._id;

        const info = await transporter.sendMail({
            from: '"SnapStack.art - Registered" <contact@cordision.com>',
            to: email,
            subject: 'Successfully Registered!',
            html: `
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f3f4f6;padding:24px 0;">
                <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 30px rgba(16,24,40,0.08);">
                    <tr>
                        <td style="padding:28px 32px 0 32px;background:linear-gradient(90deg,#7c3aed,#ec4899);color:#fff;">
                        <div style="display:flex;align-items:center;gap:12px;">
                            <div style="width:48px;height:48px;border-radius:10px;background:rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:20px;">
                            SS
                            </div>
                            <div>
                            <h1 style="margin:0;font-size:20px;line-height:1;color:#fff;font-weight:700;">SnapStack.art</h1>
                            <div style="margin-top:2px;font-size:13px;opacity:0.95;">Welcome to the creative playground</div>
                            </div>
                        </div>
                        </td>
                    </tr>            
                    <tr>
                        <td style="padding:28px 32px 18px 32px;">
                        <h2 style="margin:0 0 8px 0;font-size:22px;color:#0f172a;">Successfully Registered ✅</h2>
                        <p style="margin:0 0 18px 0;color:#475569;font-size:15px;line-height:1.5;">
                            Hello <strong>${username}</strong>, Your registration has been successfully completed. You can now log in to SnapStack.art, upload content, and join the community.
                        </p>
            
                        <table cellpadding="0" cellspacing="0" role="presentation" style="width:100%;margin:16px 0 22px 0;">
                            <tr>
                            <td style="background:#f8fafc;border-radius:10px;padding:12px 14px;color:#334155;font-size:13px;">
                                <strong>Account Details</strong><br>
                                Email: <span style="color:#0f172a;">${email}</span><br>
                                Date: <span style="color:#0f172a;">${formattedDate}</span>
                            </td>
                            </tr>
                        </table>
                        <div style="text-align:left;">
                            <a href="https://snapstack.art/login" target="_blank" style="display:inline-block;padding:12px 18px;background:linear-gradient(90deg,#7c3aed,#ef6aa6);color:#fff;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;box-shadow:0 6px 18px rgba(124,58,237,0.18);">
                            Go Your Account.
                            </a>
                        </div>
            
                        <p style="margin:18px 0 0 0;color:#94a3b8;font-size:13px;">
                            İf you did not registered here, please do not reply to this email and contact with support mail: <a href="mailto:support@snapstack.art" style="color:#7c3aed;text-decoration:none;">support@snapstack.art</a>
                        </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0 32px;">
                        <hr style="border:none;height:1px;background:#eef2ff;margin:0 0 18px 0;">
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
                        This email was sent to <strong>${email}</strong>. If you no longer wish to receive these emails you can <a href="{{unsubscribeUrl}}" style="color:#7c3aed;text-decoration:none;">unsubscribe</a>.
                        </td>
                    </tr>
                    </table>
                </td>
                </tr>
            </table>
              
            `
        })

        transporter.sendMail(info, (err, info) => {
            if(err) console.log(`Email send error: ${err}`)
            else console.log("Email sent: " + info.response)
        })

        res.status(201).json({ message: "Registered successfully", user: { id: user._id, username, email, badges: user.badges }})
    } catch (error) {
        res.status(500).json({ message: "Server Error" + `${error}` })
    }
}

const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email })
        if(!user) return res.status(400).json({ message: "Invalid credentials" })
        const match = await bcrypt.compare(password, user.password)
        if(!match) return res.status(400).json({ message: "Invalid credentials" })
        
        req.session.userId = user._id;
        res.json({ message: "Logged in", user: { id: user._id, username: user.username, email}})
    } catch (error) {
        res.status(500).json({ message: "Server Error "})
    }
}

const Logout = async (req, res) => {
    req.session.destroy(err => {
        if(err) return res.status(500).json({ message: "Logout error "})
        res.clearCookie("connect.sid")
        res.json({ message: "Logged out" })
    })
}
const me = async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not logged in" });
      }
  
      const user = await User.findById(req.session.userId).select("-password");
  
      if (!user) {
        req.session.destroy((err) => {
          if (err) {
            console.error("Session destroy error:", err);
          }
        });
  
        res.clearCookie("connect.sid");
        return res.status(401).json({ message: "Session expired, please login again" });
      }
  
      res.json({ user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };
  

const getArtsByUser = async (req, res) => {
    const { username } = req.params;

    try {
        if (!username) return res.status(400).json({ message: "Username is required" });
        const user = await User.findOne({
            username: { $regex: new RegExp(`^${username}$`, "i") }
        }).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        const arts = await Arts.find({ user: user._id }).sort({ createdAt: -1 });

        res.status(200).json({
            user: {
                username: user.username,
                email: user.email,
                bio: user.bio || "",
                avatarUrl: user.avatarUrl || null,
                totalArts: arts.length,
                badges: user.badges,
                socials: user.socials || { instagram: "", twitter: "", tiktok: "", youtube: "" },
                publicEmail: user.publicEmail
            },
            arts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { me, Logout, CreateUser, Login, getArtsByUser }