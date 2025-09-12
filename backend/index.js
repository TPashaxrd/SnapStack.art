const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const app = express();
const MongoStore = require("connect-mongo");
const session = require("express-session");
const AuthRoutes = require("./routes/Auth");
const ArtRoutes = require("./routes/Arts");
const path = require("path");
const SubsRoutes = require("./routes/Subscribe");
const SettingsRoutes = require("./routes/Settings");
const DashboardRoutes = require("./routes/dashboard");
const { limiter } = require("./middlewares/rateLimit");
const SearchRoutes = require("./routes/Search");
const PasswordRoutes = require("./routes/Password");
const ContactRoutes = require("./routes/Contact");

db();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    collectionName: "sessions"
  });
app.use(session({
    secret: "ITS_MY_SECRET",
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: "lax",
      secure: false
    }
  }));
  

app.use("/api/user",  AuthRoutes);
app.use("/api/arts",  ArtRoutes);
app.use("/api/subs",  SubsRoutes)
app.use("/api/settings",  SettingsRoutes)
app.use("/api/dashboard",  DashboardRoutes)
app.use("/api/search", SearchRoutes)
app.use("/api/password", PasswordRoutes)
app.use("/api/contact", ContactRoutes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));