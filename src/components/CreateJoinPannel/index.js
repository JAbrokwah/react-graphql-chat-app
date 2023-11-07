import React, { useState } from "react";

import {
  Button,
  Container,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  Switch,
} from "@mui/material";

const CreateOrJoinLobby = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);

  const [lobbyName, setLobbyName] = useState("");
  const [lobbyDescription, setLobbyDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const [lobbyURL, setLobbyURL] = useState("");
  const [lobbyID, setLobbyID] = useState("");
  const [password, setPassword] = useState("");

  const [enteringURL, setEnteringURL] = useState(false);

  const openCreateModal = () => {
    setCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
  };

  const openJoinModal = () => {
    setJoinModalOpen(true);
  };

  const closeJoinModal = () => {
    setJoinModalOpen(false);
  };

  const handleCreateLobby = () => {
    //Logic to create the lobby here
    closeCreateModal();
  };

  const handleJoinLobby = () => {
    // Handle joining the lobby
    closeJoinModal();
  };

  const toggleEnteringMode = () => {
    setEnteringURL(!enteringURL);
  };

  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "lightpink",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        style={{ marginTop: "5%" }}
      >
        <h3>Create / Join Lobby</h3>
      </Typography>
      <Button
        onClick={openCreateModal}
        variant="contained"
        color="primary"
        style={{ marginTop: "2%" }}
      >
        Create Lobby
      </Button>
      <Button
        onClick={openJoinModal}
        variant="contained"
        color="secondary"
        style={{ marginTop: "5%", marginBottom: "10%" }}
      >
        Join Lobby
      </Button>

      <Dialog
        open={createModalOpen}
        onClose={closeCreateModal}
        aria-labelledby="create-lobby-dialog-title"
      >
        <DialogTitle id="create-lobby-dialog-title">Create Lobby</DialogTitle>
        <DialogContent>
          <TextField
            label="Lobby Name"
            value={lobbyName}
            onChange={(e) => setLobbyName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Lobby Description"
            value={lobbyDescription}
            onChange={(e) => setLobbyDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
          <FormControlLabel
            control={
              <Switch
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label="Private Lobby"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateLobby} color="primary">
            Create
          </Button>
          <Button onClick={closeCreateModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={joinModalOpen}
        onClose={closeJoinModal}
        aria-labelledby="join-lobby-dialog-title"
      >
        <DialogTitle id="join-lobby-dialog-title">Join Lobby</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Switch
                checked={enteringURL}
                onChange={toggleEnteringMode}
                color="primary"
              />
            }
            label="Enter Lobby URL"
          />
          {enteringURL ? (
            <TextField
              label="Lobby URL"
              fullWidth
              value={lobbyURL}
              onChange={(e) => setLobbyURL(e.target.value)}
              margin="normal"
            />
          ) : (
            <>
              <TextField
                label="Lobby ID"
                fullWidth
                value={lobbyID}
                onChange={(e) => setLobbyID(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleJoinLobby} color="primary">
            Join
          </Button>
          <Button onClick={closeJoinModal} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateOrJoinLobby;
