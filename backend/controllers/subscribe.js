const subs = require("../models/Subscribe")

const CreateSubs = async(req, res) => {
    try {
        const { email, IP_Address } = req.body;
        if(!email || !IP_Address) {
            return res.status(500).json({ message: "All fields are required."})
        }
        const existing = await subs.findOne({ email })
        if(existing) { 
            return res.status(400).json({ message: "Email already subscribed"})
        }
        const newsubs = new subs({
            email,
            IP_Address
        })

        await newsubs.save()

        res.status(200).json(newsubs)
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: error.message });
    }
}

module.exports = { CreateSubs }