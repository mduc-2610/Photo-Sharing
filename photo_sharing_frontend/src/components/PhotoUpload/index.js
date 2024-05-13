import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Typography, Button } from "@mui/material";
import { BASE_URL } from "../../utils/constants";

const PhotoUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [requestUser, setRequestUser] = useState(null);
  const [success, setSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setRequestUser(storedUser);
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setError("");

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    try {
      if (!file) {
        setError("No file selected.");
        return;
      }

      const fileName = file.name.replace(/\s+/g, "_");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("file_name", fileName);
      formData.append("user_id", requestUser["_id"]);
      const response = await fetch(`${BASE_URL}/api/photo`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload photo.");
      }
      console.log(await response.json());

      setSuccess(true);
      setError(null);
    } catch (error) {
      setError(error.message);
      setSuccess(false);
    }
    navigate(`/photos/${userId}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div>
        <Typography variant="h6" gutterBottom>
          Upload your Photo
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <input type="file" onChange={handleFileChange} />
          <Button variant="contained" onClick={handleUpload}>
            Upload
          </Button>
        </div>
      </div>
      {previewUrl && (
        <div style={{ marginTop: "12px" }}>
          <img
            src={previewUrl}
            alt="Preview"
            style={{ maxWidth: "100%", maxHeight: "100%", width: "100%" }}
          />
        </div>
      )}
      {error && (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      )}
      {success && (
        <Typography variant="body2" color="success">
          Photo uploaded successfully!
        </Typography>
      )}
    </div>
  );
};

export default PhotoUpload;
