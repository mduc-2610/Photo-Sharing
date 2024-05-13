import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/constants";

const Login = ({ setLoggedInUser }) => {
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login_name: loginName, password: password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const userData = await response.json();

      localStorage.setItem("user", JSON.stringify(userData));
      setLoggedInUser({
        _id: userData._id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        location: userData.location,
        description: userData.description,
        occupation: userData.occupation,
      });

      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h6" gutterBottom>
        Login
      </Typography>
      <TextField
        label="Login Name"
        variant="outlined"
        value={loginName}
        onChange={(e) => setLoginName(e.target.value)}
        fullWidth
      />
      <TextField
        type="password"
        label="Password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        style={{ marginTop: "8px" }}
      />
      <div style={{ marginTop: "8px" }}>
        {error && <Typography color="error">{error}</Typography>}
      </div>
      <div style={{ marginTop: "8px" }}>
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Login
        </Button>
        <Button
          variant="outlined"
          color="primary"
          sx={{ marginLeft: "8px" }}
          onClick={handleRegister}
        >
          Register
        </Button>
      </div>
    </div>
  );
};

export default Login;
