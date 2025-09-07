const express = require("express")
const cors = require("cors")
const db = require("./config/db")
const app = express()
const MongoStore = require("connect-mongo")
const session = require("express-session")
const AuthRoutes = require("./routes/Auth")

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))

db()
app.use(express.json())
app.use(session({
    secret: "ITS_MY_SECRET",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
    }
}))


app.use("/api/user", AuthRoutes)


PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})