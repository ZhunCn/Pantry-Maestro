import React from 'react';
import ReactDOM from 'react-dom';
import GenericNavigationBar from '@/components/GenericNavigationBar';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import { Form, Button } from 'semantic-ui-react'

import './styles.scss';

export default class CheckoutPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      items: ['']
    };
  }

  handleSubmit(e) {
    console.log(e);
  }

  render() {
    return (
      <div class="CheckoutPage">
        <GenericNavigationBar />
        <div class="MainContent">
          <h1>Check Out</h1>
          <h4>What Items Would You Like To Check Out Today?</h4>
          <Form onSubmit={this.handleSubmit}>
            <Form.Field>
              <input placeholder="Item Name" type="text" class="itemName" value={this.state.itemName} onChange={this.handleChange} />
            </Form.Field>
            <Button type="submit">Submit </Button>
          </Form>
        </div>
      </div>
    );
  }
};
