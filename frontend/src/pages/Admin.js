import React, {useState} from "react";
import { Button } from "../components/AuthForm";
import { useAuth } from "../context/auth";
import axios from 'axios';

/**
 * Functional component for Admin
 * 
 * 
 * @param {*} props 
 */
function Admin(props) {
  const { setAuthTokens } = useAuth();
  const [userInfo, setUserInfo] = useState('');

  /**
   * Log out
   * Query the backend and let the backend know that this user is no longer logged in.  a.k.a invalidate the token
   * Clear local cache of tokens (setAuthTokents())
   */
  function logOut() {
    var existingTokens = null;
    if (localStorage.getItem("tokens") !== 'undefined'){
      existingTokens = JSON.parse(localStorage.getItem("tokens"));
    } else {
      return "Return no token";
    }

    // Clears Tokens and logs you out on the fronend
    setAuthTokens();

    var accessToken = existingTokens['access_token'];
    let config = {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    }

    axios.get( 
      'http://127.0.0.1/api/auth/logout',
      config
    )
    .then( ( result ) => {
      //Not much to do really right now.  Not trying to get to crazy with it.
    }).catch(e => {
      setUserInfo("something went wrong");
    });
  }

  /**
   * Query the endpoint for user information using the logged in users token
   * If successful, print out their name, email, and created at time.
   */
  function getUser(){
    var existingTokens = null;
    if (localStorage.getItem("tokens") !== 'undefined'){
      existingTokens = JSON.parse(localStorage.getItem("tokens"));
    } else {
      return "Return no token";
    }
    
    var accessToken = existingTokens['access_token'];
    let config = {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    }

    axios.get( 
      'http://127.0.0.1/api/auth/me',
      config
    )
    .then( ( result ) => {
      if (result.status === 200) {
        setUserInfo("Name: " + result.data["name"] + " | email: "+result.data["email"] + " | created: "+result.data["created_at"]);
      } else {
        setUserInfo("Non 200 response");
      }
    }).catch(e => {
      setUserInfo("something went wrong");
    });
  
  }

  if(!userInfo){
    getUser();
  }

  var infoSection = "Loading info....";
  if (userInfo){
    infoSection = userInfo;
  }
  return (
    <div>
      <div>Admin Page</div>
      <br></br>
      <p>{infoSection}</p>
      <Button style={{maxWidth: "20%"}} onClick={logOut}>Log out</Button>
    </div>
  );
}

export default Admin;