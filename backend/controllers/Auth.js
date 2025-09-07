const express = require("express")
const dotenv = require("dotenv")
const crypto = require("crypto");
const User = require("../models/User");
const bcrypt = require("bcryptjs")

const CreateUser = async (req, res) => {
    const { username, email, password, IP_Address } = req.body;
    try {
        if(!username || !email || !password || !IP_Address) {
            return res.status(400).json({ message: "All fields are required." })
        }
        const existing = await User.findOne({ email })
        if(existing) return res.status(400).json({ message: "Email already exists"})
        
        const hashed = await bcrypt.hash(password, 10)
        
        const user = await User.create({ username, email, password: hashed, IP_Address })
        req.session.userId = user._id;

        res.status(201).json({ message: "Registered successfully", user: { id: user._id, username, email }})
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
    if (!req.session.userId) return res.status(401).json({ message: "Not logged in" });
    const user = await User.findById(req.session.userId).select("-password");
    res.json({ user });
}

module.exports = { me, Logout, CreateUser, Login }