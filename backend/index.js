const express = require("express")
const cors = require("cors")
const db = require("./config/db")
const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))

db()
app.use(express.json())

PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})