import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from 'axios';
// import logoImg from "../img/logo.jpg";
import { Card, Form, Input, Button, Error } from "../components/AuthForm";
import { useAuth } from "../context/auth";

/**
 * Functional component for Login.
 * 
 * Set states for use on login page.  
 * @param {*} props 
 */
function Login(props) {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthTokens } = useAuth();
//   const referer = props.location.state.referer || '/';

  /**
   * Log the user in and set the tokens
   * 
   */
  function postLogin() {
    axios.post("http://127.0.0.1/api/auth/login", {
      "email": userName,
      "password": password
    }).then(result => {
      if (result.status === 200) {
        setAuthTokens(result.data);
        setLoggedIn(true);
      } else {
        setIsError(true);
      }
    }).catch(e => {
      setIsError(true);
    });
  }

  if (isLoggedIn) {
    return <Redirect to="/admin" />;
  }

  return (
    <Card>
      <h3>Log In</h3>
      <Form>
        <Input
          type="username"
          value={userName}
          onChange={e => {
            setUserName(e.target.value);
          }}
          placeholder="email"
        />
        <Input
          type="password"
          value={password}
          onChange={e => {
            setPassword(e.target.value);
          }}
          placeholder="password"
        />
        <Button onClick={postLogin}>Sign In</Button>
      </Form>
      <Link to="/signup">Don't have an account?</Link>
        { isError &&<Error>The username or password provided were incorrect!</Error> }
    </Card>
  );
}

export default Login;