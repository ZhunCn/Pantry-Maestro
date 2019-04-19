import React from "react";
import ReactTable from "react-table";
import { Redirect } from "react-router-dom";
import "react-table/react-table.css";
import GenericNavigationBar from "@/components/GenericNavigationBar";
import "./styles.scss";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { sum, authorize } from "@/utils";

import AddChangeItemComponent from "@/components/AddChangeItemComponent";
import { toast, ToastContainer } from "react-toastify";

import { Button, Icon, Modal, Form, Confirm, Header, FormButton, TextArea } from "semantic-ui-react";

let workspaceID = localStorage.getItem("currWorkspaceID");

class Item {
  constructor(id, name, expiration, quantity, note) {
    this.id = id;
    this.name = name;
    this.expiration = expiration;
    this.quantity = quantity;
    this.note = note;
  }

  getNote() {
    return this.note;
  }
}

export default class Inventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Temporary data set
      data: [],
      dateRangeStart: undefined,
      dateRangeEnd: undefined,
      deleteItemShow: false,
      itemToDelete: {},
      listOfFood: [],
      noDataText: "",
      currNote: ""
    };
    this.noteInput = React.createRef();
    this.editNameInput = React.createRef();
    this.refReactTable = React.createRef();
  }

  componentDidMount() {
    // Get the items from the server when the table first loads
    this.getCurrWorkspace().then(() => {
      this.fetchData();
    });
  }
  getCurrWorkspace() {
    if (localStorage.getItem("currWorkspaceID") === null) {
      this.setState({ noDataText: "Please join a workspace!" });
    }
    let userLoginToken = localStorage.getItem("loginToken");
    return axios
      .get("/api/account", { headers: { Authorization: `${userLoginToken}` } })
      .then(res => {
        if (
          res.data.error ===
          "There was an error getting your account information: Invalid token"
        ) {
          localStorage.removeItem("loginToken");
          return;
        }
        var workspaces = res.data.workspaces;
        var curWorkID = localStorage.getItem("currWorkspaceID");
        var hasCurr = false;
        if (!curWorkID) {
          localStorage.setItem("currWorkspaceID", workspaces[0]);
          return;
        } else {
          var ind = workspaces.indexOf(curWorkID);
          if (ind == -1) {
            localStorage.setItem("currWorkspaceID", workspaces[0]);
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  // Parses JSON from server into format that the table understands
  parseData(serverData) {
    let parsedData = [];
    let listOfNames = [];
    let dataLength = Object.entries(serverData.inventory.items).length;
    let inventoryData = Object.entries(serverData.inventory.items);
    this.setState({ listOfFood: [] });
    for (let i = 0; i < dataLength; i++) {
      if ("quantities" in inventoryData[i][1]) {
        let inventoryDataQuantities = Object.entries(
          inventoryData[i][1].quantities
        );
        console.log(inventoryData[i]);
        for (let j = 0; j < inventoryDataQuantities.length; j++) {
          let tempItem = new Item(
            inventoryData[i][1]._id,
            inventoryData[i][1].name,
            inventoryDataQuantities[j][0],
            inventoryDataQuantities[j][1],
            inventoryData[i][1].note
          );
          parsedData.push(tempItem);
        }
      } else {
        ("Empty item");
      }
      listOfNames.push({ name: inventoryData[i][1].name });
    }
    this.setState({ listOfFood: listOfNames });
    return parsedData;
  }

  // Get data from server and update state
  fetchData() {
    workspaceID = localStorage.getItem("currWorkspaceID");
    if (workspaceID === null) {
      // there's no workspace ID, so tell the user to join on
      this.setState({ noDataText: "Please join a workspace!" });
      return;
    }
    if (localStorage.getItem("currWorkspaceID") === null) {
      this.setState({ noDataText: "Please join a workspace!" });
      return;
    }
    let userLoginToken = localStorage.getItem("loginToken");
    axios
      .get(`/api/workspaces/${workspaceID}/inventory`, {
        headers: { Authorization: `${userLoginToken}` }
      })
      .then(res => {
        // Add functionality to see if the last modified item is the same as the local last modified item.
        // Only refresh i.e. setState when the last modified items are different
        if (
          res.data.error ===
          "There was an error getting your account information: Invalid token"
        ) {
          localStorage.removeItem("loginToken");
          return;
        }
        if (
          res.data.error ===
          "There was an error getting your account information: Invalid workspace_id"
        ) {
          localStorage.removeItem("currWorkspaceID");
          this.setState({ noDataText: "Please join a workspace!" });
          return;
        }
        let serverData = this.parseData(res.data);
        this.setState({ data: serverData });
        localStorage.setItem("inventory", JSON.stringify(serverData));
      })
      .catch(err => {
        console.log(err);
      });
    this.setState({
      noDataText: "Your inventory is empty. Please add some items."
    });
  }

  createFakeData() {
    workspaceID = localStorage.getItem("currWorkspaceID");
    let userLoginToken = localStorage.getItem("loginToken");
    let startDate = new Date("01/01/2018");
    let endDate = new Date("12/30/2022");

    for (let i = 0; i < 100; i++) {
      let randomName = Math.random()
        .toString(36)
        .substring(7);
      let randomDateQuantity = {};
      for (let j = 0; j < Math.floor(Math.random() * Math.floor(9)) + 1; j++) {
        let randomDate = new Date(
          +startDate + Math.random() * (endDate - startDate)
        ).toLocaleDateString();
        randomDateQuantity[randomDate] =
          Math.floor(Math.random() * Math.floor(25)) + 1;
      }
      let randomData = {
        name: randomName,
        quantities: randomDateQuantity
      };
      axios.post(`/api/workspaces/${workspaceID}/inventory`, randomData, {
        headers: { Authorization: `${userLoginToken}` }
      });
    }
  }

  handleCalendarChangeStart(date) {
    let startDate = new Date(date);
    this.setState({ dateRangeStart: startDate });
  }

  handleCalendarChangeEnd(date) {
    let endDate = new Date(date);
    this.setState({ dateRangeEnd: endDate });
  }

  handleCalendarEdit(item, date) {
    workspaceID = localStorage.getItem("currWorkspaceID");
    let itemID = item.id;
    let newDate = new Date(date).toLocaleDateString();
    let userLoginToken = localStorage.getItem("loginToken");
    let updatedJSON = {
      quantities: {
        [newDate]: item.quantity
      }
    };
    axios
      .delete(`/api/workspaces/${workspaceID}/inventory/${itemID}`, {
        data: { expiration: item.expiration },
        headers: { Authorization: `${userLoginToken}` }
      })
      .then(res => {
        if (res.status === 200) {
          axios
            .put(
              `/api/workspaces/${workspaceID}/inventory/${itemID}`,
              updatedJSON,
              { headers: { Authorization: `${userLoginToken}` } }
            )
            .then(res => {
              // HTTP status 200 OK
              if (res.status === 200) {
                console.log("updated date");
              }
              this.fetchData();
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
  }

  dateDiff(first, second) {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
  }

  handleAddToCartButton(item, updown) {
    // //NOT WORKING CORRECT RN
    // let userLoginToken = localStorage.getItem("loginToken");
    // let updatedQuantity = {
    //   items: {
    //     [item.id]: {
    //       [item.expiration]: updown
    //     }
    //   }
    // };
    // workspaceID = localStorage.getItem("currWorkspaceID");
    // let itemID = item.id;
    // axios
    //   .post(`/api/workspaces/${workspaceID}/checkout`, updatedQuantity, {
    //     headers: { Authorization: `${userLoginToken}` }
    //   })
    //   .then(res => {
    //     // HTTP status 200 OK
    //     if (res.status === 200) {
    //       console.log("checked out");
    //     }
    //     this.fetchData();
    //   })
    //   .catch(error => {
    //     console.log(error);
    //     toast(`There was error adding to cart. ${error}`, {
    //       type: "error"
    //     });
    //   });
    //
    // //NOT WORKING CORRECT RN
    //remove instead of checkout
    let userLoginToken = localStorage.getItem("loginToken");

    // JSON to send to server with the associated expiration date and +1/-1 quantity
    let updatedQuantity = {
      quantities: {
        [item.expiration]: updown
      }
    };
    workspaceID = localStorage.getItem("currWorkspaceID");
    let itemID = item.id;
    axios
      .put(
        `/api/workspaces/${workspaceID}/inventory/${itemID}`,
        updatedQuantity,
        { headers: { Authorization: `${userLoginToken}` } }
      )
      .then(res => {
        // HTTP status 200 OK
        if (res.status === 200) {
          console.log("updated quantity");
        }
        let valsl = sessionStorage.getItem("shoppingList");
        let valsid = sessionStorage.getItem("idList");
        let valsexp = sessionStorage.getItem("expList");
        if (valsid == "") {
          let vals = `${itemID}`;
          sessionStorage.setItem("idList", vals);
          let vall = `${item.name}`;
          sessionStorage.setItem("shoppingList", vall);
          let vale = `${item.expiration}`;
          sessionStorage.setItem("expList", vale);
        } else {
          let idList = valsid.split(",");
          idList.push(`${itemID}`);
          let shoppingList = valsl.split(",");
          shoppingList.push(`${item.name}`);
          let expList = valsexp.split(",");
          expList.push(`${item.expiration}`);
          sessionStorage.setItem("shoppingList", shoppingList.toString());
          sessionStorage.setItem("idList", idList.toString());
          sessionStorage.setItem("expList", expList.toString());
          console.log(sessionStorage.getItem("shoppingList"));
          console.log(sessionStorage.getItem("idList"));
          console.log(sessionStorage.getItem("expList"));
        }

        this.fetchData();
      })
      .catch(error => {
        console.log(error);
        toast(`There was error updating the quantity. ${error}`, {
          type: "error"
        });
      });
  }

  // handles +/- button for items
  // updown is either +1 or -1 for adding 1 and removing 1
  handleEditQuantityButton(item, updown) {
    let userLoginToken = localStorage.getItem("loginToken");
    // JSON to send to server with the associated expiration date and +1/-1 quantity
    let updatedQuantity = {
      quantities: {
        [item.expiration]: updown
      }
    };
    workspaceID = localStorage.getItem("currWorkspaceID");
    let itemID = item.id;
    axios
      .put(
        `/api/workspaces/${workspaceID}/inventory/${itemID}`,
        updatedQuantity,
        { headers: { Authorization: `${userLoginToken}` } }
      )
      .then(res => {
        // HTTP status 200 OK
        if (res.status === 200) {
          console.log("updated quantity");
        }
        this.fetchData();
      })
      .catch(error => {
        console.log(error);
        toast(`There was error updating the quantity. ${error}`, {
          type: "error"
        });
      });
  }

  openDeleteConfirm = row => {
    this.setState({
      ["deleteItemShow" + row.original.name + row.original.expiration]: true
    });
  };
  handleCancelDeleteItem = row => {
    this.setState({
      ["deleteItemShow" + row.original.name + row.original.expiration]: false
    });
  };
  handleConfirmDeleteItem = row => {
    this.setState({
      ["deleteItemShow" + row.original.name + row.original.expiration]: false
    });
    this.handleDeleteItemButton();
  };

  handleDeleteItemButton() {
    console.log("Removing item: " + this.state.itemToDelete.expiration);
    // use axios.delete here
    let workspaceID = localStorage.getItem("currWorkspaceID");
    let userLoginToken = localStorage.getItem("loginToken");
    let itemID = this.state.itemToDelete.id;
    axios
      .delete(`/api/workspaces/${workspaceID}/inventory/${itemID}`, {
        data: { expiration: this.state.itemToDelete.expiration },
        headers: { Authorization: `${userLoginToken}` }
      })
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          console.log("Deleted item");
          toast("Deleted item successfully!", { type: "success" });
          this.fetchData();
        }
      })
      .catch(error => {
        console.log(error.response);
        toast(`There was error deleting this item. ${error}`, {
          type: "error"
        });
      });

    // toast that item has been deleted
  }

  handleEditNameButton(row) {
    let userLoginToken = localStorage.getItem("loginToken");
    workspaceID = localStorage.getItem("currWorkspaceID");
    let itemID = row.subRows[0]._original.id;
    let newName = this.editNameInput.current.value;
    let updateJSON = {
      name: newName
    };
    axios
      .put(`/api/workspaces/${workspaceID}/inventory/${itemID}`, updateJSON, {
        headers: { Authorization: `${userLoginToken}` }
      })
      .then(res => {
        if (res.status === 200) {
          console.log("Updated name");
          toast("Updated name successfully", { type: "success" });
          this.fetchData();
        }
      })
      .catch(error => {
        console.log(error.response);
        toast(`There was error updating the name of this item. ${error}`, {
          type: "error"
        });
      });
  }

  handleEditNote(row) {
    let userLoginToken = localStorage.getItem("loginToken");
    workspaceID = localStorage.getItem("currWorkspaceID");
    let itemID = row.subRows[0]._original.id;
    let newNote = this.noteInput.current.value;
    let updateJSON = {
      content: newNote
    };
    let data = this.state.data;
    data.find(x => x.id === row.row._subRows[0]._original.id).note = newNote;
    this.setState({ data: data })
    axios
      .put(`/api/workspaces/${workspaceID}/inventory/${itemID}/note`, updateJSON, {
        headers: { Authorization: `${userLoginToken}` }
      })
      .then(res => {
        if (res.status === 200) {
          console.log("Updated note");
          toast("Updated note successfully", { type: "success" });
        }
      })
      .catch(error => {
        console.log(error.response);
        toast(`There was error updating the note of this item. ${error}`, {
          type: "error"
        });
      });
  }

  render() {
    if (!authorize()) {
      return <Redirect to="/login" />;
    }

    const { data } = this.state;
    const columns = [
      {
        Header: "Name",
        id: "name",
        accessor: d => d.name,
        sortMethod: (a, b) => {
          return a.toLowerCase() > b.toLowerCase()
            ? 1
            : b.toLowerCase() > a.toLowerCase()
              ? -1
              : 0;
        },
        filterMethod: (filter, row) => {
          return (
            row.name.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1
          );
        }
      },
      {
        Header: "",
        id: "editName",
        aggregate: vals => {
          // Don't delete plz
        },
        Cell: row => {
          if (!row.original) {
            return (
              <div style={{ display: "inline-block" }}>
                <Modal
                  closeIcon
                  trigger={
                    <Button
                      compact
                      style={{
                        padding: "7px 4px 7px 4px",
                        float: "left"
                      }}
                    >
                      Edit Name
                  </Button>
                  }
                >
                  <Modal.Header>Edit Name</Modal.Header>
                  <Modal.Content>
                    <Form>
                      <label>Enter a new name:</label>
                      <input
                        type="text"
                        ref={this.editNameInput}
                        list="listOfFood"
                      />
                      <datalist id="listOfFood" />
                    </Form>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button
                      positive
                      onClick={() => this.handleEditNameButton(row)}
                    >
                      Submit
                    </Button>
                  </Modal.Actions>
                </Modal>
                <Modal
                  scrolling
                  closeIcon
                  centered
                  trigger={
                    <Button
                      compact
                      style={{
                        padding: "7px 6px 7px 6px",
                        float: "right"
                      }}
                      icon="sticky note"
                    />
                  } >
                  <Modal.Header>Note</Modal.Header>
                  <Modal.Content>
                    <textarea ref={this.noteInput} style={{ resize: "none", height: "400px", width: "100%" }} placeholder='This item has no note. Add one here and click save.' >
                      {this.state.data.find(x => x.id === row.row._subRows[0]._original.id).note}
                    </textarea>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button
                      positive
                      onClick={() => this.handleEditNote(row)}
                    >
                      Save Note
                  </Button>
                  </Modal.Actions>
                </Modal>
              </div >

            );
          } else {
            return (
              <label /> // empty cell
            );
          }
        },
        sortable: false,
        filterable: false,
        resizable: false,
        width: 120
      },
      {
        Header: "Earliest Expiration Date",
        id: "expiration",
        aggregate: vals => {
          return vals.sort((a, b) => {
            let date1 = new Date(a.join(""));
            let date2 = new Date(b.join(""));
            return date1 - date2;
          })[0];
        },
        accessor: d => {
          let dates = Array.from(d.expiration);
          return dates.sort((a, b) => {
            return Date.parse(a) > Date.parse(b);
          });
        },
        sortMethod: (a, b) => {
          let date1 = new Date(a.join(""));
          let date2 = new Date(b.join(""));
          if (date1 > date2) {
            return 1;
          }
          if (date1 < date2) {
            return -1;
          }
          // returning 0 or undefined will use any subsequent column sorting methods or the row index as a tiebreaker
          return 0;
        },
        filterMethod: (filter, row) => {
          var currDate = new Date();
          var rowDate = new Date(Date.parse(row.expiration.join("")));
          let dateDiff = this.dateDiff(currDate, rowDate);
          // console.log(rowDate);
          // Terrible, *TERRIBLE* code. Very copypasted.
          // I'll refactor it when I have time later
          // Right now, functionality is paramount
          if (filter.value == "all") {
            // Show all items
            return true;
          }
          if (filter.value == "expired") {
            if (rowDate < currDate) {
              return true;
            } else {
              return false;
            }
          }
          if (filter.value == "sevenDays") {
            if (rowDate >= currDate && dateDiff <= 7) {
              return true;
            } else {
              return false;
            }
          }
          if (filter.value == "thirtyDays") {
            if (rowDate >= currDate && dateDiff <= 30) {
              return true;
            } else {
              return false;
            }
          }
          if (filter.value == "sixtyDays") {
            if (rowDate >= currDate && dateDiff <= 60) {
              return true;
            } else {
              return false;
            }
          }
          if (filter.value == "ninetyDays") {
            if (rowDate >= currDate && dateDiff <= 90) {
              return true;
            } else {
              return false;
            }
          }
          if (filter.value == "later") {
            if (dateDiff > 90) {
              return true;
            } else {
              return false;
            }
          }

          // console.log(row);
          // console.log(filter);
        },
        Filter: ({ filter, onChange }) => (
          <select
            onChange={event => onChange(event.target.value)}
            style={{ width: "100%" }}
            value={filter ? filter.value : "all"}
          >
            <option value="all">Show all</option>
            <option value="expired">Already Expired</option>
            <option value="sevenDays">7 Days</option>
            <option value="thirtyDays">30 Days</option>
            <option value="sixtyDays">60 Days</option>
            <option value="ninetyDays">90 Days</option>
            <option value="later">91+ Days</option>
          </select>
        ),
        Cell: row => {
          let rowDate = new Date(Date.parse(row.row.expiration.join("")));
          const diff = rowDate < Date.now();
          const style = {
            color: diff ? "red" : "inherit",
            fontWeight: diff ? "bold" : "inherit"
          };
          if (row.original) {
            if (diff) {
              return (
                <div style={style}>
                  <label>EXPIRED: {row.row.expiration.join("")}</label>
                  <div style={editButtonStyle}>
                    <DatePicker
                      onChange={date =>
                        this.handleCalendarEdit(row.row._original, date)
                      }
                      selected={Date.parse(row.row.expiration.join(""))}
                      className="date"
                      class="date"
                      id={row.row._original.id + row.row._original.expiration}
                      ref={c => (this._calendar = c)}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      customInput={
                        <Button
                          compact
                          style={{
                            padding: "6px auto 6px auto"
                          }}
                          calendar={this._calendar}
                        >
                          Edit Date
                        </Button>
                      }
                    />
                  </div>
                </div>
              );
            } else {
              return (
                <div style={style}>
                  <label>{row.row.expiration.join("")}</label>
                  <div style={editButtonStyle}>
                    <DatePicker
                      onChange={date =>
                        this.handleCalendarEdit(row.row._original, date)
                      }
                      selected={Date.parse(row.row.expiration.join(""))}
                      className="date"
                      class="date"
                      id={row.row._original.id + row.row._original.expiration}
                      ref={c => (this._calendar = c)}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      customInput={
                        <Button
                          compact
                          style={{
                            padding: "6px auto 6px auto"
                          }}
                          calendar={this._calendar}
                        >
                          Edit Date
                        </Button>
                      }
                    />
                  </div>
                </div>
              );
            }
          } else {
            if (diff) {
              return (
                <div style={style}>
                  <label>
                    One or more items are expired: {row.row.expiration.join("")}
                  </label>
                </div>
              );
            } else {
              return (
                <div style={style}>
                  <label>{row.row.expiration.join("")}</label>
                </div>
              );
            }
          }
        }
      },
      {
        Header: "Quantity",
        accessor: "quantity",
        aggregate: vals => sum(vals),
        Aggregated: row => {
          return <span>{row.value} (Total)</span>;
        },
        Cell: row => {
          // console.log(row);
          return (
            <div>
              <label>{row.row.quantity}</label>
              <Button.Group floated="right">
                <Button
                  animated
                  compact
                  onClick={() =>
                    this.handleEditQuantityButton(row.row._original, -10)
                  }
                >
                  <Button.Content visible>x10</Button.Content>
                  <Button.Content hidden>
                    <Icon name="minus" />
                  </Button.Content>
                </Button>
                <Button
                  icon
                  compact
                  style={{ padding: "6px 7px 6px 7px" }}
                  onClick={() =>
                    this.handleEditQuantityButton(row.row._original, -1)
                  }
                >
                  <Icon name="minus" />
                </Button>
                <Button
                  icon
                  compact
                  style={{ padding: "6px 7px 6px 7px" }}
                  onClick={() =>
                    this.handleEditQuantityButton(row.row._original, 1)
                  }
                >
                  <Icon name="plus" />
                </Button>
                <Button
                  animated
                  compact
                  onClick={() =>
                    this.handleEditQuantityButton(row.row._original, 10)
                  }
                >
                  <Button.Content visible>x10</Button.Content>
                  <Button.Content hidden>
                    <Icon name="plus" />
                  </Button.Content>
                </Button>
              </Button.Group>

              <Button
                positive
                floated="right"
                animated
                compact
                style={{ padding: "6px auto 6px auto", marginRight: "10px" }}
                onClick={
                  () =>
                    this.handleAddToCartButton(row.row._original, -1)
                  // this.handleEditQuantityButton(row.row._original, -1) //api path doesnt work rn so ill just remove for now
                }
              >
                <Button.Content visible>Add To Cart</Button.Content>
                <Button.Content hidden>
                  <Icon name='shopping cart' />
                </Button.Content>
              </Button>
            </div>
          );
        }
      },
      {
        Header: "",
        Cell: row => {
          let stateVar =
            "deleteItemShow" + row.original.name + row.original.expiration;
          console.log(this.state[stateVar]);
          return (
            <div>
              <Button
                animated
                id={row.original.id + row.original.expiration}
                negative
                fluid
                compact
                style={{ padding: "6px auto 6px auto" }}
                onClick={() => {
                  this.openDeleteConfirm(row);
                  this.setState({ itemToDelete: row.row._original });
                }}
              >
                <Button.Content visible>
                  <Icon style={{ marginLeft: "5px" }} name="trash" />
                </Button.Content>
                <Button.Content hidden>
                  <Icon style={{ marginLeft: "5px" }} name="delete" />
                </Button.Content>
              </Button>
              <Modal
                id={row.original.id + row.original.expiration}
                closeIcon
                open={this.state[stateVar]}
              >
                <Header icon="trash" content="Delete Item" />
                <Modal.Content>
                  <p>Are you sure you want to delete this item?</p>
                </Modal.Content>
                <Modal.Actions>
                  <Button
                    onClick={() => {
                      this.handleCancelDeleteItem(row);
                    }}
                  >
                    Never mind
                  </Button>
                  <Button
                    negative
                    onClick={() => {
                      this.handleConfirmDeleteItem(row);
                    }}
                  >
                    Yes, delete
                  </Button>
                </Modal.Actions>
              </Modal>
            </div>
          );
        },
        sortable: false,
        filterable: false,
        resizable: false,
        width: 70
      }
    ];

    return (
      <div class="inventoryPage">
        <GenericNavigationBar />
        <div class="MainContent">
          <div class="InventoryTopBar" style={{ display: "inline-block" }}>
            <h1>Inventory</h1>
            <Button
              icon="refresh"
              labelPosition="left"
              content="Refresh"
              size="small"
              onClick={() => {
                this.fetchData();
              }}
            />
            <Modal
              centered={false}
              closeIcon
              // style={{ height: "70%", width: "40%" }}
              trigger={
                <Button icon labelPosition="left" size="small">
                  <Icon name="add" />
                  Add new item
                </Button>
              }
            >
              <Modal.Header>Add a new item</Modal.Header>
              <Modal.Content scrolling className="asdasdasdqw">
                <AddChangeItemComponent
                  namesOfFood={this.state.listOfFood}
                  fetchData={() => {
                    this.fetchData();
                  }}
                />
              </Modal.Content>
            </Modal>
          </div>
          <ReactTable
            className="-striped -highlight"
            ref={r => {
              this.refReactTable = r;
            }}
            data={data}
            columns={columns}
            pivotBy={["name"]}
            sortable={true}
            filterable
            defaultFilterMethod={(filter, row) =>
              String(row[filter.id]) === filter.value
            }
            defaultPageSize={10}
            collapseOnDataChange={false}
            collapseOnSortingChange={true}
            collapseOnPageChange={true}
            style={{ marginRight: "10px" }}
            noDataText={this.state.noDataText}
          />
        </div>
      </div>
    );
  }
}
const editButtonStyle = {
  float: "right",
  marginRight: "18px"
};
