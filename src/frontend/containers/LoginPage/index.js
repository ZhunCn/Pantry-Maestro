import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

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


  loginProcedure() {
    document.getElementById("usernamePrompt").textContent = "";
    document.getElementById("passwordPrompt").textContent = "";


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
        axios.post('/api/auth/login', {
          'username': username,
          'password': password
        }).then(res => {
          console.log(res.data);
        })
        .catch(function (error) {
          console.log(res.error);
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
        <p>Log in</p>
        <form>
          <p>Username or Email<p id="usernamePrompt"></p></p>
          <input type="text" name="usernameField" id="usernameField"></input><br></br>

          <p>Password<p id="passwordPrompt"></p></p>
          <input type="password" name="passwordField" id="passwordField" onKeyDown={(e) => this.enterPressedOnPassword()}></input>
        </form>
        <p><button id="loginButton" onClick={(e) => this.loginProcedure()}>Log In</button></p>
        <p><Link id="forgotPasswordLink" to="/login/#">Forgot Password?</Link></p>

        <p><Link to="/register"><button id="signUpButton" >New to Pantry Maestro? Sign Up</button></Link></p>
        </div>
      </div>
    );
  }
};
