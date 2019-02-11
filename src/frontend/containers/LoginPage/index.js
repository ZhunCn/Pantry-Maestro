import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

import GenericNavigationBar from '@/components/GenericNavigationBar';
import './styles.scss';

let validUser = function verifyUser(username){
  //check for valid lengths
  if(username.getLength == 0){
    return false;
  }
  
  if(username.getLength > 32){
    return false;
  }

  return true;
}

let validPass = function verifyPass(password){
  //check for valid lengths
  if(password.getLength == 0){
    return false;
  }
  
  if(password.getLength > 32){
    return false;
  }
  
  //check that password has letters AND numbers

  //modular regex design
  var letters = /^[a-zA-Z]+$/;
  var numbers = /^[0-9]+$/;

  if(!password.value.match(letters) || !password.value.match(numbers)){
    return false;
  }

  return true;
}

export default class Login extends React.Component {
  render() {
    return (
      <div>
        <GenericNavigationBar/>
        <div class="Content">
        <p>Log in</p>
        
        <p>Username or Email</p>
        <input type="text" name="username"></input><br></br>
        
        <p>Password</p>
        <input type="text" name="password"></input><br></br>
        
        <p><button id="loginButton">Log In</button></p>

        <p><Link id="forgotPasswordLink" to="/login/#">Forgot Password?</Link></p>
        
        <p><button id="signUpButton" to="/login/#" >New to Pantry Maestro? Sign Up</button></p>
        </div>
      </div>
    );
  }
};
