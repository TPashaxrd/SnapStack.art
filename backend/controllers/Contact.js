const Contact = require("../models/Contact");
const nodemailer = require("nodemailer")
const dotenv = require("dotenv")

dotenv.config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.GMAIL_PASS
    }
})

const CreateContact = async (req, res) => {
    try {
        const { title, message, IP_Address, email } = req.body;
        if(!title || !message || !IP_Address || !email) {
            res.status(404).json({ message: "All fields are required."})
            return;
        }

        const existing = await Contact.findOne({ message })
        if(existing) return res.status(400).json({ message: "Why you did spam?" })

        const existingEmail = await Contact.findOne({ email })
        if(existingEmail) return res.status(400).json({ message: "Your email already exist. We will contact to u."})
        
        const contact = new Contact({
            title,
            message,
            email,
            IP_Address
        })

        const info = await transporter.sendMail({
            from: '"SnapStack.art - Contact" <contact@cordision.com>',
            to: email,
            subject: 'We got your message!',
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
                        <h2 style="margin:0 0 8px 0;font-size:22px;color:#0f172a;">We got your message! ✅</h2>
                        <p style="margin:0 0 18px 0;color:#475569;font-size:15px;line-height:1.5;">
                            Hello!<strong></strong>&nbsp; We wanted to let you know because we got your message.<br/>&nbsp;Don't worry, We'll callback.
                        </p>
            
                        <table cellpadding="0" cellspacing="0" role="presentation" style="width:100%;margin:16px 0 22px 0;">
                            <tr>
                            <td style="background:#f8fafc;border-radius:10px;padding:12px 14px;color:#334155;font-size:13px;">
                                <strong>Contact Details</strong><br>
                                Email: <span style="color:#0f172a;">${email}</span><br>
                                Message: <span style="color:#0f172a">${message}</span><br>
                            </td>
                            </tr>
                        </table>
            
                        <p style="margin:18px 0 0 0;color:#94a3b8;font-size:13px;">
                            İf you did not contact to us, please do not reply to this email and contact with support mail: <a href="mailto:support@snapstack.art" style="color:#7c3aed;text-decoration:none;">support@snapstack.art</a>
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
                    </table>
                </td>
                </tr>
            </table>
              
            `
        })

        transporter.sendMail(info)

        await contact.save()

        res.status(201).json({ contact })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const DeleteContact = async (req, res) => {
    try {
        const contactId = req.params.id;
        const contact = await Contact.findByIdAndDelete(contactId)
        if(!contact) return res.status(400).json({ message: "Contact data isn't found." })

        res.json({ message: "Successfully deleted.", contact: contactId})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const BanIP = async(req, res) => {
    try {
        
    } catch (error) {
        
    }
}

const showAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find()
        res.status(201).json({ contacts })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { CreateContact, showAllContacts, DeleteContact }