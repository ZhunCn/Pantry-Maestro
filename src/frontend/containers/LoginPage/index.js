import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

import GenericNavigationBar from '@/components/GenericNavigationBar';
import './styles.scss';


export default class Login extends React.Component {
  verifyUser(username) {
    
    console.log('Inputted username (verifyUser): ', username);

    //check for valid lengths
    if(username.length == 0){
      return false;
    }
    
    if(username.length > 32){
      return false;
    }
  
    return true;
  }
  
  verifyPass(password) {
    //check for valid lengths
    console.log('Inputted password (verifyPass): ', password);

    if(password.length == 0){
      return false;
    }
    
    if(password.length > 32){
      return false;
    }
    
    //check that password has letters AND numbers
  
    //modular regex design
    var letters = /^[a-zA-Z]+$/;
    var numbers = /^[0-9]+$/;
  
    if(password.match(letters) != null || password.match(numbers) != null){
      return false;
    }
  
    return true;
  }
  

  loginProcedure() {
    // Grab username and password from field
    var username = document.getElementById("usernameField").value;
    var password = document.getElementById("passwordField").value;
    console.log('Inputted username (loginProcedure): ', username);
    console.log('Inputted password (loginProcedure): ', password);

    if ((this.verifyUser(username)) == true) {
      console.log('Valid username!');

      if ((this.verifyPass(password)) == true) {
        console.log('Valid password!');
        // Connect with backend to verify login information is correct
      } else {
        console.log('Invalid password!');
      }
    } else {
      console.log('Invalid username!');
    }

  }

  render() {
    return (
      <div>
        <GenericNavigationBar/>
        <div class="Content">
        <p>Log in</p>
        
        <p>Username or Email</p>
        <input type="text" name="usernameField" id="usernameField"></input><br></br>
        
        <p>Password</p>
        <input type="text" name="passwordField" id="passwordField"></input><br></br>
        <p><button id="loginButton" onClick={(e) => this.loginProcedure()}>Log In</button></p>
        <p><Link id="forgotPasswordLink" to="/login/#">Forgot Password?</Link></p>
        
        <p><button id="signUpButton" to="/login/#" >New to Pantry Maestro? Sign Up</button></p>
        </div>
      </div>
    );
  }
};
