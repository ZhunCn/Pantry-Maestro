import React from 'react';
import './styles.scss';
import { Link } from 'react-router-dom';
import axios from 'axios'

const workspaceID = "5c64def057910030016ba7c1";
export default class AddChangeItemComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
                "name": "",
                "quantities": [{"date":"", "quantity": 0}]
        }
    }   

    addQuantity = (e) => {
        this.setState((prevState) => ({
            quantities: [...prevState.quantities, {"date":"", "quantity": 0}],
        }))
    }

    handleSubmit = (e) => { e.preventDefault() }
 
    handleChange = (e) => {
        if (["date", "quantity"].includes(e.target.className)) {
            let quantities = [...this.state.quantities]
            quantities[e.target.dataset.id][e.target.className] = e.target.value
            this.setState({ quantities }, () => console.log(this.state.quantities))
        } else {
            this.setState({ [e.target.name]: e.target.value })
        }
    }

    render() {
        let {name, quantities} = this.state
        return (
            <div className="AddChangeItemForm">
            <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
                <h2>Add new food items</h2>
                <label htmlFor="name">Name:</label>
                <input type="text" name="name" id="name"/>
                <button onClick={this.addQuantity}>Add expiration date and quantity</button>
                {
                    this.state.quantities.map((val, idx) => {
                        let dateId = `date-${idx}`, quantityId = `quantity-${idx}`;
                        return (
                            <div key={idx}>
                                <label htmlFor={dateId}>{`Expiration #${idx + 1}:  `}</label>
                                <input
                                    type="text"
                                    name={dateId}
                                    data-id={idx}
                                    id={dateId}
                                    className="date"
                                    placeholder="Enter Expiration"
                                />
                                <label htmlFor={quantityId}>Quantity:  </label>
                                <input 
                                    type="number"
                                    name={quantityId}
                                    data-id={idx}
                                    id={quantityId}
                                    className="quantity"
                                    placeholder="Enter Quantity"
                                />
                            </div>
                        )
                    })
                }
                <input type="submit" value="Submit"/>
            </form>
            </div>
        );
    }
};
