import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import decode from 'jwt-decode';
import { Link } from 'react-router-dom';
import '../../App.css';

function Home() {
    const history = useNavigate();

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const [customtoken,setcustomtoken]= useState(false)

    const logout = () => {
      localStorage.clear();
      history('/');
      setUser(null);
    };
    console.log("From Home!!!")
    console.log(user);

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
          } else {
            // Token is still valid
            console.log("Google login token is still valid");
          }
        } else if (user.signin) {
          token = user.signin.token;
          setcustomtoken(true)
        } else if (user.signup) {
          token = user.signup.token;
          setcustomtoken(true)
        } else {
          token = null;
        }
      } else {
        token = null;
      }
    
      console.log("to check out on expire")
      console.log(token)

      if (customtoken) {
        const decodedToken = decode(token);
  
        if (decodedToken.exp * 1000 < new Date().getTime()) {
          console.log("Custom login token has expired");
          logout();
        }
        console.log("Custom login token is still valid");
      }
  
    },);

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