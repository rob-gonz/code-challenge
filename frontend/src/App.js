import React, { useState } from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import PrivateRoute from './PrivateRoute';
import {Navbar, Nav, NavItem, NavLink} from 'reactstrap'
// import logo from './logo.svg';
import './App.css';
import Home from './pages/Home';
import Admin from './pages/Admin';
import { AuthContext } from "./context/auth";
import Signup from './pages/Signup';
import  Login from './pages/Login';

function App() {

  var existingTokens = null;

  if (localStorage.getItem("tokens") !== 'undefined'){
    existingTokens = JSON.parse(localStorage.getItem("tokens"));
  }
  const [authTokens, setAuthTokens] = useState(existingTokens);
  
  const setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data);
  }

  return (
    <AuthContext.Provider value={{authTokens, setAuthTokens: setTokens}}>
    <Router>
      <div>
        <Navbar color="light" light expand="md">
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="/">Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/signup">Sign Up</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/login">Login</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/admin">Admin</NavLink>
            </NavItem>
          </Nav>
        </Navbar>
        <br></br>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <PrivateRoute path="/admin" component={Admin} />
      </div>
    </Router>
    </AuthContext.Provider>
  );
}

export default App;
