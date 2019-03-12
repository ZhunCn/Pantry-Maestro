import React from 'react';
import './styles.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

let workspaceID = localStorage.getItem("currWorkspaceID");
export default class AddChangeItemComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "name": "",
            "quantities": [{ "date": "", "quantity": undefined }]
        }
        this.handleChange = this.handleChange.bind(this);
    }

    addQuantity = (e) => {
        e.preventDefault();

        this.setState((prevState) => ({
            quantities: [...prevState.quantities, { "date": "", "quantity": undefined }],
        }))
    }

    handleSubmit = (e) => {
        e.preventDefault();

        let emptyFlag = true;

        let parsedData = {
            "name": this.state.name,
            "quantities": {}
        };
        if (this.state.name === "") {
            toast("Enter a name!",
                { type: "warning" });
            return;
        }
        for (let i = 0; i < this.state.quantities.length; i++) {
            console.log(this.state.quantities[i].date);
            if (this.state.quantities[i].date.toString() === "" || this.state.quantities[i].date.toString() === "Invalid Date") {
                if ((this.state.quantities[i].quantity !== 0 || this.state.quantities[i].quantity !== "") && Object.entries(parsedData.quantities).length === 0) {
                    toast("One or more date field(s) is/are empty",
                        { type: "error" });
                    return;
                }
            } else {
                let quantity = parseInt(this.state.quantities[i].quantity);
                let parsedDate = new Date(this.state.quantities[i].date).toLocaleDateString();
                parsedData.quantities[parsedDate] = isNaN(quantity) ? 0 : quantity;
                emptyFlag = false;
            }
        }
        if (!emptyFlag) {
            console.log(parsedData);
            workspaceID = localStorage.getItem("currWorkspaceID");
            axios.post(`/api/workspaces/${workspaceID}/inventory`, parsedData).then(res => {
                // HTTP status 200 OK
                if (res.status === 200) {
                    toast("Item has been successfully added to the database", { type: "success" });
                }
                console.log(res.data);
                this.props.fetchData();
            }).catch(error => {
                if (error.response.data.error === "Item with this name already exists") {
                    let itemID = error.response.data.item_id;
                    console.log(itemID);
                    axios.put(`/api/workspaces/${workspaceID}/inventory/${itemID}`, { "quantities": parsedData.quantities }).then(res => {
                        // HTTP status 200 OK
                        if (res.status === 200) {
                            console.log("updated quantity");
                            this.props.fetchData();
                        }
                    }).catch(error => {
                        console.log(error);
                        toast(`An error has occurred. ${error}`, { type: "error" });
                    })
                } else {
                    toast(`An error has occurred. ${error}`, { type: "error" });
                }

            })
        }
    };

    handleChange = (e) => {
        e.preventDefault();
        if (["quantity"].includes(e.target.className)) {
            let newQuantity;
            newQuantity = e.target.value < 0 ? 0 : e.target.value;

            let quantities = [...this.state.quantities]
            quantities[e.target.dataset.id][e.target.className] = newQuantity;
            this.setState({ quantities }, () => console.log(this.state.quantities))
        } else {
            this.setState({ [e.target.name]: e.target.value })
        }
    }

    handleCalendarChange(date, idx) {
        console.log(this.state.quantities[idx].date)
        let quantities = [...this.state.quantities]
        quantities[idx].date = date;
        this.setState({ quantities }, () => console.log(this.state.quantities))
    }

    render() {
        let { name, quantities } = this.state;
        return (
            <div class="AddChangeItemForm">
                <ToastContainer autoClose={3000} />
                <form>
                    <h2>Add new food items</h2>
                    <label htmlFor="name">Name:</label>
                    <input type="text" name="name" id="name" value={name} onChange={this.handleChange} />
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
                                        selected={quantities[idx].date}
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
                                        onChange={(e) => { this.handleChange(e) }}
                                        value={quantities[idx].quantity}
                                        min="0"
                                        step="1"
                                    />
                                </div>
                            )
                        })
                    }
                    <input class="button submitButton" type="button" value="Submit" onClick={this.handleSubmit} />
                </form>

            </div>

        );
    }
};
