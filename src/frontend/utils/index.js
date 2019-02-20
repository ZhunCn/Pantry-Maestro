import React from 'react';
import ReactDOM from 'react-dom';
import {Redirect} from 'react-router-dom';

function sum(arr) {
  let sum = 0;

  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }

  return sum;
}

function authorize() {
  console.log('Authorizing');

  if (!localStorage.getItem('loginToken')) {
    console.log('Redirecting');
    return false;
  }

  return true;
}

export {sum, authorize};
