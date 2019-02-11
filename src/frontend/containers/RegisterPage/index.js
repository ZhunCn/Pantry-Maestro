import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

import GenericNavigationBar from '@/components/GenericNavigationBar';
import './styles.scss';


export default class Register extends React.Component {
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
    console.log('Inputted password (verifyPass): ', password);

    //check for valid lengths
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
  

  signUpProcedure() {
    // Grab username and password from field
    var username = document.getElementById("usernameField").value;
    var password = document.getElementById("passwordField").value;
    var confirmPassword = document.getElementById("confirmPasswordField").value;

    console.log('Inputted username (loginProcedure): ', username);
    console.log('Inputted password (loginProcedure): ', password);

    if (password == confirmPassword) {
      if ((this.verifyUser(username)) == true) {
        console.log('Valid username!');

        if ((this.verifyPass(password)) == true) {
          console.log('Valid password!');
          // Connect with backend to register account

        } else {
          console.log('Invalid password!');
        }
      } else {
        console.log('Invalid username!');
      }
    } else {
      console.log('Passwords are not the same.');
    }
  }

  
  enterPressedOnPassword() {
    if (event.keyCode === 13) {
      document.getElementById("loginButton").click();
    }
  }

  render() {
    return (
      <div>
        <GenericNavigationBar/>
        <div class="Content">
        <p>Sign Up</p>
        <form>
          <p>Username</p>
          <input type="text" name="usernameField" id="usernameField"></input><br></br>
          <p>Password</p>
          <input type="password" name="passwordField" id="passwordField"></input><br></br>
          <p>Confirm Password</p>
          <input type="password" name="confirmPasswordField" id="confirmPasswordField"></input><br></br>
          <p>Email</p>
          <input type="text" name="emailField" id="emailField"></input><br></br>
        </form>
        <p><button id="signUpButton" onClick={(e) => this.signUpProcedure()}>Sign Up</button></p>
        
        <p><Link to="/login"><button id="loginButton">Already Have an account? Log In</button></Link></p>
        </div>
      </div>
    );
  }
};
