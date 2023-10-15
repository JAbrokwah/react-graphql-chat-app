import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../../App.css';

function Home() {
    const history = useNavigate();

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));

    const logout = () => {
      localStorage.clear();
      history('/');
      setUser(null);
    };
    console.log("From Home!!!")
    console.log(user);
  return (
    <div>
      <h1>Welcome to Our Website</h1>
      <p>This is the home page of our website.</p>
      <div className="App">
      {user ? (
          <div>
            <Typography variant="h6">You are logged in!!!! Route to main page when built</Typography>
            {/* <Button variant="contained" color="secondary">Logout</Button> */}
            <Button variant="contained" color="secondary" onClick={logout}>Logout</Button>
          </div>
        ) : (
          <Button component={Link} to="/auth" variant="contained" color="primary">Sign In</Button>
        )}
    </div>
    </div>

  );
}

export default Home;