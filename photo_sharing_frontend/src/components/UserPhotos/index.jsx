import React, { useState, useEffect } from "react";
import {
  Typography,
  Link,
  Divider,
  TextField,
  Button,
  LinearProgress,
  IconButton,
  Paper,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { fetchModel } from "../../lib/fetchModelData";
import { makeStyles } from "@mui/styles";
import SendIcon from "@mui/icons-material/Send";
import { BASE_URL } from "../../utils/constants";
import { formatDate } from "../../utils/function";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
    // marginBottom: "12px",
  },
  input: {
    flexGrow: 1,
    marginRight: "2px",
  },
  button: {
    marginLeft: "auto",
  },
}));

function UserPhotos() {
  const classes = useStyles();
  const { userId } = useParams();
  const [requestUser, setRequestUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentTexts, setCommentTexts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setRequestUser(storedUser);
  }, []);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const photosData = await fetchModel(`/user/photosOfUser/${userId}`);
        setPhotos(photosData);
        const initialCommentTexts = photosData.reduce((acc, photo) => {
          acc[photo._id] = "";
          return acc;
        }, {});
        setCommentTexts(initialCommentTexts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };

    fetchPhotos();
  }, [userId]);

  if (loading) {
    return <LinearProgress />;
  }

  const handleCommentTextChange = (photoId, newText) => {
    setCommentTexts((prevCommentTexts) => ({
      ...prevCommentTexts,
      [photoId]: newText,
    }));
  };

  const handleAddComment = async (photoId) => {
    console.log("Request User: " + requestUser["_id"]);
    const text = commentTexts[photoId];
    if (!text || text.trim() === "") {
      console.error("Comment cannot be empty");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/api/photo/commentsOfPhoto/${photoId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: text,
            user_id: requestUser["_id"],
          }),
        }
      );
      // "user_id": "57231f1a30e4351f4e9f4bd7",
      // "comment": "MY comment",
      // "date_time": "2024-05-12T14:04:56.431Z",
      // "user": {
      //     "first_name": "Ian",
      //     "last_name": "Malcolm"
      // }
      console.log(`${BASE_URL}/api/photo/commentsOfPhoto/${photoId}`);
      if (response.ok) {
        const data = await response.json();
        const newComment = data["newComment"];
        const formatComment = {
          user_id: newComment["user_id"],
          comment: newComment["comment"],
          date_time: newComment["date_time"],
          user: {
            first_name: newComment["user"]["first_name"],
            last_name: newComment["user"]["last_name"],
          },
        };
        console.log(formatComment.user);
        setPhotos((prevPhotos) =>
          prevPhotos.map((photo) =>
            photo._id === photoId
              ? {
                  ...photo,
                  comments: [...(photo.comments || []), formatComment],
                }
              : photo
          )
        );
        setCommentTexts((prevCommentTexts) => ({
          ...prevCommentTexts,
          [photoId]: "",
        }));
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <>
      {photos.length === 0 ? (
        <div
          style={{
            padding: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body1">
            No photos found for this user.
          </Typography>
          {requestUser["_id"] === userId && (
            <Button
              variant="contained"
              color="primary"
              style={{ marginLeft: "10px" }}
              onClick={() => {
                navigate(`/photo-upload/${requestUser["_id"]}`);
              }}
            >
              Add Photo
            </Button>
          )}
        </div>
      ) : (
        photos.map((photo) => (
          <div key={photo._id}>
            <Typography variant="body1">
              <img
                src={
                  photo.file_name.startsWith("http")
                    ? photo.file_name
                    : `${BASE_URL}/images/${photo.file_name}`
                }
                alt={photo.title}
                style={{ maxWidth: "100%" }}
              />
            </Typography>
            <Typography
              variant="body1"
              style={{ fontSize: "10px", paddingLeft: "10px" }}
            >
              {formatDate(new Date(photo.date_time))}
            </Typography>
            <div style={{ padding: "10px 10px 10px" }}>
              <Typography variant="body1" style={{ marginBottom: "5px" }}>
                Comments:
              </Typography>
              <div
                style={{
                  marginBottom: "15px",
                  maxHeight: "200px",
                  overflowY: "auto",
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(0,0,0, 0.2) rgba(0,0,0, 0)",
                  WebkitOverflowScrolling: "touch",
                  // "&::-webkit-scrollbar": {
                  //   width: "6px",
                  // },
                  // "&::-webkit-scrollbar-thumb": {
                  //   backgroundColor: "rgba(0, 0, 0, 0.2)",
                  //   borderRadius: "3px",
                  // },
                }}
              >
                {photo.comments && photo.comments.length > 0 ? (
                  photo.comments.map((comment) => (
                    <div key={comment._id} style={{ marginBottom: "10px" }}>
                      <Typography variant="body2">
                        <Button
                          variant="text"
                          color="inherit"
                          onClick={() => {
                            navigate(`/users/${comment.user_id}`);
                          }}
                          style={{
                            paddingLeft: "0px",
                            textDecoration: "none",
                            color: "green",
                            textTransform: "none",
                          }}
                        >
                          {comment.user.first_name} {comment.user.last_name}
                        </Button>
                      </Typography>
                      <Typography
                        variant="body2"
                        dangerouslySetInnerHTML={{
                          __html: `${comment.comment}`,
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <Typography variant="body2">
                    No comments for this photo.
                  </Typography>
                )}
              </div>
            </div>
            <Paper className={classes.container}>
              <TextField
                variant="outlined"
                label="Add a comment"
                value={commentTexts[photo._id]}
                onChange={(e) =>
                  handleCommentTextChange(photo._id, e.target.value)
                }
                className={classes.input}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddComment(photo._id);
                  }
                }}
              />
              <IconButton
                color="primary"
                onClick={() => handleAddComment(photo._id)}
                className={classes.button}
              >
                <SendIcon />
              </IconButton>
            </Paper>
            <Divider style={{ marginBottom: "20px" }} />
          </div>
        ))
      )}
    </>
  );
}

export default UserPhotos;
