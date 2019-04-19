import React from 'react';
import ReactDOM from 'react-dom';
import GenericNavigationBar from '@/components/GenericNavigationBar';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import { Form, Button } from 'semantic-ui-react';
import AddShoppingListComponent from '@/components/AddShoppingListComponent';

import './styles.scss';

export default class CheckoutPage extends React.Component {

  constructor(props) {
    super(props);
    let valsl = sessionStorage.getItem("shoppingList");
    let valsid = sessionStorage.getItem("idList");
    let valsexp = sessionStorage.getItem("expList");
    let idList = valsid.split(",");
    let shoppingList = valsl.split(",");
    let expList = valsexp.split(",");
    console.log("list:");
    console.log([
      shoppingList,
      idList,
      expList
    ]);
    let sc = this.transposeArray([
      shoppingList,
      idList,
      expList
    ], expList.length);
    console.log(sc);
    this.state = {
      shoppingCart: sc,
      // [
      //   sessionStorage.getItem("shoppingList").split(","),
      //   sessionStorage.getItem("idList").split(","),
      //   sessionStorage.getItem("expList").split(",")
      // ],
      userID: '',
      items: ['']
    };
  }

  transposeArray(array, arrayLength){
      var newArray = [];
      for(var i = 0; i < arrayLength; i++){
          newArray.push([]);
      };

      for(var i = 0; i < array.length; i++){
          for(var j = 0; j < arrayLength; j++){
              newArray[j].push(array[i][j]);
          };
      };

      return newArray;
  }

  handleCheckout(e) {
    console.log(e);
    //clears shopping cart under the assumption that the customer took all the
    //items and does not want to remove more items
    sessionStorage.setItem("shoppingList", "");
    sessionStorage.setItem("idList", "");
    sessionStorage.setItem("expList", "");
  }

  render() {
    return (
      <div class="CheckoutPage">
        <GenericNavigationBar />
        <div class="MainContent">
          <h1>Check Out</h1>
          <h3>Would You Like To Remove Any Items From Your Cart Today?</h3>
          <div class="CheckoutUiButton">
            <Button class="UiButton" size='big' positive onClick={e => {this.handleCheckout();}}>
              Check Out
            </Button>
          </div>
          <AddShoppingListComponent items={this.state.shoppingCart}/>
        </div>
      </div>
    );
  }
};
