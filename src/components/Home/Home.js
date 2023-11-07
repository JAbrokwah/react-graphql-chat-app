import React, { useState, useEffect } from "react";
import { Typography, Button } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import decode from "jwt-decode";
import { Link } from "react-router-dom";
import "../../App.css";
import RoomPanel from "../Roomspannel";
import CreateOrJoinLobby from "../CreateJoinPannel";
import NavBar from "../NavBar";

//public lobbies
const roomsData = [
  { id: 1, name: "Room 1" },
  { id: 2, name: "Room 2" },
  { id: 3, name: "Room 3" },
  { id: 4, name: "Room 4" },
  { id: 5, name: "Room 5" },
  { id: 6, name: "Room 6" },
  { id: 7, name: "Room 7" },
  { id: 8, name: "Room 8" },
  { id: 9, name: "Room 9" },
  { id: 10, name: "Room 10" },
  // Add more rooms as needed
];

function Home() {
  const history = useNavigate();

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const [customtoken, setcustomtoken] = useState(false);

  const [rooms, setRooms] = useState(roomsData);

  const onDeleteRoom = (roomId) => {
    // Filter out the room with the specified ID to delete it
    const updatedRooms = rooms.filter((room) => room.id !== roomId);
    setRooms(updatedRooms);
    console.log(rooms);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    history("/auth");
  };

  useEffect(() => {
    // const token = user ? (user.signin ? user.signin.token : user.signup ? user.signup.token : user.exp) : null;

    let token;
    if (user) {
      if (user.exp) {
        token = user.exp;
        const currentTimestamp = Math.floor(Date.now() / 1000); // Get the current timestamp in seconds
        if (token < currentTimestamp) {
          // Token has expired
          console.log("Google login token has expired");
          logout();
        } else {
          // Token is still valid
          console.log("Google login token is still valid");
        }
      } else if (user) {
        token = user.token;
        setcustomtoken(true);
      } else {
        token = null;
      }
    }

    console.log("to check out on expire");
    console.log(token);

    if (customtoken) {
      const decodedToken = decode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) {
        console.log("Custom login token has expired");
        logout();
      } else {
        console.log("Custom login token is still valid");
      }
    }
  });

  return (
    <div>
      {user ? (
        <div>
          <NavBar user={user} logout={logout} customtoken={customtoken} />
          <div className="App">
            <div style={{ marginTop: "2%" }}>
              <RoomPanel rooms={rooms} onDeleteRoom={onDeleteRoom} />
            </div>
            <div style={{ marginTop: "2%" }}>
              <CreateOrJoinLobby />
            </div>
          </div>
        </div>
      ) : (
        <>
          <Typography variant="h6">You are logged out!!!! </Typography>
          <Button
            component={Link}
            to="/auth"
            variant="contained"
            color="primary"
          >
            Sign In
          </Button>
        </>
      )}
    </div>
  );
}

export default Home;
