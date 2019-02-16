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

    handleSubmit = (e) => {
        e.preventDefault();

        let parsedData = {
            "name": this.state.name,
            "quantities": {}
        };
        for (let i = 0; i < this.state.quantities.length; i++) {
            console.log(this.state.quantities[i].date);
            if (this.state.quantities[i].date.toString() === "" || this.state.quantities[i].date.toString() === "Invalid Date") {
                alert("One or more date field(s) is/are empty");
                return;
            }
            let parsedDate = new Date(this.state.quantities[i].date).toLocaleDateString();
            parsedData.quantities[parsedDate] = parseInt(this.state.quantities[i].quantity);
        }
        console.log(parsedData);
        axios.post(`/api/workspaces/${workspaceID}/inventory`, parsedData).then(res => {
            // HTTP status 200 OK
            if (res.status === 200) {
                alert("Item has been successfully added to the database");
            }
            console.log(res.data);
        }).catch(error => {
            if (error.response.data.error === "Item with this name already exists") {
                alert(`${this.state.name} already exists. Rename the item or edit ${this.state.name} directly instead`);
            } else {
                alert(`An error has occurred. ${error}`);
            }

        })
    };
 
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

    handleCalendarChange(date, idx) {
        console.log(this.state.quantities[idx].date)
        let quantities = [...this.state.quantities]
        quantities[idx].date = date;
        this.setState({quantities}, () => console.log(this.state.quantities))
    }

    render() {
        let {name, quantities} = this.state;
        return (
            <div class="AddChangeItemForm">
            <form onChange={this.handleChange}>
                <h2>Add new food items</h2>
                <label htmlFor="name">Name:</label>
                <input type="text" name="name" id="name"/>
                <button class="button addQuantityButton" onClick={this.addQuantity}>Click me to add more expiration dates/quantities!</button>
                {
                    this.state.quantities.map((val, idx) => {
                        const { startDate } = this.state.quantities[idx].date;
                        let dateId = `date-${idx}`, quantityId = `quantity-${idx}`;
                        return (
                            <div key={idx} class="dateQuantityInputs">
                                <label class="expirationLabel" htmlFor={dateId}>{`Expiration #${idx + 1}:  `}</label>
                                <DatePicker  
                                    onChange={(date) => this.handleCalendarChange(date, idx)}
                                    selected={this.state.quantities[idx].date}
                                    name={dateId}
                                    className="date"
                                    class="date"
                                    id={dateId}
                                    placeholderText="Click to select a date"
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                />
                                <label class="quantityLabel" htmlFor={quantityId}>Quantity:  </label>
                                <input 
                                    type="number"
                                    name={quantityId}
                                    data-id={idx}
                                    id={quantityId}
                                    className="quantity"
                                    placeholder="Enter Quantity"
                                    class="quantity"
                                />
                            </div>
                        )
                    })
                }
                <input class="button submitButton" type="button" value="Submit" onClick={this.handleSubmit}/>
            </form>
            </div>
        );
    }
};
