import Activity from "../models/activity.model.js";

export const trackDomain = async (req, res) => {
  try {
    const { url, duration } = req.body;
    const userId = req.user?._id || req.user?.id;

    if (!url || !duration || !userId) {
      console.log("Missing fields:", { url, duration, userId });
      return res.status(400).json({ message: "Missing url, duration, or userId" });
    }

    const activity = new Activity({
      url,
      duration,
      userId,
      timestamp: new Date()
    });

    await activity.save();
    res.status(200).json({ message: "Activity recorded" });
  } catch (error) {
    console.error("Error saving activity:", error);
    res.status(500).json({ message: "Failed to record activity" });
  }
};
