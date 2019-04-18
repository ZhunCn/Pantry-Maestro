import React from "react";
import ReactDOM from "react-dom";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment
} from "semantic-ui-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authorize } from "@/utils";
import logo from '@/assets/PantryMaestroLogo.png'

import "./styles.scss";
import { PromiseProvider } from "mongoose";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      usernameError: false,
      passwordError: false
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.verifyUser = this.verifyUser.bind(this);
    this.verifyPass = this.verifyPass.bind(this);
  }

  verifyUser(username) {
    /**
     * Inputted "Username" for login can either be actual Username
     * or email. Check Username requirements first, then
     * email requirements with regex.
     */

    //console.log('Inputted username (verifyUser): ', username);
    return new Promise(resolve => {
      //check for valid lengths
      if (username.length > 32) {
        toast(
          "Invalid username! Usernames must be less than 32 characters in length",
          { type: "error" }
        );
        this.setState({ usernameError: true }, resolve);
      } else if (username.length == 0) {
        toast("Please enter a username!", { type: "error" });
        this.setState({ usernameError: true }, resolve);
      } else {
        this.setState({ usernameError: false }, resolve);
      }
    });
  }

  verifyPass(password) {
    //console.log('Inputted password (verifyPass): ', password);
    return new Promise(resolve => {
      //check for valid lengths
      if (password.length <= 6) {
        this.setState({ passwordError: true });
        toast(
          "Invalid password! Make sure your password contains at least 1 number and is longer than 6 characters",
          { type: "error" }
        );
      } else {
        //check that password has letters AND numbers
        //modular regex design
        let letters = /[a-zA-Z]+/;
        let numbers = /[0-9]+/;

        if (
          password.match(letters) == null ||
          password.match(numbers) == null
        ) {
          this.setState({ passwordError: true }, resolve);
          toast(
            "Invalid password! Make sure your password contains at least 1 number and is longer than 6 characters",
            { type: "error" }
          );
        } else {
          this.setState({ passwordError: false }, resolve);
        }
      }
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    // document.getElementById("usernamePrompt").textContent = "";
    // document.getElementById("passwordPrompt").textContent = "";

    // Grab username and password from field
    console.log("Inputted username (loginProcedure): ", this.state.username);
    console.log("Inputted password (loginProcedure): ", this.state.password);
    console.log(
      'Possible token: "' + this.props.match.params.inviteToken + '"'
    );

    this.verifyUser(this.state.username).then(
      this.verifyPass(this.state.password).then(() => {
        if (!this.state.usernameError) {
          console.log("Valid username!");

          if (!this.state.passwordError) {
            console.log("Valid password!");

            // Connect with backend to verify login information is correct
            axios
              .post("/api/auth/login", {
                username: this.state.username,
                password: this.state.password
              })
              .then(res => {
                console.log(res.data);
                if (res.data.error) {
                  this.setState({ passwordError: true });
                  this.setState({ usernameError: true });
                  toast("Username/Password is incorrect. Please try again.", {
                    type: "error"
                  });
                } else {
                  localStorage.setItem("loginToken", res.data.token);
                  //two concurrent lists
                  //one for item ids
                  // other for item names
                  let shoppingList = [];
                  let idList = [];
                  sessionStorage.setItem("shoppingList", shoppingList.toString());
                  sessionStorage.setItem("idList", idList.toString());
                  // console.log(sessionStorage.getItem("shoppingList"));
                  // console.log(shoppingList.toString());

                  if (this.props.match.params.inviteToken) {
                    this.props.history.push(
                      "/join/" + this.props.match.params.inviteToken
                    );
                  } else {
                    this.props.history.push("/inventory");
                  }
                }
              })
              .catch(error => {
                console.log(error);
                this.setState({ passwordError: true });
                this.setState({ usernameError: true });
                toast("Username/Password is incorrect. Please try again.", {
                  type: "error"
                });
              });
          } else {
            console.log("Invalid password!");
          }
        } else {
          console.log("Invalid username!");
        }
      })
    );
  };

  onInputChange(event) {
    console.log(event);
    this.state.setState;
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    if (authorize()) {
      return <Redirect to="/" />;
    }

    return (
      <div className="login-form">
        <Grid
          textAlign="center"
          style={{ height: "100%" }}
          verticalAlign="middle"
          className="middle aligned"
        >

          <Grid.Column style={{ maxWidth: 450 }}>
          <img textAlign="center" src={logo} class="ui medium centered image"/>
            <Header as="h2" color="black" textAlign="center">
              Log in to your account
            </Header>
            <Form
              size="large"
              onSubmit={e => {
                this.handleSubmit(e);
              }}
            >
              <Segment stacked>
                <Form.Input
                  name="username"
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Username"
                  value={this.state.username}
                  onChange={this.onInputChange}
                  error={this.state.usernameError}
                />
                <Form.Input
                  name="password"
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                  value={this.state.password}
                  onChange={this.onInputChange}
                  error={this.state.passwordError}
                />
                <Form.Button
                  fluid
                  size="large"
                  type="submit"
                  disabled={!this.state.username || !this.state.password}
                >
                  Login
                </Form.Button>
              </Segment>
            </Form>
            <Message>
              <Link to="/register">
                <Button id="signUpButton">
                  New to Pantry Maestro? Sign Up
                </Button>
              </Link>
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
