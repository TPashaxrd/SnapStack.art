const adminAuth = (req, res, next) => {
  const { password } = req.body;
  const ADMIN_PASSWORD = "2443s";
  console.log("clicked")
  if (!password) {
    return res.json({ success: false, message: "Password is required" });
  }

  if (password !== ADMIN_PASSWORD) {
    return res.json({ success: false, message: "Unauthorized" });
  }

  next();
};

module.exports = adminAuth;
