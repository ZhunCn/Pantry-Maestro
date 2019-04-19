import React from 'react';
import { Button, Grid, List, Icon } from "semantic-ui-react";
import axios from "axios";
import './styles.scss';

export default class AddShoppingListComponent extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.items);
    this.state = {
      shoppingList: this.props.items,
      curWorkspace: "",
      curID: ""
    };
  }

  createList(items) {
    return <List divided animated selection verticalAlign='middle' style={{"margin-right": 10}}>
      {items.sort((a, b) => this.sortFunc(a, b)).map((item, i) => this.listItem(items, i, item))}
      </List>;
  }

  sortFunc(a, b){
    var x = a[0].toLowerCase();
    var y = b[0].toLowerCase();
    if (x < y) {return -1;}
    if (x > y) {return 1;}
    return 0;
  }

  listItem(warray, i, value) {
    var name = value[0];
    return (
      <List.Item>
        <List.Content floated='right'>
          <Button animated negative size="small" onClick={e => {this.remove(warray, i, value, value[1],value[2])}}>
          <Button.Content visible>
            <Icon style={{ marginLeft: "5px" }} name="trash" />
          </Button.Content>
          <Button.Content hidden>
            <Icon style={{ marginLeft: "5px" }} name="delete" />
          </Button.Content>
          </Button>
        </List.Content>
        <List.Content>
          <h3>{name}</h3>
        </List.Content>
      </List.Item>
    );
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

  remove(warray, i, value, id, exp){
    let updown = 1;
    console.log("remove pressed");
    let userLoginToken = localStorage.getItem("loginToken");
    // JSON to send to server with the associated expiration date and +1/-1 quantity
    let updatedQuantity = {
      quantities: {
        [exp]: updown
      }
    };
    let workspaceID = localStorage.getItem("currWorkspaceID");
    let itemID = id;
    axios
      .put(
        `/api/workspaces/${workspaceID}/inventory/${itemID}`,
        updatedQuantity,
        { headers: { Authorization: `${userLoginToken}` } }
      )
      .then(res => {
        // HTTP status 200 OK
        if (res.status === 200) {
          console.log("updated cart");
        }
        //remove item from cart and reset items in sessionStorage
        warray.splice(i, 1);
        console.log(warray);
        if(warray.length!=0){
          let narray = this.transposeArray(warray, warray[0].length);
          let vals = narray[1].toString();
          sessionStorage.setItem("idList", vals);
          let vall = narray[0].toString();
          sessionStorage.setItem("shoppingList", vall);
          let vale = narray[2].toString();
          sessionStorage.setItem("expList", vale);
        } else {
          sessionStorage.setItem("shoppingList", "");
          sessionStorage.setItem("idList", "");
          sessionStorage.setItem("expList", "");
        }
        this.setState({state: this.state});
        // window.location.reload();
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        {(!this.props.items||!this.props.items[0]||!this.props.items[0][0]||this.props.items[0][0]=="") ? (
          <h3>Create a new shoppingList</h3>
        ) : (
          this.createList(this.props.items)
        )}
      </div>
    );
  }
};
