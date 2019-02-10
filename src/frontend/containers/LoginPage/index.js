import React from 'react';
import ReactDOM from 'react-dom';

import GenericNavigationBar from '@/components/GenericNavigationBar';
import './styles.scss';

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
  if(password.getLength == 0){
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

export default class Login extends React.Component {
  render() {
    return (
      <div>
        <GenericNavigationBar/>
        <div class="Content">
        <p>Login component</p>
        </div>
      </div>
    );
  }
};
