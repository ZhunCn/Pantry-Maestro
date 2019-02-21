import React from 'react';
import ReactDOM from 'react-dom';
import {Link, Redirect} from 'react-router-dom';
import axios from 'axios';

import {authorize} from '@/utils';

import './styles.scss';


export default class Login extends React.Component {
  verifyUser(username) {
    /**
      * Inputted "Username" for login can either be actual Username
      * or email. Check Username requirements first, then
      * email requirements with regex.
      */

    //console.log('Inputted username (verifyUser): ', username);

    //check for valid lengths
    if(username.length == 0){
      return false;
    }

    if(username.length > 32){
      var emailregex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

      //check if username looks like an email
      if(username.match(emailregex) == null){
        return false;
      }
      return true;
    }

    return true;
  }

  verifyPass(password) {
    //console.log('Inputted password (verifyPass): ', password);

    //check for valid lengths
    if(password.length < 6){
      return false;
    }

    if(password.length > 32){
      return false;
    }

    //check that password has letters AND numbers

    //modular regex design
    var letters = /[a-zA-Z]+/;
    var numbers = /[0-9]+/;

    if(password.match(letters) == null || password.match(numbers) == null) {
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
          localStorage.setItem('loginToken', res.data.token);
          document.getElementById("successParagraph").textContent = "Successfully logged in!";
          document.getElementById("successParagraph").style = "color:green;";

          this.props.history.push('/');
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

  }

  enterPressedOnPassword() {
    if (event.keyCode === 13) {
      document.getElementById("loginButton").click();
    }
  }

  handlePasswordChange(event) {
    if (this.verifyPass(event.target.value)) {
      document.getElementById("passwordPrompt").textContent = "";
    }
  }

  handleUsernameChange(event) {
    if (this.verifyUser(event.target.value)) {
      document.getElementById("usernamePrompt").textContent = "";
    }
  }

  render() {
    if (authorize()) {
      return (
        <Redirect to="/"/>
      )
    }

    return (
      <div class="loginPage">
        <div class="Content">
        <center>
          <h2>Login</h2>
          <form>
            <p>Username or Email<p id="usernamePrompt"></p></p>
            <input type="text" name="usernameField" id="usernameField" onChange={(event) => {this.handleUsernameChange(event)}} placeholder="Username"></input><br></br>

            <p>Password<p id="passwordPrompt"></p></p>
            <input type="password" name="passwordField" id="passwordField" onChange={(event) => {this.handlePasswordChange(event)}} onKeyDown={(e) => this.enterPressedOnPassword()} placeholder="Password"></input>
          </form>
          <p><button class="button" id="loginButton" onClick={(e) => this.loginProcedure()}>Log In</button><p id="successParagraph"></p></p>
          <p><Link id="forgotPasswordLink" to="/login/#">Forgot Password?</Link></p>
          <Link to="/register"><button class="button" id="signUpButton">New to Pantry Maestro? Sign Up</button></Link>
        </center>
        <div class="Footer">
          <div class="Flex">
          </div>
        </div>

        </div>
      </div>
    );
  }
};
