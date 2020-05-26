import React, { useState } from "react";
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
// import logoImg from "../img/logo.jpg";
import { Card, Form, Input, Button, Error} from '../components/AuthForm';
import { useAuth } from "../context/auth";


function Signup() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const { setAuthTokens } = useAuth();

  function postSignup() {
    axios.post("http://127.0.0.1/api/auth/register", {
      "name": name,
      "email": email,
      "password": password,
      "confirmPassword": passwordConfirm,
    }).then(result => {
      if (result.status === 200) {
        console.log(result.data)
        setAuthTokens(result.data);
        setLoggedIn(true);
      } else {
        console.log(result.data);
        setErrorMessage(result.data["error"]);
        setIsError(true);
      }
    }).catch(e => {
      console.log(e);
      setErrorMessage("An error occurred. Make sure you are using a new account");
      setIsError(true);
    });
  }

  if (isLoggedIn) {
    return <Redirect to="/admin" />;
  }

  return (
    <Card>
      {/* <Logo src={logoImg} /> */}
      <h3>Sign Up</h3>
      <Form>
      <Input 
        type="text" 
        value={name}
        onChange={e => {
          setName(e.target.value);
        }}
        placeholder="full name" />
        <Input 
        type="email" 
        value={email}
        onChange={e => {
          setEmail(e.target.value);
        }}
        placeholder="email" />
        <Input 
        type="password" 
        value={password}
        onChange={e => {
          setPassword(e.target.value);
        }}
        placeholder="password" />
        <Input 
        type="password" 
        value={passwordConfirm}
        onChange={e => {
          setPasswordConfirm(e.target.value);
        }}
        placeholder="password again" />
        <Button onClick={postSignup}>Sign Up</Button>
      </Form>
      <Link to="/login">Already have an account?</Link>
      { isError && <Error>{errorMessage}</Error> }
    </Card>
  );
}

export default Signup;