import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Paper,
  Grid,
  Typography,
  Container,
} from "@material-ui/core";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import Alert from "@mui/material/Alert";

import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

import useStyles from "./styles";
import Input from "./Input";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function Auth() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  console.log("From AUTH!!!");
  console.log(user);

  const [form, setForm] = useState(initialState);

  const [isSignup, setIsSignup] = useState(false);

  const [error, setError] = useState("");

  const history = useNavigate();
  const location = useLocation();
  const classes = useStyles();

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);

  const switchMode = () => {
    //   setForm(initialState);
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false);
  };

  useEffect(() => {
    const token = user?.token;

    console.log("to check out on expire");
    console.log(token);

    // if (token) {
    //   const decodedToken = decode(token);

    //   if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    // }

    setUser(JSON.parse(localStorage.getItem("profile")));
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(form);

    if (isSignup) {
      try {
        //sing up the user
        const response = await fetch("http://localhost:1010/user/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
                  mutation {
                      signup(
                          firstName: "${form.firstName}",
                          lastName: "${form.lastName}",
                          email: "${form.email}",
                          password: "${form.password}"
                          confirmPassword: "${form.confirmPassword}"
                      ) {
                          firstName
                          lastName
                          email
                          token
                      }
                  }
              `,
          }),
        });

        const responseData = await response.json();

        if (response.ok && responseData.data && responseData.data.signup) {
          // Sign-up successful, you can handle the response as needed
          const { signup } = responseData.data;
          console.log("Signin successful");
          console.log(signup);
          // Redirect or perform other actions as needed
          localStorage.setItem("profile", JSON.stringify({ ...signup }));
          history("/");
        } else {
          const errors = responseData.errors.map((error) => error.message);
          console.error("Signup failed:", errors);
          setError(errors);
        }
      } catch (error) {
        console.error("Error occurred during signup:", error);
        setError([error.message]);
      }
    } else {
      try {
        const response = await fetch("http://localhost:1010/user/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
                  query {
                      signin(
                          email: "${form.email}",
                          password: "${form.password}"
                      ) {
                          firstName
                          lastName
                          email
                          token
                      }
                  }
              `,
          }),
        });

        const responseData = await response.json();

        if (response.ok && responseData.data && responseData.data.signin) {
          const { signin } = responseData.data;
          console.log("Signin successful");
          console.log(signin);
          // Redirect or perform other actions as needed
          localStorage.setItem("profile", JSON.stringify({ ...signin }));
          history("/");
        } else {
          const errors = responseData.errors.map((error) => error.message);
          console.error("Signin failed:", errors);
          setError(errors);
        }
      } catch (error) {
        console.error("Error occurred during signin:", error);
        setError([error.message]);
      }
    }
  };

  const googleSuccess = async (res) => {
    // console.log(res)
    const token = res?.clientId;
    const result = res?.credential;
    // console.log(result)

    //Send token and result to a back end for processing
    try {
      const dataToSend = {
        clientId: token,
        credential: result,
      };

      // Send the data to your backend using fetch
      const response = await fetch("http://localhost:1010/google-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // You may need to include authentication headers if required
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        // Successfully sent data to the backend
        console.log("Response!!!!->>>");
        const responseData = await response.json();

        //Incase I want to make objects
        // const result = {
        //     email: responseData.email,
        //     family_name: responseData.family_name
        //     given_name: responseData.given_name,
        //     userId: responseData.sub
        //     imageUrl: responseData.picture
        //     name: responseData.name
        // };

        localStorage.setItem(
          "profile",
          JSON.stringify({ ...responseData?.payload })
        );
        history("/");
      } else {
        // Handle errors from the backend
        console.error("Failed to send data to the backend");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const googleError = (e) => {
    console.log(e);
    alert("Google Sign In was unsuccessful. Try again later");
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  // const handleChange = (e) => {};

  return (
    <>
      <div>
        {/* ... Your other UI components */}
        {error && (
          <Alert severity="error">
            {Array.isArray(error) ? (
              <ul>
                {error.map((errorMessage, index) => (
                  <li key={index}>{errorMessage}</li>
                ))}
              </ul>
            ) : (
              error
            )}
          </Alert>
        )}
      </div>
      <Container component="main" maxWidth="xs">
        <Paper className={classes.paper} elevation={3}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {isSignup ? "Sign up" : "Sign in"}
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {isSignup && (
                <>
                  <Input
                    name="firstName"
                    label="First Name"
                    handleChange={handleChange}
                    autoFocus
                    half
                  />
                  <Input
                    name="lastName"
                    label="Last Name"
                    handleChange={handleChange}
                    half
                  />
                </>
              )}
              <Input
                name="email"
                label="Email Address"
                handleChange={handleChange}
                type="email"
              />
              <Input
                name="password"
                label="Password"
                handleChange={handleChange}
                type={showPassword ? "text" : "password"}
                handleShowPassword={handleShowPassword}
              />
              {isSignup && (
                <Input
                  name="confirmPassword"
                  label="Repeat Password"
                  handleChange={handleChange}
                  type="password"
                />
              )}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {isSignup ? "Sign Up" : "Sign In"}
            </Button>
            <GoogleLogin
              onSuccess={googleSuccess}
              onFailure={googleError}
              cookiePolicy="single_host_origin"
            />
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Button onClick={switchMode}>
                  {isSignup
                    ? "Already have an account? Sign in"
                    : "Don't have an account? Sign Up"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </>
  );
}

export default Auth;
