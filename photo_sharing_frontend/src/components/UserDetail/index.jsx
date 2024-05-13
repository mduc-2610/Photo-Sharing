import React, { useState, useEffect } from "react";
import { Typography, Link, LinearProgress, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { fetchModel } from "../../lib/fetchModelData";

function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await fetchModel(`/user/${userId}`);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [userId]);

  if (!user) {
    return <LinearProgress />;
  }

  return (
    <>
      <div style={{ padding: "20px" }}>
        <Typography variant="h4">{`${user.first_name} ${user.last_name}`}</Typography>
        <Typography
          variant="body1"
          dangerouslySetInnerHTML={{
            __html: `
            First name: ${user.first_name} <br />
            Last name: ${user.last_name} <br />
            Location: ${user.location} <br />
            Description: ${user.description} <br />
            Occupation: <i>${user.occupation}</i>
          `,
          }}
        />
        <Button
          style={{ marginTop: "12px" }}
          variant="contained"
          color="primary"
          onClick={() => {
            navigate(`/photos/${userId}`);
          }}
        >
          View Photos
        </Button>
      </div>
    </>
  );
}

export default UserDetail;
