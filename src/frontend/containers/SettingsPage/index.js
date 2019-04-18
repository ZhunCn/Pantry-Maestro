import React from "react";
import ReactDOM from "react-dom";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { authorize } from "@/utils";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GenericNavigationBar from "@/components/GenericNavigationBar";
import "./styles.scss";

//add input checking on Settings similar to Login/Register
function verifyUser(username) {
  console.log("Inputted username (verifyUser): ", username);

  //check for valid lengths
  if (username.length == 0) {
    return false;
  }

  if (username.length > 32) {
    return false;
  }

  return true;
}

function verifyEmail(email) {
  console.log("Inputted email (verifyEmail): ", email);

  //modular regex design
  var emailregex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

  //check if email looks like an email
  if (email.match(emailregex) == null) {
    return false;
  }

  return true;
}

function verifyPass(password) {
  console.log("Inputted password (verifyPass): ", password);

  //check for valid lengths
  if (password.length < 6) {
    return false;
  }

  if (password.length > 32) {
    return false;
  }

  //check that password has letters AND numbers

  //modular regex design
  var letters = /[a-zA-Z]+/;
  var numbers = /[0-9]+/;

  if (password.match(letters) == null || password.match(numbers) == null) {
    return false;
  }

  return true;
}

class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "currentUsername",
      name: "Firstname Lastname",
      email: "email@email.com",
      curVal: this.props.curVal
    };
  }

  refreshData() {
    let userLoginToken = localStorage.getItem("loginToken");
    axios
      .get("/api/account", { headers: { Authorization: `${userLoginToken}` } })
      .then(res => {
        this.setState({
          user: res.data.username,
          email: res.data.email
        });
        console.log(res.data);
      });
  }
  componentDidMount() {
    this.refreshData();
  }

  render() {
    //Popup for username change
    if (this.props.text == "username") {
      return (
        <div className="popup">
          <div className="popup_inner">
            <h1>Change your username</h1>
            <p>Current Username:</p>
            <p>
              <i>{this.props.curVal}</i>
            </p>
            <form>
              <p>New Username:</p>
              <input
                type="text"
                id="usernameInput"
                name="username"
                placeholder="Username"
              />
            </form>
            <button
              onClick={() =>
                this.processUsername(
                  document.getElementById("usernameInput").value
                )
              }
            >
              Save
            </button>
            <button onClick={() => this.props.closePopup()}>
              Discard Changes
            </button>
          </div>
        </div>
      );
    }
    //Popup for email change
    else if (this.props.text == "email") {
      return (
        <div className="popup">
          <div className="popup_inner">
            <h1>Change your email</h1>
            <p>Current Email:</p>
            <p>
              <i>{this.props.curVal}</i>
            </p>
            <form>
              <p>New Email:</p>
              <input
                type="text"
                id="emailInput"
                name="email"
                placeholder="email"
              />
            </form>
            <button
              onClick={() =>
                this.processEmail(document.getElementById("emailInput").value)
              }
            >
              Save
            </button>
            <button onClick={() => this.props.closePopup()}>
              Discard Changes
            </button>
          </div>
        </div>
      );
    }
    //Popup for changing password
    else if (this.props.text == "password") {
      return (
        <div className="popup">
          <div className="popup_inner">
            <h1>Change your Password</h1>
            <form>
              <p>Current password:</p>
              <input
                type="password"
                id="curPasswordInput"
                name="pass1"
                placeholder="Current Password"
              />
              <p>New Password:</p>
              <input
                type="password"
                id="newPasswordInput"
                name="pass2"
                placeholder="New Password"
              />
              <p>Confirm Password:</p>
              <input
                type="password"
                id="confirmPassword"
                name="pass3"
                placeholder="Confirm Password"
              />
            </form>
            <button
              onClick={() =>
                this.processPassword([
                  document.getElementById("curPasswordInput").value,
                  document.getElementById("newPasswordInput").value,
                  document.getElementById("confirmPassword").value
                ])
              }
            >
              Save
            </button>
            <button onClick={() => this.props.closePopup()}>
              Discard Changes
            </button>
          </div>
        </div>
      );
    }
    //Popup for logging out
    else if (this.props.text == "logout") {
      return (
        <div className="popup">
          <div className="popup_inner">
            <h1>Logout</h1>
            <p>Are you sure you want to log out?</p>
            <button onClick={() => this.ret("logout", "logout")}>
              Yes, log out
            </button>
            <button onClick={() => this.props.closePopup()}>
              No, do not log out
            </button>
          </div>
        </div>
      );
    }
  }
  //function to verify username
  processUsername = username => {
    if (username == this.props.curVal) {
      toast("Current and new usernames are the same, username not updated", {
        type: "warning"
      });
      console.log("Username equal");
    } else if (verifyUser(username) === true) {
      this.ret(username, "username");
    } else {
      toast("Invalid username, failed to update username", { type: "error" });
    }
  };
  //function to verify email
  processEmail = email => {
    if (email == this.props.curVal) {
      toast("Current and new emails are the same, email not updated", {
        type: "warning"
      });
      console.log("Email equal");
    } else if (verifyEmail(email) === true) {
      this.ret(email, "email");
    } else {
      toast("Invalid email, failed to update email", { type: "error" });
    }
  };
  //function to verify password
  processPassword = password => {
    const pass1 = password[0];
    const pass2 = password[1];
    const pass3 = password[2];
    if (pass1 === pass2) {
      toast("Current and new passwords are the same, password not updated", {
        type: "warning"
      });
    } else if (pass2 !== pass3) {
      toast("Your passwords do not match, failed to update password", {
        type: "error"
      });
    } else if (verifyPass(pass2) !== true) {
      toast("Invalid password, failed to update password", { type: "error" });
    } else {
      this.ret(password, "password");
    }
  };
  //return function to return fields back to Settings class
  ret = (user, pass) => {
    this.props.closePopup();
    this.props.callBack(user, pass);
  };
}
export default class Settings extends React.Component {
  /*
   * value: the string to control the popup that shows up
   * showPopup: boolean to control when the popup shows up
   */
  constructor() {
    super();
    this.state = {
      value: "",
      showPopup: false,
      user: "currentUsername",
      name: "Firstname Lastname",
      email: "email@email.com"
    };
  }
  //function to log the user out and redirect to the login page
  logoutProcedure() {
    localStorage.removeItem("loginToken");
    sessionStorage.removeItem("shoppingList");
    sessionStorage.removeItem("idList");
    this.props.history.push("/login");
  }
  //function to enable popup when disabled and vice versa
  togglePopup(value) {
    this.setState({
      showPopup: !this.state.showPopup,
      value: value
    });
  }
  changePassProcedure(password) {
    let userLoginToken = localStorage.getItem("loginToken");
    let passwordJson = {
      old_password: password[0],
      new_password: password[1]
    };
    console.log(userLoginToken);
    axios
      .put("/api/account", passwordJson, {
        headers: {
          Authorization: `${userLoginToken}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
      .then(res => {
        toast("Successfully updated password", { type: "success" });
        console.log(res.data);
      })
      .catch(error => {
        toast("Error updating password: Incorrect current password", {
          type: "error"
        });
        console.log(error);
      });
  }
  changeEmailProcedure(email) {
    let userLoginToken = localStorage.getItem("loginToken");
    let emailJson = {
      email: email
    };
    console.log(userLoginToken);
    axios
      .put("/api/account", emailJson, {
        headers: {
          Authorization: `${userLoginToken}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
      .then(res => {
        toast("Successfully updated email", { type: "success" });
        console.log(res.data);
      })
      .catch(error => {
        toast("Failed to update email", { type: "error" });
        console.log(error);
      });
  }
  changeUserProcedure(username) {
    let userLoginToken = localStorage.getItem("loginToken");
    let userJson = {
      username: username
    };
    console.log(userLoginToken);
    axios
      .put("/api/account", userJson, {
        headers: {
          Authorization: `${userLoginToken}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
      .then(res => {
        toast("Successfully updated username", { type: "success" });
        console.log(res.data);
      })
      .catch(error => {
        toast("Failed to update username", { type: "error" });
        console.log(error);
      });
  }
  //callback function to get user input from the popup
  callbackFunction = (data, field) => {
    //Here is where all the data stuff goes.
    //data is the actual user input,
    //field is the name of the aspect the user is trying to change, e.g. "username" or "password"
    if (data == "logout" && field == "logout") {
      this.logoutProcedure();
    } else if (field == "password") {
      this.changePassProcedure(data);
    } else if (field == "email") {
      this.changeEmailProcedure(data);
    } else if (field == "username") {
      this.changeUserProcedure(data);
    }
    this.refreshData();
    console.log(data + " " + field);
    this.props.closePopup;
  };
  refreshData() {
    let userLoginToken = localStorage.getItem("loginToken");
    axios
      .get("/api/account", { headers: { Authorization: `${userLoginToken}` } })
      .then(res => {
        this.setState({
          user: res.data.username,
          email: res.data.email
        });
        console.log(res.data);
      });
  }
  componentDidMount() {
    this.refreshData();
  }

  render() {
    if (!authorize()) {
      return <Redirect to="/login" />;
    }

    return (
      <div class="settingsPage">
        <GenericNavigationBar />
        <div class="MainContent">
          <h2>Settings</h2>
          <div class="Total">
            <div class="col">
              <p>
                <strong>Username: </strong>
                <i>{this.state.user}</i>
              </p>
              <button
                onClick={() => {
                  this.togglePopup("username");
                }}
              >
                Change Username
              </button>
              <p>
                <strong>Email: </strong>
                <i>{this.state.email}</i>
              </p>
              <button
                onClick={() => {
                  this.togglePopup("email");
                }}
              >
                Change Email
              </button>
            </div>
            <div class="col">
              <p>
                <strong>Change Password:</strong>
              </p>
              <button
                onClick={() => {
                  this.togglePopup("password");
                }}
              >
                Change Password
              </button>
              <br />
              <button
                onClick={() => {
                  this.togglePopup("logout");
                }}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
        {this.state.showPopup ? (
          <Popup
            text={this.state.value}
            closePopup={this.togglePopup.bind(this)}
            callBack={this.callbackFunction}
            curVal={
              this.state.value == "email" ? this.state.email : this.state.user
            }
          />
        ) : null}
      </div>
    );
  }
}
