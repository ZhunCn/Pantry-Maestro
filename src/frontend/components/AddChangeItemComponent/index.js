import React from 'react';
import './styles.scss';
import { Link } from 'react-router-dom';
import axios from 'axios'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

const workspaceID = "5c64def057910030016ba7c1";
export default class AddChangeItemComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
                "name": "",
                "quantities": [{"date":"", "quantity": 0}]
        }
        this.handleChange = this.handleChange.bind(this);
    }   

    addQuantity = (e) => {
        e.preventDefault();

        this.setState((prevState) => ({
            quantities: [...prevState.quantities, {"date":"", "quantity": 0}],
        }))
    }

    // parseData(unparsedData) {
    //     // "name": "Starburst",
    //     // "quantities": {
    //     //     "01/01/2019": 12,
    //     //     "02/13/2020": 23,
    //     //     "12/22/2019": 5
    //     // }
    //     let parsedData = {
    //         "name": unparsedData.name,
    //         "quantities": {}
    //     }
    //     for (let i = 0; i < unparsedData.quantities.length; i++) {
    //         parsedData.quantities[unparsedData.quantities[i].date] = parseInt(unparsedData.quantities[i].quantity);
    //     }
    //     console.log(parsedData);
    //     return parsedData;

    // }

    handleSubmit = (e) => { 
        e.preventDefault();

        let parsedData = {
            "name": this.state.name,
            "quantities": {}
        }
        for (let i = 0; i < this.state.quantities.length; i++) {
            if (this.state.quantities[i].date != "") { 
                parsedData.quantities[this.state.quantities[i].date] = parseInt(this.state.quantities[i].quantity);
            }
        }
        console.log(parsedData);
        axios.post(`/api/workspaces/${workspaceID}/inventory`, parsedData).then(res => {
            console.log(res.data);
        })
    }


   
 
    handleChange = (e) => {
        e.preventDefault();

        if (["date", "quantity"].includes(e.target.className)) {
            let quantities = [...this.state.quantities]
            quantities[e.target.dataset.id][e.target.className] = e.target.value
            this.setState({ quantities }, () => console.log(this.state.quantities))
        } else {
            this.setState({ [e.target.name]: e.target.value })
        }
    }

    // calendarHandleChange(date) {
    //     let quantities = [...this.state.quantities]
    //     quantities[date.id][date.className] = date.value
    // }

    render() {
        let {name, quantities} = this.state
        return (
            <div className="AddChangeItemForm">
            <form onChange={this.handleChange}>
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
                <input type="button" value="Submit" onClick={this.handleSubmit}/>
            </form>
            </div>
        );
    }
};
