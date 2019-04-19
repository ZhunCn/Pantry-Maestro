import React from 'react';
import { Button, Grid, List } from "semantic-ui-react";
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
      {items.sort((a, b) => this.sortFunc(a, b)).map((item, i) => this.listItem(item))}
      </List>;
  }

  sortFunc(a, b){
    var x = a[0].toLowerCase();
    var y = b[0].toLowerCase();
    if (x < y) {return -1;}
    if (x > y) {return 1;}
    return 0;
  }

  listItem(value) {
    var name = value[0];
    return (
      <List.Item onClick={e => {this.method()}}>
        <List.Content floated='right'>
          <Button negative size="small" onClick={e => {this.method()}}>
            Remove
          </Button>
        </List.Content>
        <List.Content>
          <h3>{name}</h3>
        </List.Content>
      </List.Item>
    );
  }

  method(){
    console.log("button pressed");
  }

  render() {
    return (
      <div>
        {(!this.props.items) ? (
          <h3>Create a new shoppingList</h3>
        ) : (
          this.createList(this.props.items)
        )}
      </div>
    );
  }
};
