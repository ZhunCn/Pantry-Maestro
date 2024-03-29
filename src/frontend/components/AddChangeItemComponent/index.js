import React from "react";
import "./styles.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Form, Input, Search } from "semantic-ui-react";

let workspaceID = localStorage.getItem("currWorkspaceID");
export default class AddChangeItemComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      quantities: [{ date: "", quantity: undefined }],
      inputValue: "",
      nameInputIsLoading: false,
      nameInputResults: [],
      namesOfFood: []
    };
    this.handleChange = this.handleChange.bind(this);
  }

  addQuantity = e => {
    e.preventDefault();

    this.setState(prevState => ({
      quantities: [...prevState.quantities, { date: "", quantity: undefined }]
    }));
  };

  handleSubmit = e => {
    e.preventDefault();

    let emptyFlag = true;

    let parsedData = {
      name: this.state.name,
      quantities: {}
    };
    if (this.state.name === "") {
      toast("Enter a name!", { type: "warning" });
      return;
    }
    for (let i = 0; i < this.state.quantities.length; i++) {
      if (
        this.state.quantities[i].date.toString() === "" ||
        this.state.quantities[i].date.toString() === "Invalid Date"
      ) {
        if (
          (this.state.quantities[i].quantity !== 0 ||
            this.state.quantities[i].quantity !== "") &&
          Object.entries(parsedData.quantities).length === 0
        ) {
          toast("One or more date field(s) is/are empty", {
            type: "error"
          });
          return;
        }
      } else {
        let quantity = parseInt(this.state.quantities[i].quantity);
        let parsedDate = new Date(
          this.state.quantities[i].date
        ).toLocaleDateString();
        parsedData.quantities[parsedDate] = isNaN(quantity) ? 0 : quantity;
        emptyFlag = false;
      }
    }
    if (!emptyFlag) {
      workspaceID = localStorage.getItem("currWorkspaceID");
      let userLoginToken = localStorage.getItem("loginToken");
      axios
        .post(`/api/workspaces/${workspaceID}/inventory`, parsedData, {
          headers: { Authorization: `${userLoginToken}` }
        })
        .then(res => {
          // HTTP status 200 OK
          if (res.status === 200) {
            toast("Item has been successfully added to the database", {
              type: "success"
            });
          }
          this.props.fetchData();
        })
        .catch(error => {
          if (
            error.response.data.error === "Item with this name already exists"
          ) {
            let itemID = error.response.data.item_id;
            let userLoginToken = localStorage.getItem("loginToken");
            axios
              .put(
                `/api/workspaces/${workspaceID}/inventory/${itemID}`,
                { quantities: parsedData.quantities },
                { headers: { Authorization: `${userLoginToken}` } }
              )
              .then(res => {
                // HTTP status 200 OK
                if (res.status === 200) {
                  console.log("updated quantity");
                  this.props.fetchData();
                }
              })
              .catch(error => {
                console.log(error);
                toast(`An error has occurred. ${error}`, {
                  type: "error"
                });
              });
          } else {
            toast(`An error has occurred. ${error}`, {
              type: "error"
            });
          }
        });
    }
    this.setState({
      name: "",
      quantities: [{ date: "", quantity: "" }]
    });
  };

  handleChange = e => {
    e.preventDefault();
    if (["quantity"].includes(e.target.className)) {
      let newQuantity;
      newQuantity = e.target.value < 0 ? 0 : e.target.value;

      let quantities = [...this.state.quantities];
      quantities[e.target.dataset.id][e.target.className] = newQuantity;
      this.setState({ quantities });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  resetNameInput = () => {
    this.setState({
      nameInputIsLoading: false,
      nameInputResults: [],
      name: ""
    });
  };

  handleNameSelect = (e, { result }) => {
    this.setState({ name: result.name });
  };

  handleNameChange = (e, { value }) => {
    this.setState({ nameInputIsLoading: true, name: value });

    setTimeout(() => {
      if (this.state.name.length < 1) {
        return this.resetNameInput();
      }
      const re = new RegExp(this.state.name, "i");
      this.setState({
        nameInputIsLoading: false,
        nameInputResults: this.props.namesOfFood.filter(word =>
          word.name.match(re)
        )
      });
    }, 100);
  };

  handleCalendarChange(date, idx) {
    let quantities = [...this.state.quantities];
    quantities[idx].date = date;
    this.setState({ quantities });
  }

  render() {
    let { name, quantities } = this.state;
    return (
      <div style={{ margin: "15px", paddingBottom: "50px" }}>
        <Form>
          <Form.Field inline={true} autoComplete="off">
            <label style={{ marginBottom: "5px", marginLeft: "8px" }}>Name:</label>
            <Search
              autoFocus
              ref="nameInput"
              name="nameInput"
              id="nameInput"
              placeholder="Enter a name"
              input={{ icon: "add", iconPosition: "left" }}
              onResultSelect={this.handleNameSelect}
              onSearchChange={this.handleNameChange}
              results={this.state.nameInputResults}
              value={name}
              loading={this.state.nameInputIsLoading}
              resultRenderer={({ name }) => {
                return <p>{name}</p>;
              }}
              {...this.props}
            />
            {/* <label htmlFor="name">Name:</label>
            <Input
              fluid
              type="text"
              autoComplete="off"
              name="name"
              id="name"
              value={name}
              onChange={this.handleChange}
            /> */}
          </Form.Field>
          <Button class="button addQuantityButton" onClick={this.addQuantity}>
            Click me to add more expiration dates/quantities!
          </Button>
          {this.state.quantities.map((val, idx) => {
            const { startDate } = this.state.quantities[idx].date;
            let dateId = `date-${idx}`,
              quantityId = `quantity-${idx}`;
            return (
              <div key={idx} class="dateQuantityInputs">
                <Form>
                  <Form.Group widths="equal" autoComplete="off">
                    <Form.Field autoComplete="off">
                      <label
                        class="expirationLabel"
                        htmlFor={dateId}
                      >{`Expiration #${idx + 1}:  `}</label>
                      <DatePicker
                        autoComplete="off"
                        onChange={date => this.handleCalendarChange(date, idx)}
                        selected={quantities[idx].date}
                        name={dateId}
                        className="date"
                        class="date"
                        id={dateId}
                        placeholderText="Click to select a date"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        popperPlacement="right"
                      />
                    </Form.Field>
                    <Form.Field>
                      <label style={{ marginRight: "200px" }} class="quantityLabel" htmlFor={quantityId}>
                        Quantity:{" "}
                      </label>
                      <input
                        type="number"
                        name={quantityId}
                        data-id={idx}
                        id={quantityId}
                        className="quantity"
                        placeholder="Enter Quantity"
                        class="quantity"
                        onChange={e => {
                          this.handleChange(e);
                        }}
                        value={quantities[idx].quantity}
                        min="0"
                        step="1"
                      />
                    </Form.Field>
                  </Form.Group>
                </Form>
              </div>
            );
          })}
          <Button
            positive
            floated="right"
            content="Submit"
            icon="check"
            labelPosition="right"
            onClick={this.handleSubmit}
          />
        </Form>
      </div>
    );
  }
}
