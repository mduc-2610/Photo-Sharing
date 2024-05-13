const express = require("express");
const Photo = require("../db/photoModel");
const Comment = require("../db/commentModel"); // Assuming you have a comment model
const router = express.Router();

router.post("/:photoId/comments", async (req, res) => {
  const { photoId } = req.params;
  try {
    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }

    // Create a new comment based on the request body
    const newComment = new Comment(req.body);
    // Save the new comment
    await newComment.save();

    // Push the ID of the newly created comment to the comments array of the photo
    photo.comments.push(newComment._id);
    // Save the updated photo
    await photo.save();

    res.status(201).json(newComment); // Return the newly created comment
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:photoId/comments", async (req, res) => {
  const { photoId } = req.params;
  try {
    const photo = await Photo.findById(photoId).populate("comments");
    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }
    res.json(photo.comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
