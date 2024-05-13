import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";

const LoginRegister = () => {
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [occupation, setOccupation] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState("");

  const [loginNameError, setLoginNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [occupationError, setOccupationError] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {};

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleRegister = async () => {
    try {
      setRegistrationError("");
      setLoginNameError("");
      setPasswordError("");
      setConfirmPasswordError("");
      setFirstNameError("");
      setLastNameError("");
      setLocationError("");
      setDescriptionError("");
      setOccupationError("");

      let isValid = true;
      if (!loginName) {
        setLoginNameError("Please enter a login name");
        isValid = false;
      }
      if (!password) {
        setPasswordError("Please enter a password");
        isValid = false;
      } else if (!validatePassword(password)) {
        setPasswordError(
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        );
        isValid = false;
      }

      if (!confirmPassword) {
        setConfirmPasswordError("Please confirm your password");
        isValid = false;
      } else if (password !== confirmPassword) {
        setConfirmPasswordError("Confirm Password doesn't match Password");
        return;
      }
      // Add validation for other fields

      // if (confirmPassword !== password) {
      //   isValid = false;
      //   setConfirmPasswordError("Confirm password doesn't match password");
      // }

      if (!firstName) {
        setFirstNameError("Please enter your first name");
        isValid = false;
      }

      if (!lastName) {
        setLastNameError("Please enter your last name");
        isValid = false;
      }

      if (!location) {
        setLocationError("Please enter your location");
        isValid = false;
      }

      if (!description) {
        setDescriptionError("Please enter a description");
        isValid = false;
      }

      if (!occupation) {
        setOccupationError("Please enter your occupation");
        isValid = false;
      }

      if (!isValid) {
        return;
      }

      console.log(
        JSON.stringify({
          login_name: loginName,
          first_name: firstName,
          last_name: lastName,
          location: location,
          description: description,
          occupation: occupation,
          password: password,
        })
      );
      // If all fields are valid, proceed with registration
      const response = await fetch(
        "https://vjdpc4-3000.csb.app/admin/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            login_name: loginName,
            first_name: firstName,
            last_name: lastName,
            location: location,
            description: description,
            occupation: occupation,
            password: password,
          }),
        }
      );
      if (response.ok) {
        setLoginName("");
        setPassword("");
        setConfirmPassword("");
        setFirstName("");
        setLastName("");
        setLocation("");
        setDescription("");
        setOccupation("");
        setRegistrationSuccess("Registration successful!");
        navigate("/login");
      } else {
        const errorData = await response.json();
        setRegistrationError(errorData.error);
      }
    } catch (error) {
      console.error("Error registering user:", error);
      setRegistrationError("An unexpected error occurred");
    }
  };

  return (
    <div style={{ padding: "0 20px" }}>
      <Typography variant="h6" gutterBottom>
        Register
      </Typography>
      <TextField
        label="Login Name"
        value={loginName}
        onChange={(e) => {
          setLoginName(e.target.value);
          setLoginNameError(""); // change
        }}
        fullWidth
        margin="normal"
        error={loginNameError !== ""}
        helperText={loginNameError}
      />
      <TextField
        type="password"
        label="Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setPasswordError("");
        }}
        fullWidth
        margin="normal"
        error={passwordError !== ""}
        helperText={passwordError}
      />
      <TextField
        type="password"
        label="Confirm Password"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          setConfirmPasswordError("");
        }}
        fullWidth
        margin="normal"
        error={confirmPasswordError !== ""}
        helperText={confirmPasswordError}
      />
      <TextField
        label="First Name"
        value={firstName}
        onChange={(e) => {
          setFirstName(e.target.value);
          setFirstNameError("");
        }}
        fullWidth
        margin="normal"
        error={firstNameError !== ""}
        helperText={firstNameError}
      />
      <TextField
        label="Last Name"
        value={lastName}
        onChange={(e) => {
          setLastName(e.target.value);
          setLastNameError("");
        }}
        fullWidth
        margin="normal"
        error={lastNameError !== ""}
        helperText={lastNameError}
      />
      <TextField
        label="Location"
        value={location}
        onChange={(e) => {
          setLocation(e.target.value);
          setLocationError("");
        }}
        fullWidth
        margin="normal"
        error={locationError !== ""}
        helperText={locationError}
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          setDescriptionError("");
        }}
        fullWidth
        margin="normal"
        error={descriptionError !== ""}
        helperText={descriptionError}
      />
      <TextField
        label="Occupation"
        value={occupation}
        onChange={(e) => {
          setOccupation(e.target.value);
          setOccupationError("");
        }}
        fullWidth
        margin="normal"
        error={occupationError !== ""}
        helperText={occupationError}
      />
      {registrationError && (
        <Typography variant="body2" color="error">
          {registrationError}
        </Typography>
      )}
      {registrationSuccess && (
        <Typography variant="body2" color="success">
          Registration successful!
        </Typography>
      )}
      <Button
        variant="contained"
        onClick={handleRegister}
        fullWidth
        style={{ marginTop: "10px" }}
      >
        Register
      </Button>
      <Typography
        variant="body2"
        align="center"
        gutterBottom
        sx={{ marginTop: "1rem" }}
      >
        Already have an account? <Link to="/login">Login</Link>
      </Typography>
    </div>
  );
};

export default LoginRegister;
