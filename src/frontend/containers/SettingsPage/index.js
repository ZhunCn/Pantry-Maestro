import React from 'react';
import ReactDOM from 'react-dom';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import {authorize} from '@/utils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GenericNavigationBar from '@/components/GenericNavigationBar';
import './styles.scss';

//add input checking on Settings similar to Login/Register
function verifyUser(username){
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

function verifyEmail(email) {
  console.log('Inputted email (verifyEmail): ', email);

  //modular regex design
  var emailregex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

  //check if email looks like an email
  if(email.match(emailregex) == null){
    return false;
  }

  return true;
}

function verifyPass(password){
  console.log('Inputted password (verifyPass): ', password);

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

class Popup extends React.Component {
  render() {
    //Popup for username change
    if(this.props.text=="username"){
      return (
        <div className='popup'>
          <div className='popup_inner'>
            <h1>Change your username</h1>
            <p>Current Username:</p>
            <p><i>username here</i></p>
            <form>
            <p>New Username:</p>
            <input type="text" id="usernameInput" name="username" placeholder="Username"/>
            </form>
          <button onClick={()=>this.processUsername(document.getElementById("usernameInput").value)}>Save</button>
          <button onClick={()=>this.props.closePopup()}>Discard Changes</button>
          </div>
        </div>
      );
    }
    //Popup for name change
    else if(this.props.text=="name"){
      return (
        <div className='popup'>
          <div className='popup_inner'>
            <h1>Change your name</h1>
            <p>Current name:</p>
            <p><i>name here</i></p>
            <form>
            <p>First Name:</p>
            <input type="text" id="firstnameInput" name="firstname" placeholder="First name"/>
            <p>Last Name:</p>
            <input type="text" id="lastnameInput" name="lastname" placeholder="Last name"/>
            </form>
          <button onClick={()=>this.processName([document.getElementById("firstnameInput").value, document.getElementById("lastnameInput").value])}>Save</button>
          <button onClick={()=>this.props.closePopup()}>Discard Changes</button>
          </div>
        </div>
      );
    }
    //Popup for email change
    else if(this.props.text=="email"){
      return (
        <div className='popup'>
          <div className='popup_inner'>
            <h1>Change your email</h1>
            <p>Current Email:</p>
            <p><i>email here</i></p>
            <form>
            <p>New Email:</p>
            <input type="text" id="emailInput" name="email" placeholder="email"/>
            </form>
          <button onClick={()=>this.processEmail(document.getElementById("emailInput").value)}>Save</button>
          <button onClick={()=>this.props.closePopup()}>Discard Changes</button>
          </div>
        </div>
      );
    }
    //Popup for leaving workspace
    else if(this.props.text=="leave"){
      return (
        <div className='popup'>
          <div className='popup_inner'>
            <h1>Leave the Workspace</h1>
            <p>Workspace:</p>
            <p><i>workspace here</i><br /></p>
            <p>Are you sure you want to leave this workspace?</p>
          <button onClick={()=>this.ret("leave", "leave")}>Yes, leave this workspace</button>
          <button onClick={()=>this.props.closePopup()}>No, don't leave this workspace</button>
          </div>
        </div>
      );
    }
    //Popup for changing password
    else if(this.props.text=="password"){
      return (
        <div className='popup'>
          <div className='popup_inner'>
            <h1>Change your Password</h1>
            <form>
            <p>Current password:</p>
            <input type="text" id="curPasswordInput" name="pass1" placeholder="Current Password"/>
            <p>New Password:</p>
            <input type="password" id="newPasswordInput" name="pass2" placeholder="New Password"/>
            <p>Confirm Password:</p>
            <input type="password" id="confirmPassword" name="pass3" placeholder="Confirm Password"/>
            </form>
          <button onClick={()=>this.processPassword([document.getElementById("curPasswordInput").value, document.getElementById("newPasswordInput").value, document.getElementById("confirmPassword").value])}>Save</button>
          <button onClick={()=>this.props.closePopup()}>Discard Changes</button>
          </div>
        </div>
      );
    }
    //Popup for logging out
    else if(this.props.text=="logout"){
      return (
        <div className='popup'>
          <div className='popup_inner'>
            <h1>Logout</h1>
            <p>Are you sure you want to log out?</p>
          <button onClick={()=>this.ret("logout", "logout")}>Yes, log out</button>
          <button onClick={()=>this.props.closePopup()}>No, do not log out</button>
          </div>
        </div>
      );
    }
  }
  //function to verify username
  processUsername = (username) =>{
    if(verifyUser(username)===true){
      this.ret(username, "username");
    }
    else{
      console.log("invalid");
    }
  }
  //function to verify name
  processName = (name) =>{
    const first=name[0];
    const last=name[1];
    if(verifyUser(first)===true&&verifyUser(last)===true){
      this.ret(name, "name");
    }
    else{
      console.log("invalid");
    }
  }
  //function to verify email
  processEmail = (email) =>{
    if(verifyEmail(email)===true){
      this.ret(email, "email");
    }
    else{
      console.log("invalid");
    }
  }
  //function to verify password
  processPassword = (password) =>{
    const pass1=password[0];
    const pass2=password[1];
    const pass3=password[2];
    if(pass2!==pass3){
      console.log("passwords do not match");
    }
    else if(verifyPass(pass2)!==true){
      console.log("invalid password");
    }
    else{
      this.ret(password, "password");
    }
  }
  //return function to return fields back to Settings class
  ret = (user, pass) =>{
    this.props.closePopup();
    this.props.callBack(user, pass);
  }
}
export default class Settings extends React.Component {
  /*
  * value: the string to control the popup that shows up
  * showPopup: boolean to control when the popup shows up
  */
  constructor() {
    super();
    this.state = {
      value:"",
      showPopup: false,
      user: "currentUsername",
      name: "Firstname Lastname",
      email: "email@email.com",
      curWorkspace: "currentWorkspace"
    };
  }
  //function to log the user out and redirect to the login page
  logoutProcedure(){
    localStorage.removeItem('loginToken');
    this.props.history.push('/login');
    console.log("Logged out");
  }
  //function to enable popup when disabled and vice versa
  togglePopup(value) {
    this.setState({
      showPopup: !this.state.showPopup,
      value: value
    });
  }
  changePassProcedure(password){
    let userLoginToken = localStorage.getItem("loginToken");
    let passwordJson = {
      "old_password": password[0],
      "new_password": password[1]
    }
    console.log(userLoginToken);
    axios.put("/api/account",
      passwordJson,
    { headers: { "Authorization": `${userLoginToken}`,
      'Accept' : 'application/json',
      'Content-Type': 'application/json' }
    }).then(res => {
        toast("Successfully updated password", {type: "success"})
        console.log(res.data);
    }).catch(error => {
      toast("Failed to update password", {type: "error"})
      console.log(error);
    })
  }
  changeEmailProcedure(email){
    let userLoginToken = localStorage.getItem("loginToken");
    let emailJson = {
      "email": email
    }
    console.log(userLoginToken);
    axios.put("/api/account",
      emailJson,
    { headers: { "Authorization": `${userLoginToken}`,
      'Accept' : 'application/json',
      'Content-Type': 'application/json' }
    }).then(res => {
        toast("Successfully updated email", {type: "success"})
        console.log(res.data);
    }).catch(error => {
      toast("Failed to update email", {type: "error"})
      console.log(error);
    })
  }
  changeUserProcedure(username){
    let userLoginToken = localStorage.getItem("loginToken");
    let userJson = {
      "username": username
    }
    console.log(userLoginToken);
    axios.put("/api/account",
      userJson,
    { headers: { "Authorization": `${userLoginToken}`,
      'Accept' : 'application/json',
      'Content-Type': 'application/json' }
    }).then(res => {
        toast("Successfully updated email", {type: "success"})
        console.log(res.data);
    }).catch(error => {
      toast("Failed to update email", {type: "error"})
      console.log(error);
    })
  }
  //callback function to get user input from the popup
  callbackFunction = (data, field) =>{
    //Here is where all the data stuff goes.
    //data is the actual user input,
    //field is the name of the aspect the user is trying to change, e.g. "username" or "password"
    if(data == "logout" && field =="logout"){
      this.logoutProcedure();
    }
    else if(field =="password"){
      this.changePassProcedure(data);
    }
    else if(field =="email"){
      this.changeEmailProcedure(data);
    }
    else if(field == "username"){
      this.changeUserProcedure(data);
    }
    this.refreshData();
    console.log(data+" "+field);
    this.props.closePopup;
  }
  refreshData(){
    let userLoginToken = localStorage.getItem("loginToken");
    axios.get("/api/account", { headers: { "Authorization" : `${userLoginToken}` } }).then(res => {
        this.setState({
          user: res.data.username,
          email: res.data.email
        });
        console.log(res.data);
    });
  }
  componentDidMount(){
    this.refreshData();
  }

  render() {
    if (!authorize()) {
      return (
        <Redirect to="/login"/>
      );
    }

    return (
      <div class="settingsPage">
      <ToastContainer/>
        <GenericNavigationBar/>
        <div class="Content">
        <h2>Settings</h2>
	       <div class="Total">
	        <div class="col">
            <p><strong>Username: </strong><i>{this.state.user}</i></p>
            <button onClick={() => {this.togglePopup("username")}}>Change Username</button>
            <p><strong>Name: </strong><i>{this.state.name}</i></p>
            <button onClick={() => {this.togglePopup("name")}}>Change Name</button>
            <p><strong>Email: </strong><i>{this.state.email}</i></p>
            <button onClick={() => {this.togglePopup("email")}}>Change Email</button>
	        </div>
	        <div class="col">
            <p><strong>Workspace Information: </strong></p>
		        <p><i>{this.state.curWorkspace}</i></p>
  			    <button onClick={() => {this.togglePopup("leave")}}>Leave Workspace</button>
			      <p><strong>Change Password:</strong></p>
            <button onClick={() => {this.togglePopup("password")}}>Change Password</button><br />
            <button onClick={() => {this.togglePopup("logout")}}>Log out</button>
          </div>
	    </div>
      </div>
      {this.state.showPopup ?
      <Popup
        text={this.state.value}
        closePopup={this.togglePopup.bind(this)}
        callBack={this.callbackFunction}
      />
      : null
      }
      </div>
    );
  }
};
