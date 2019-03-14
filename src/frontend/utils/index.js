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
  if (!localStorage.getItem('loginToken')) {
    return false;
  }

  return true;
}

export {sum, authorize};
