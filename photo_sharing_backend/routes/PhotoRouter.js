const express = require("express");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const multer = require("multer");
const router = express.Router();

// router.get("/commentsOfPhoto/:photo_id", async (req, res) => {
//   try {
//     const { photo_id } = req.params;

//     // Find the photo by its ID
//     const photo = await Photo.findById(photo_id);

//     if (!photo) {
//       return res.status(404).json({ error: "Photo not found" });
//     }

//     // Retrieve comments associated with the photo
//     const comments = photo.comments;

//     res.status(200).json({ comments });
//   } catch (error) {
//     console.error("Error fetching comments:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

router.post("/commentsOfPhoto/:photo_id", async (req, res) => {
  try {
    const { photo_id } = req.params;
    const { comment, user_id } = req.body;

    if (comment && comment.trim() === "") {
      return res.status(400).json({ error: "Comment cannot be empty" });
    }

    const photo = await Photo.findById(photo_id);
    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }

    const user = await User.findById(user_id);
    const newComment = {
      user_id: user_id,
      comment: comment,
      date_time: new Date(),
      user: {
        first_name: user.first_name,
        last_name: user.last_name,
      },
      // user: user
    };

    photo.comments.push(newComment);
    await photo.save();

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      newComment: newComment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname.replace(/\s+/g, "_"));
  },
});

const upload = multer({
  storage: storage,
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { file_name, user_id } = req.body;

    const newPhoto = new Photo({
      file_name: file_name,
      user_id: user_id,
      comments: [],
    });

    const savedPhoto = await newPhoto.save();

    res.status(201).json({
      savedPhoto,
    });
  } catch (error) {
    console.error("Error creating photo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const photos = await Photo.find();
    res.json(photos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
