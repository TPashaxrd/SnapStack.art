app.post("/api/user/change-password", async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const match = await bcrypt.compare(oldPassword, user.password);
      if (!match) return res.status(400).json({ message: "Old password is incorrect" });
  
      // Şifreyi güncelle
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
  
      // Tüm session'ları logout et
      await logoutAllSessions(user._id); 
  
      res.json({ message: "Password changed, all sessions logged out!" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });
  