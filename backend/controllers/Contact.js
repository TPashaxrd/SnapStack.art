const express = require("express");
const Contact = require("../models/Contact");

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