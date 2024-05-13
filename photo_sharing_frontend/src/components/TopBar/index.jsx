import React from "react";
import { AppBar, Toolbar, Typography, Link, Button } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/constants";

const TopBar = ({ loggedInUser, setLoggedInUser }) => {
  const navigate = useNavigate();

  const handleAddPhoto = () => {
    if (loggedInUser) {
      const userId = loggedInUser._id;
      navigate(`/photo-upload/${userId}`);
    } else {
      navigate("/login");
    }
  };

  // const handleLogout = async () => {
  //   try {
  //     const response = await fetch(`${BASE_URL}/admin/logout`, {
  //       method: "POST",
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to logout");
  //     }

  //   } catch (error) {
  //     console.error("Error logging out:", error);
  //   }
  // };
  const handleLogout = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/logout`, {
        method: "POST",
      });

      localStorage.removeItem("user");
      setLoggedInUser(null);
      navigate("/login");
      if (!response.ok) {
        throw new Error("Failed to logout");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      // Handle error
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Link component={RouterLink} to="/" color="inherit" underline="none">
          <Typography variant="h6" color="inherit">
            Home
          </Typography>
        </Link>
        <Typography variant="h6" color="inherit" style={{ marginLeft: "auto" }}>
          {loggedInUser ? `Hi, ${loggedInUser.first_name}` : "Please login"}
        </Typography>
        {loggedInUser && (
          <Button color="inherit" onClick={handleAddPhoto}>
            Add Photo
          </Button>
        )}
        {loggedInUser ? (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        ) : null}
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
