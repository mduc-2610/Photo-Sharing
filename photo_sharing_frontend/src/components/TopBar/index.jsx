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
      <Toolbar
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link component={RouterLink} to="/" color="inherit" underline="none">
          <Typography variant="h6" color="inherit">
            Home
          </Typography>
        </Link>
        <div>
          {loggedInUser ? (
            <Button
              color="inherit"
              onClick={() => {
                navigate(`/users/${loggedInUser._id}`);
              }}
              style={{ textTransform: "none" }}
            >
              Hi, {loggedInUser.first_name}
            </Button>
          ) : (
            <Typography variant="h6" color="inherit">
              Please login
            </Typography>
          )}
          {loggedInUser && (
            <Button
              color="inherit"
              onClick={handleAddPhoto}
              style={{ textTransform: "none" }}
            >
              Add Photo
            </Button>
          )}
          {loggedInUser ? (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          ) : null}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
