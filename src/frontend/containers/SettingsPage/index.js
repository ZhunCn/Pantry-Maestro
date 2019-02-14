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

export default class Settings extends React.Component {
  render() {
    return (
      <div>
        <GenericNavigationBar/>
        <div class="Content">
        <h2>Settings</h2>
	       <div class="Total">
	        <div class="Left">
		        <form>
			         <p>First name:</p>
  			          <input type="text" name="firstname"/>
			         <p>Last name:</p>
  			          <input type="text" name="lastname"/>
			         <p>Username:</p>
  			          <input type="text" name="username"/>
			         <p>Change email:</p>
  			          <input type="text" name="email"/>
			         <p>Workspace Information:</p>
		           <p><i>Workspace Info Here</i></p>
  			       <button>Leave Workspace</button>
		        </form>
	        </div>
	        <div class="Right">
		        <form>
			         <p><strong>Change Password:</strong></p>
			         <p>Current Password:</p>
  			          <input type="text" name="firstname"/>
			         <p>New Password</p>
  			          <input type="text" name="lastname"/>
		           <p>Confirm Password</p>
  			       <input type="text" name="username"/>
               <button>Change Password</button>
		        </form>
          </div>
	    </div>
      <div class="Footer">
      <div class="flex">
		  <button class="Save">Save</button>
		  <button class="Discard">Discard</button>
	     </div>
       </div>
        </div>
      </div>
    );
  }
};
