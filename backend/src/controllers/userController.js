const User = require("../models/User");

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("name email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      id: user._id,
      name: user.name || "",
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim() },
      { returnDocument: "after", runValidators: true }
    ).select("name email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      id: user._id,
      name: user.name || "",
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
