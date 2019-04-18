import React from 'react';
import './styles.scss';

export default class AddShoppingListComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shoppingList: this.props.items,
      curWorkspace: "",
      curID: ""
    };
  }

  createList(items) {
    return [];//<List selection verticalAlign='middle' style={{"margin-right": 10}}>{items.sort((a, b) => this.sortFunc(a, b)).map((item, i) => this.listItem(item))}</List>;
  }

  render() {
    return (

    );
  }
};
