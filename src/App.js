import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container } from '@material-ui/core';

import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import { GoogleOAuthProvider } from '@react-oauth/google';



function App() {

  const clientId = process.env.REACT_APP_CLIENT_ID;

  return (
    <BrowserRouter>
    <Container maxWidth="lg">
    <GoogleOAuthProvider clientId={clientId}>
      <Routes>
        {/* Will render based on if user is logged in  */}
        <Route path="/" exact element={<Home />} />
        <Route path="/auth" exact element={<Auth />} />
      </Routes>
      </GoogleOAuthProvider>
    </Container>
  </BrowserRouter>    
  );
}

export default App;
