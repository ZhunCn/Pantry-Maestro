import React from 'react';
import ReactDOM from 'react-dom';
import GenericNavigationBar from '@/components/GenericNavigationBar';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";

import './styles.scss';

export default class Workspace extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      items: ['']
    };
  }

  render() {
    return (
      <div class="CheckoutPage">
        <GenericNavigationBar/>
        <div class="Content">
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>

        <h1>Check Out</h1>
        <h4>What Items Would You Like To Check Out Today?</h4>

        </div>
      </div>
    );
  }
};
