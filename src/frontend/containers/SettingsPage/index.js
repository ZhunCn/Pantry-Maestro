import React from "react";
import ReactDOM from "react-dom";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { authorize } from "@/utils";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GenericNavigationBar from "@/components/GenericNavigationBar";
import "./styles.scss";
import { Button, Modal, Icon, Input, Form, FormInput } from 'semantic-ui-react'


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
      email: "email@email.com",
      userInput: "",
      emailInput: "",
      currPassInput: "",
      passInput1: "",
      passInput2: "",
      open1: false,
      open2: false,
      open3: false,
      open4: false,
      change: false
    };
  }
  closeAll = () => {
    this.setState({
      open1: false,
      open2: false,
      open3: false,
      open4: false,
      userInput: "",
      emailInput: "",
      currPassInput: "",
      passInput1: "",
      passInput2: "",
    });
    if (this.state.change) {
      this.setState({ change: false });
      this.refreshData();
    }
  };
  open1 = () => {
    this.setState({ open1: true });
  };
  open2 = () => {
    this.setState({ open2: true });
  };
  open3 = () => {
    this.setState({ open3: true });
  };
  open4 = () => {
    this.setState({ open4: true });
  };

  handleTextChange = (e, { name, value }) => this.setState({ [name]: value })
  
   //function to verify username
   processUsername = username => {
    if (username == this.props.curVal) {
      toast("Current and new usernames are the same, username not updated", {
        type: "warning"
      });
      console.log("Username equal");
    } else if (verifyUser(username) === true) {
      this.setState({ change: true });
      this.callbackFunction(username, "username");
      this.closeAll();

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
      this.setState({ change: true });
      this.callbackFunction(email, "email");
      this.closeAll();
    } else {
      toast("Invalid email, failed to update email", { type: "error" });
    }
  };
  //function to verify password
  processPassword = password => {
    console.log(password);
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
      this.setState({ change: true });
      this.callbackFunction(password, "password");
      this.closeAll();
    }
    
  };

  //function to log the user out and redirect to the login page
  logoutProcedure() {
    localStorage.removeItem("loginToken");
    //remove shopping cart
    sessionStorage.removeItem("shoppingList");
    sessionStorage.removeItem("idList");
    sessionStorage.removeItem("expList");
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

    const { value, showPopup, user, name, email, userInput, emailInput, currPassInput,
      passInput1, passInput2, open1, open2, open3, open4, change } = this.state

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
              <Button
                onClick={this.open1}
              >
                Change Username
              </Button>
              <br /><br />

              <p>
                <strong>Email: </strong>
                <i>{this.state.email}</i>
              </p>
              <Button
                onClick={this.open2}

              >
                Change Email
              </Button>
            </div>
            <div class="col">
              <p>
                <strong>Change Password:</strong>
              </p>
              <Button
               onClick={this.open3}
              >
                Change Password
              </Button>
              

              <br /><br />
              <Button
                onClick={this.open4}
              >
                Log out
              </Button>
            </div>
          </div>
        </div>
        <Modal
          open={this.state.open1}
          onOpen={this.open1}
          onClose={this.closeAll}
          size="small"
          closeIcon
        >
        <Modal.Header>Change your username</Modal.Header>
        <Modal.Content>
        <div className="popup">
          <div className="popup_inner">
            

            <Form>
              <Form.Group>
              <Form.Field>
                <label>Current Username:</label>
                <p>
              <i>{this.state.user}</i>
            </p>
              </Form.Field>
            
              </Form.Group>
              <Form.Group>
                <Form.Input label='New Username:' placeholder='Username' name='userInput' value={userInput} onChange={this.handleTextChange} />
              
              </Form.Group>
            </Form>
            
            </div>
        </div>
        </Modal.Content>
        <Modal.Actions>
            <Button color='green'
              onClick={() =>
                this.processUsername(
                  this.state.userInput
                )
              }
            >
              <Icon name='checkmark' /> Save
            </Button>
            <Button color='red' onClick={this.closeAll}>
            <Icon name='remove' />   Discard Changes
            </Button>
            </Modal.Actions>
        </Modal>
        <Modal
          open={this.state.open2}
          onOpen={this.open2}
          onClose={this.closeAll}
          size="small"
          closeIcon
          >
          <Modal.Header>Change your email</Modal.Header>

          <Modal.Content>
          <div className="popup">
          <div className="popup_inner">


          <Form>
              <Form.Group>
              <Form.Field>
                <label>Current Email:</label>
                <p>
              <i>{this.state.email}</i>
            </p>
              </Form.Field>
            
              </Form.Group>
              <Form.Group>
                <Form.Input label='New Email:' placeholder='example@email.com' name='emailInput' value={emailInput} onChange={this.handleTextChange} />
              
              </Form.Group>
            </Form>
          
          </div>
        </div>
          </Modal.Content>
          <Modal.Actions>
          <Button color='green'
              onClick={() =>
                this.processEmail(this.state.emailInput)
              }
            >
             <Icon name='checkmark' /> Save
            </Button>
            <Button color='red' onClick={this.closeAll}>
            <Icon name='remove' />  Discard Changes
            </Button>
          </Modal.Actions>
          </Modal>
          <Modal
          open={this.state.open3}
          onOpen={this.open3}
          onClose={this.closeAll}
          size="small"
          closeIcon
          >
          <Modal.Header>Change your password</Modal.Header>

          <Modal.Content>
          <div className="popup">
          <div className="popup_inner">

          <Form>
              
              <Form.Group>
                <Form.Input label='Current Password:' type='password' placeholder='Current Password' name='currPassInput' value={currPassInput} onChange={this.handleTextChange} />
              
              </Form.Group>

              <Form.Group>
                <Form.Input label='New Password:' type='password' placeholder='New Password' name='passInput1' value={passInput1} onChange={this.handleTextChange} />
              
              </Form.Group>

              <Form.Group>
                <Form.Input label='Confirm Password:' type='password' placeholder='Confirm Password' name='passInput2' value={passInput2} onChange={this.handleTextChange} />
              
              </Form.Group>
            </Form>
          </div>
        </div>
          </Modal.Content>
          <Modal.Actions>
          <Button color='green'
              onClick={() =>
                this.processPassword([
                  this.state.currPassInput,
                  this.state.passInput1,
                  this.state.passInput2
                ])
              }
            >
             <Icon name='checkmark' /> Save
            </Button>
            <Button color='red' onClick={this.closeAll}>
            <Icon name='remove' />  Discard Changes
            </Button>
          </Modal.Actions>
          </Modal>
          <Modal
          open={this.state.open4}
          onOpen={this.open4}
          onClose={this.closeAll}
          size="small"
          closeIcon
          >
          <Modal.Header>Log out</Modal.Header>

          <Modal.Content>
          <div className="popup">
          <div className="popup_inner">
            <p>Are you sure you want to log out?</p>
          </div>
        </div>
          </Modal.Content>
          <Modal.Actions>
          <Button color='green' onClick={() => this.callbackFunction("logout", "logout")}>
            <Icon name='checkmark' />  Yes, log out
            </Button>
            <Button color='red' onClick={this.closeAll}>
            <Icon name='remove' /> No, do not log out
            </Button>
            </Modal.Actions>
          </Modal>
      </div>
    );
  }
}
