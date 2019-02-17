import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
    document.getElementById("usernamePrompt").textContent = "";
    document.getElementById("passwordPrompt").textContent = "";
    document.getElementById("confirmPrompt").textContent = "";

    // Grab username and password from field
    var username = document.getElementById("usernameField").value;
    var email = document.getElementById("emailField").value;
    var password = document.getElementById("passwordField").value;
    var confirmPassword = document.getElementById("confirmPasswordField").value;

    console.log('Inputted username (signUpProcedure): ', username);
    console.log('Inputted email (signUpProcedure): ', email);
    console.log('Inputted password (signUpProcedure): ', password);
    console.log('Inputted password #2 (signUpProcedure): ', confirmPassword);


    if (password == confirmPassword) {
      if ((this.verifyUser(username)) == true) {
        console.log('Valid username!');

        if ((this.verifyPass(password)) == true) {
          console.log('Valid password!');

          // Connect with backend to register account
          axios.post('/api/auth/register', {
            'email': email,
            'username': username,
            'password': password
          }).then(res => {
            console.log(res.data);
            document.getElementById("successParagraph").textContent = "Successfully registered an account!";
            document.getElementById("successParagraph").style = "color:green;";
            this.props.history.push('/login');
          })
          .catch((error) => {
            console.log(error.data);
          });
        } else {
          console.log('Invalid password!');
          document.getElementById("passwordPrompt").textContent = "(Invalid password!)";
          document.getElementById("passwordPrompt").style = "color:red;";
        }
      } else {
        console.log('Invalid username!');
        document.getElementById("usernamePrompt").textContent = "(Invalid username!)";
        document.getElementById("usernamePrompt").style = "color:red;";
      }
    } else {
      console.log('Passwords are not the same.');
      document.getElementById("confirmPrompt").textContent = "(Passwords are not the same!)";
        document.getElementById("confirmPrompt").style = "color:red;";
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
        <h2>Login</h2>
        <form>
          <p>Username<p id="usernamePrompt"></p></p>
          <input type="text" name="usernameField" id="usernameField"></input><br></br>
          <p>Password<p id="passwordPrompt"></p></p>
          <input type="password" name="passwordField" id="passwordField"></input><br></br>
          <p>Confirm Password<p id="confirmPrompt"></p></p>
          <input type="password" name="confirmPasswordField" id="confirmPasswordField"></input><br></br>
          <p>Email</p>
          <input type="text" name="emailField" id="emailField"></input><br></br>
        </form>
        <p><button id="signUpButton" onClick={(e) => this.signUpProcedure()}>Sign Up</button><p id="successParagraph"></p></p>
        
        <Link to="/login"><button id="loginButton">Already Have an account? Log In</button></Link>

        <div class="Footer"></div>
          <div class="Flex">
          </div>
        </div>

      </div>
    );
  }
};
