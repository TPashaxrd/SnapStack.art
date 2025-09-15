const express = require("express")
const Report = require("../models/Report")

const CreateReport = async (req, res) => {
    try {
        const { reason, artId } = req.body;
        if(!req.session.userId) {
            return res.status(400).json({ message: "You must be logged in."})
        }
        if(!reason || !artId) {
            return res.status(400).json({ message: "All fields are required." })
        }
        const userId = req.session.userId

        const newreport = new Report({
            user: userId,
            reason,
            artId
        })

        await newreport.save()

        res.status(201).json(newreport)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const showAllReports = async(req, res) => {
    try {
        const reports = await Report.find()
        res.status(201).json({ reports })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { CreateReport, showAllReports }