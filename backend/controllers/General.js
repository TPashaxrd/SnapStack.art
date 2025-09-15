const express = require("express")
const Arts = require("../models/Arts")

const getPopulerArts = async (req, res) => {
    try {
        const popularArts = await Arts.find()
        .sort({ likes: -1 })
        .limit(10)

        res.json(popularArts)
    } catch (error) {
        res.json(500).json({ message: error.message })
    }
}

const getUserMostArt = async (req, res) => {
    try {
        // const 
    } catch (error) {
        
    }
}

const getTrending = async (req, res) => {
    try {
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

        const trending = await Arts.find({
            date: { $gte: oneWeekAgo }
        })
        .sort({ likes: -1, view: -1, "comments.length": -1 })
        .limit(20)

        res.json(trending)
    } catch (error) {
        res.status(500).json({ message: "Trending error", error: error.message})
    }
}
 
const getLatestArts = async (req, res) => {
    try {
        const latest = await Arts.find()
        .sort({ date: -1 })
        .limit(20)

        res.json(latest)
    } catch (error) {
        res.json({ message: error.message })
    }
}

const getRandomArts = async (req, res) => {
    try {
        const random = await Arts.aggregate([{ $sample: { size: 10 }}])
        res.json(random)
    } catch (error) {
        res.json({ message: error.message })
    }
}

module.exports = { getPopulerArts, getTrending, getLatestArts, getRandomArts }