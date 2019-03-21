import React from 'react';
import ReactDOM from 'react-dom';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { authorize } from '@/utils';

import './styles.scss';


export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      usernameError: false,
      passwordError: false
    }
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

    //check for valid lengths
    if (username.length == 0 || username.length > 32) {
      this.setState({ usernameError: true });
      toast("Invalid username! Usernames must be less than 32 characters in length", { type: "error" });
      return;
    } else {
      this.setState({ usernameError: false });
    }
  }

  verifyPass(password) {
    //console.log('Inputted password (verifyPass): ', password);

    //check for valid lengths
    if (password.length <= 6) {
      this.setState({ passwordError: true })
      // toast("Invalid password! Make sure your password contains at least 1 number and is longer than 6 characters", { type: "error" });
      return;
    }
    //check that password has letters AND numbers
    //modular regex design
    let letters = /[a-zA-Z]+/;
    let numbers = /[0-9]+/;

    if (password.match(letters) == null || password.match(numbers) == null) {
      this.setState({ passwordError: true })
      // toast("Invalid password! Make sure your password contains at least 1 number and is longer than 6 characters", { type: "error" });
      return;
    }

    this.setState({ passwordError: false })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // document.getElementById("usernamePrompt").textContent = "";
    // document.getElementById("passwordPrompt").textContent = "";


    // Grab username and password from field
    console.log('Inputted username (loginProcedure): ', this.state.username);
    console.log('Inputted password (loginProcedure): ', this.state.password);
    console.log("Possible token: \"" + this.props.match.params.inviteToken +"\"");

    this.verifyUser(this.state.username);
    this.verifyPass(this.state.password);


    if (!this.state.usernameError) {
      console.log('Valid username!');

      if (!this.state.passwordError) {
        console.log('Valid password!');

        // Connect with backend to verify login information is correct
        axios.post('/api/auth/login', {
          'username': this.state.username,
          'password': this.state.password
        }).then(res => {
          console.log(res.data);
          if (res.data.error) {
            this.setState({ passwordError: true });
            this.setState({ usernameError: true });
            toast("Username/Password is incorrect. Please try again.", { type: "error" });
          } else {
            localStorage.setItem('loginToken', res.data.token);

            if (this.props.match.params.inviteToken) {
              this.props.history.push('/join/' + this.props.match.params.inviteToken);

            } else {
              this.props.history.push('/inventory');
            }
          }
        }).catch((error) => {
          console.log(error);
          this.setState({ passwordError: true });
          this.setState({ usernameError: true });
          toast("Username/Password is incorrect. Please try again.", { type: "error" });
        });
      } else {
        console.log('Invalid password!');
      }
    } else {
      console.log('Invalid username!');
    }

  }


  onInputChange(event) {
    console.log(event);
    this.state.setState
    this.setState({ [event.target.name]: event.target.value })
  }

  render() {
    if (authorize()) {
      return (
        <Redirect to="/" />
      )
    }

    return (
      <div className='login-form'>
        <ToastContainer autoClose={3000} />
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle' className='middle aligned'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' color='black' textAlign='center'>
              Log in to your account
              </Header>
            <Form size='large' onSubmit={(e) => { this.handleSubmit(e) }}>
              <Segment stacked>
                <Form.Input
                  name="username"
                  fluid icon='user'
                  iconPosition='left'
                  placeholder='Username'
                  value={this.state.username}
                  onChange={this.onInputChange}
                  error={this.state.usernameError} />
                <Form.Input
                  name="password"
                  fluid icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  type='password'
                  value={this.state.password}
                  onChange={this.onInputChange}
                  error={this.state.passwordError} />
                <Form.Button fluid size='large' type='submit' disabled={!this.state.username || !this.state.password}>
                  Login
                </Form.Button>
              </Segment>
            </Form>
            <Message>
              <Link to="/register"><Button id="signUpButton">New to Pantry Maestro? Sign Up</Button></Link>
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
};
