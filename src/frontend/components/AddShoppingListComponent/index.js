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
    return <ul>{items.map((item, i) => this.listItem(item))}</ul>;
  }

  render() {
    return (

    );
  }
};
