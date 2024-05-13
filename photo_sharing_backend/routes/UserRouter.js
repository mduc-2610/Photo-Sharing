const express = require("express");
const User = require("../db/userModel");
const Photo = require("../db/photoModel");
const router = express.Router();

router.get("/list", async (req, res) => {
  try {
    const users = await User.find({}, "_id first_name last_name");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(
      id,
      "first_name last_name location description occupation",
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/photosOfUser/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const photos = await Photo.find(
      { user_id: id },
      "_id user_id comments file_name date_time",
    ).populate({
      path: "comments",
      select: "comment date_time user_id",
    });

    if (photos) {
      const formattedPhotos = await Promise.all(
        photos.map(async (photo) => {
          const formattedComments = await Promise.all(
            photo.comments.map(async (comment) => {
              const commenter = await User.findById(comment.user_id);
              return {
                comment: comment.comment,
                date_time: comment.date_time,
                user_id: comment.user_id,
                user: {
                  first_name: commenter.first_name,
                  last_name: commenter.last_name,
                },
              };
            }),
          );

          return {
            _id: photo._id,
            file_name: photo.file_name,
            date_time: photo.date_time,
            user_id: photo.user_id,
            comments: formattedComments,
          };
        }),
      );
      res.json(formattedPhotos);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;
