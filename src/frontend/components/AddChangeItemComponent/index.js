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
        }
        for (let i = 0; i < this.state.quantities.length; i++) {
            let parsedDate = new Date(this.state.quantities[i].date).toLocaleDateString();
            if (parsedDate != "" || parsedDate === "Invalid Date") { 
                parsedData.quantities[parsedDate] = parseInt(this.state.quantities[i].quantity);
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

    handleCalendarChange(date, idx) {
        console.log(this.state.quantities[idx].date)
        let quantities = [...this.state.quantities]
        quantities[idx].date = date;
        this.setState({quantities}, () => console.log(this.state.quantities))
    }

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
                        const { startDate } = this.state.quantities[idx].date;
                        let dateId = `date-${idx}`, quantityId = `quantity-${idx}`;
                        return (
                            <div key={idx}>
                                <label htmlFor={dateId}>{`Expiration #${idx + 1}:  `}</label>

                                <DatePicker  
                                    onChange={(date) => this.handleCalendarChange(date, idx)}
                                    selected={this.state.quantities[idx].date}
                                    name={dateId}
                                    className="date"
                                    id={dateId}
                                    placeholderText="Click to select a date"
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
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
