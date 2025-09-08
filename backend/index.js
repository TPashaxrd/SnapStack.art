const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const app = express();
const MongoStore = require("connect-mongo");
const session = require("express-session");
const AuthRoutes = require("./routes/Auth");
const ArtRoutes = require("./routes/Arts");
const path = require("path")

db();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "ITS_MY_SECRET",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        sameSite: "lax",
        secure: false
    }
}));

app.use("/api/user", AuthRoutes);
app.use("/api/arts", ArtRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));