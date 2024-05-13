const express = require("express");
const cors = require("cors");
const session = require("express-session");

const app = express();
app.use(cors());

const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const LoginRegisterRouter = require("./routes/LoginRegisterRouter");
// const CommentRouter = require("./routes/CommentRouter");

dbConnect();

app.use(express.json());
app.use(express.static("public"));
app.use(
  session({
    secret: "DUC_KEY",
    resave: false,
    saveUninitialized: true,
  }),
);
app.use("/api/user", UserRouter);
app.use("/api/photo", PhotoRouter);
app.use("/admin", LoginRegisterRouter);
app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});

app.get("/api/check-session", (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).send("Session not found");
  }
});
// app.get("/users", (req, res) => {
//   const userList = models.userListModel();
//   res.json(userList);
// });

// app.get("/users/:userId", (req, res) => {
//   const userId = req.params.userId;
//   const user = models.userModel(userId);
//   if (user) {
//     res.json(user);
//   } else {
//     res.status(404).send("User not found");
//   }
// });

// app.get("/photos/:userId/", (req, res) => {
//   const userId = req.params.userId;
//   const userPhotos = models.photoOfUserModel(userId);
//   res.json(userPhotos);
// });
PORT = 3000;
app.listen(PORT, function () {
  console.log(`Server is listening on port ${PORT}`);
});
