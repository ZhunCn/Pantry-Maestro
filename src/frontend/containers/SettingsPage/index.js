import React from 'react';
import ReactDOM from 'react-dom';

import GenericNavigationBar from '@/components/GenericNavigationBar';
import './styles.scss';

//add input checking on Settings similar to Login/Register
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
  if(password.getLength == 6){
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
class Popup extends React.Component {
  render() {
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
          <button onClick={()=>this.ret(document.getElementById("usernameInput").value, "username")}>Save</button>
          <button onClick={()=>this.props.closePopup()}>Discard Changes</button>
          </div>
        </div>
      );
    }
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
          <button onClick={()=>this.ret([document.getElementById("firstnameInput").value, document.getElementById("lastnameInput").value], "name")}>Save</button>
          <button onClick={()=>this.props.closePopup()}>Discard Changes</button>
          </div>
        </div>
      );
    }
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
          <button onClick={()=>this.ret(document.getElementById("emailInput").value, "email")}>Save</button>
          <button onClick={()=>this.props.closePopup()}>Discard Changes</button>
          </div>
        </div>
      );
    }
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
    else if(this.props.text=="password"){
      return (
        <div className='popup'>
          <div className='popup_inner'>
            <h1>Change your Password</h1>
            <form>
            <p>Current password:</p>
            <input type="text" id="curPasswordInput" name="pass1" placeholder="Current Password"/>
            <p>New Password:</p>
            <input type="text" id="newPasswordInput" name="pass2" placeholder="New Password"/>
            <p>Confirm Password:</p>
            <input type="text" id="confirmPassword" name="pass3" placeholder="Confirm Password"/>
            </form>
          <button onClick={()=>this.ret([document.getElementById("curPasswordInput").value, document.getElementById("newPasswordInput").value, document.getElementById("confirmPassword").value], "password")}>Save</button>
          <button onClick={()=>this.props.closePopup()}>Discard Changes</button>
          </div>
        </div>
      );
    }
  }
  ret = (user, pass) =>{
    this.props.closePopup();
    this.props.callBack(user, pass);
  }
}
export default class Settings extends React.Component {
  constructor() {
    super();
    this.state = {
      value:"",
      showPopup: false
    };
  }
  togglePopup(value) {
    this.setState({
      showPopup: !this.state.showPopup,
      value: value
    });
  }
  callbackFunction = (data, field) =>{
    //Here is where all the data stuff goes.
    //data is the actual user input,
    //whereas field is the name of the aspect the user is trying to change, e.g. "username" or "password"
    console.log(data+" "+field);
    this.props.closePopup;
  }
  render() {
    const user = "currentUsername";
    const name = "Firstname" + " " + "Lastname";
    const email = "email@email.com";
    const curWorkspace = "currentWorkspace";
    return (
      <div>
        <GenericNavigationBar/>
        <div class="Content">
        <h2>Settings</h2>
	       <div class="Total">
	        <div class="col">
            <p><strong>Username: </strong><i>{user}</i></p>
            <button onClick={() => {this.togglePopup("username")}}>Change Username</button>
            <p><strong>Name: </strong><i>{name}</i></p>
            <button onClick={() => {this.togglePopup("name")}}>Change Name</button>
            <p><strong>Email: </strong><i>{email}</i></p>
            <button onClick={() => {this.togglePopup("email")}}>Change Email</button>
	        </div>
	        <div class="col">
            <p><strong>Workspace Information: </strong></p>
		        <p><i>{curWorkspace}</i></p>
  			    <button onClick={() => {this.togglePopup("leave")}}>Leave Workspace</button>
			      <p><strong>Change Password:</strong></p>
            <button onClick={() => {this.togglePopup("password")}}>Change Password</button>
            <button onClick={() => {this.logoutProcedure()}}>Log out</button>
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
