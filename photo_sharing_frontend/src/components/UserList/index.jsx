import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
} from "@mui/material";
import { fetchModel } from "../../lib/fetchModelData";

function UserList({ sideBar }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await fetchModel("/user/list");
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <div
      style={
        sideBar
          ? {
              maxHeight: "470px",
              overflowY: "auto",
              scrollbarWidth: "thin",
            }
          : null
      }
    >
      {sideBar && (
        <Link
          to="/users"
          style={{
            marginLeft: "13px",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          All users
        </Link>
      )}

      <List component="nav">
        {users.map((user) => (
          <React.Fragment key={user._id}>
            <div
              styles={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContens: "center",
              }}
            >
              <Link
                to={`/users/${user._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem button>
                  <ListItemText
                    primary={`${user.first_name} ${user.last_name}`}
                  />
                </ListItem>
              </Link>
              {!sideBar && (
                <Link
                  to={`/photos/${user._id}`}
                  style={{
                    textDecoration: "",
                    color: "blue",
                    alignSelf: "center",
                    justifySelf: "center",
                    marginLeft: "15px",
                  }}
                >
                  View photos
                </Link>
              )}
            </div>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

export default UserList;
