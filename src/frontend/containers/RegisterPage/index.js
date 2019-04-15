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

const initialState = {
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
  usernameError: false,
  passwordError: false,
  confirmPasswordError: false,
  passwordMatchError: false,
  emailError: false,
  createUserError: false
};
export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.onInputChange = this.onInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // verifyUser(username) {
  //   //console.log('Inputted username (verifyUser): ', username);

  //   //check for valid lengths
  //   if (username.length == 0 || username.length > 32) {
  //     this.setState({ usernameError: true });
  //     toast("Invalid username! Usernames must be less than 32 characters in length", { type: "error" });
  //     return;
  //   } else {
  //     this.setState({ usernameError: false });
  //   }
  // }

  // verifyPass(password) {
  //   // console.log('Inputted password (verifyPass): ', password);
  //   //check for valid lengths
  //   if (password.length <= 6) {
  //     this.setState({ passwordError: true })
  //     toast("Invalid password! Make sure your password contains at least 1 number and is longer than 6 characters", { type: "error" });
  //     return;
  //   }
  //   //check that password has letters AND numbers
  //   //modular regex design
  //   let letters = /[a-zA-Z]+/;
  //   let numbers = /[0-9]+/;

  //   if (password.match(letters) == null || password.match(numbers) == null) {
  //     this.setState({ passwordError: true })
  //     toast("Invalid password! Make sure your password contains at least 1 number and is longer than 6 characters", { type: "error" });
  //     return;
  //   }

  //   this.setState({ passwordError: false })
  // }

  // verifyEmail(email) {
  //   //console.log('Inputted email (verifyEmail): ', email);

  //   //modular regex design
  //   let emailregex = RegExp("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}");

  //   console.log(emailregex.test(email));
  //   //check if email looks like an email
  //   if (!emailregex.test(email)) {
  //     this.setState({ emailError: true })
  //     toast("Invalid email", { type: "error" });
  //     return;
  //   } else {
  //     this.setState({ emailError: false });
  //   }
  // }

  handleSubmit = e => {
    e.preventDefault();
    let error = false;

    // Grab username and password from field
    let username = this.state.username;
    let email = this.state.email;
    let password = this.state.password;
    let confirmPassword = this.state.confirmPassword;

    console.log("Inputted username (signUpProcedure): ", username);
    console.log("Inputted email (signUpProcedure): ", email);
    console.log("Inputted password (signUpProcedure): ", password);
    console.log("Inputted password #2 (signUpProcedure): ", confirmPassword);

    // this.verifyUser(this.state.username);
    if (username.length == 0 || username.length > 32) {
      this.setState({ usernameError: true });
      toast(
        "Invalid username! Usernames must be less than 32 characters in length",
        { type: "error" }
      );
      return;
    } else {
      this.setState({ usernameError: false });
    }

    // this.verifyPass(this.state.password);
    if (password.length <= 6) {
      this.setState({ passwordError: true });
      toast(
        "Invalid password! Make sure your password contains at least 1 number and is longer than 6 characters",
        { type: "error" }
      );
      return;
    }
    //check that password has letters AND numbers
    //modular regex design
    let letters = /[a-zA-Z]+/;
    let numbers = /[0-9]+/;

    if (password.match(letters) == null || password.match(numbers) == null) {
      this.setState({ passwordError: true });
      toast(
        "Invalid password! Make sure your password contains at least 1 number and is longer than 6 characters",
        { type: "error" }
      );
      return;
    }

    this.setState({ passwordError: false });

    // this.verifyEmail(this.state.email);
    let emailregex = RegExp("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}");

    //check if email looks like an email
    if (!emailregex.test(email)) {
      this.setState({ emailError: true });
      toast("Invalid email", { type: "error" });
      return;
    } else {
      this.setState({ emailError: false });
    }
    console.log("after:");
    console.log(this.state);
    if (password == confirmPassword) {
      if (!this.state.emailError) {
        console.log("Valid email!");
        if (!this.state.usernameError) {
          console.log("Valid username!");
          if (!this.state.passwordError) {
            console.log("Valid password!");
            // Connect with backend to register account
            axios
              .post("/api/auth/register", {
                email: email,
                username: username,
                password: password
              })
              .then(res => {
                console.log(res.data);
                this.props.history.push("/login");
              })
              .catch(error => {
                console.log(error.data);
              });
          } else {
            console.log(
              "Invalid password! Make sure your password contains at least 1 number and is longer than 6 characters"
            );
          }
        } else {
          console.log(
            "Invalid username! Usernames must be less than 32 characters in length"
          );
        }
      } else {
        console.log("Invalid email!");
      }
    } else {
      console.log("Passwords do not match, check again");
      toast("Passwords do not match, check again", { type: "error" });
      this.setState({ passwordMatchError: true });
    }
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
      <div className="registerPage">
        <Grid
          textAlign="center"
          style={{ height: "100%" }}
          verticalAlign="middle"
          className="middle aligned"
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            <img textAlign="center" src={logo} class="ui medium centered image"/>

            <Header as="h2" color="black" textAlign="center">
              Register for a new account
            </Header>
            <Form
              size="large"
              onSubmit={e => {
                this.handleSubmit(e);
              }}
              error={this.state.createUserError}
            >
              <Segment stacked>
                <Form.Field>
                  <label>Username</label>
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
                </Form.Field>
                <Form.Field>
                  <label>Password</label>
                  <Form.Input
                    name="password"
                    fluid
                    icon="lock"
                    iconPosition="left"
                    placeholder="Password"
                    type="password"
                    value={this.state.password}
                    onChange={this.onInputChange}
                    error={
                      this.state.passwordError || this.state.passwordMatchError
                    }
                  />
                </Form.Field>
                <Form.Field>
                  <label>Confirm Password</label>
                  <Form.Input
                    name="confirmPassword"
                    fluid
                    icon="lock"
                    iconPosition="left"
                    placeholder="Confirm Password"
                    type="password"
                    value={this.state.confirmPassword}
                    onChange={this.onInputChange}
                    error={
                      this.state.confirmPasswordError ||
                      this.state.passwordMatchError
                    }
                  />
                </Form.Field>
                <Form.Field>
                  <label>Email</label>
                  <Form.Input
                    name="email"
                    fluid
                    icon="mail"
                    iconPosition="left"
                    placeholder="Email"
                    value={this.state.email}
                    onChange={this.onInputChange}
                    error={this.state.emailError}
                  />
                </Form.Field>
                <Form.Button
                  fluid
                  size="large"
                  type="submit"
                  disabled={
                    !this.state.username ||
                    !this.state.password ||
                    !this.state.confirmPassword ||
                    !this.state.email
                  }
                >
                  Sign Up
                </Form.Button>
              </Segment>
            </Form>
            <Message>
              <Link to="/login">
                <Button id="loginButton">
                  Already Have an account? Log In
                </Button>
              </Link>
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
