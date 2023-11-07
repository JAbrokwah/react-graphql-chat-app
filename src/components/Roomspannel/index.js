import React from "react";
import GroupsIcon from "@mui/icons-material/Groups";
import { Tabs, Tab } from "@material-ui/core";
import Box from "@mui/material/Box";
import { Button } from "@material-ui/core";
import ClearIcon from "@mui/icons-material/Clear";

const RoomPanel = ({ rooms, onDeleteRoom }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log("To see if called");
    console.log(value);
  };

  return (
    <div>
      <Box sx={{ width: "100%", margin: "auto", bgcolor: "#e0e0e0" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          {rooms.map((room) => (
            <Tab
              key={room.id}
              label={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <ClearIcon
                    style={{
                      cursor: "pointer",
                      position: "absolute",
                      right: 0,
                    }}
                    onClick={() => onDeleteRoom(room.id)}
                  />
                  <GroupsIcon fontSize="large" />
                  <span style={{ marginLeft: "8px" }}>{room.name}</span>
                </div>
              }
            />
          ))}
        </Tabs>
      </Box>
    </div>
  );
};

export default RoomPanel;
