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
import { toast } from "react-toastify";

import { Button, Icon, Modal } from "semantic-ui-react";

let workspaceID = localStorage.getItem("currWorkspaceID");

function Item(id, name, expiration, quantity) {
    this.id = id;
    this.name = name;
    this.expiration = expiration;
    this.quantity = quantity;
}

// Parses JSON from server into format that the table understands
function parseData(serverData) {
    let parsedData = [];
    let dataLength = Object.entries(serverData.inventory.items).length;
    for (let i = 0; i < dataLength; i++) {
        console.log(
            "quantities" in Object.entries(serverData.inventory.items)[i][1]
        );
        if ("quantities" in Object.entries(serverData.inventory.items)[i][1]) {
            for (
                let j = 0;
                j <
                Object.entries(
                    Object.entries(serverData.inventory.items)[i][1].quantities
                ).length;
                j++
            ) {
                let tempItem = new Item(
                    Object.entries(serverData.inventory.items)[i][1]._id,
                    Object.entries(serverData.inventory.items)[i][1].name,
                    Object.entries(
                        Object.entries(serverData.inventory.items)[i][1]
                            .quantities
                    )[j][0],
                    Object.entries(
                        Object.entries(serverData.inventory.items)[i][1]
                            .quantities
                    )[j][1]
                );
                parsedData.push(tempItem);
            }
        } else {
            ("Empty item");
        }
    }
    return parsedData;
}

export default class Inventory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Temporary data set
            data: [
                {
                    name: "TEST1",
                    expiration: "12/01/2019",
                    quantity: 20,
                },
                {
                    name: "TEST1",
                    expiration: "02/15/2019",
                    quantity: 12,
                },
                {
                    name: "TEST1",
                    expiration: "03/19/2019",
                    quantity: 23,
                },
                {
                    name: "TEST2",
                    expiration: "01/07/2019",
                    quantity: 2,
                },
                {
                    name: "TEST2",
                    expiration: "05/23/2019",
                    quantity: 11,
                },
                {
                    name: "TEST2",
                    expiration: "06/24/2019",
                    quantity: 9,
                },
                {
                    name: "TEST2",
                    expiration: "07/12/2019",
                    quantity: 14,
                },
            ],
            dateRangeStart: undefined,
            dateRangeEnd: undefined,
        };
    }

    componentDidMount() {
        // Get the items from the server when the table first loads
        this.getCurrWorkspace().then(()=>{
          this.fetchData();
        });
    }
    getCurrWorkspace(){
      let userLoginToken = localStorage.getItem("loginToken");
      return axios.get("/api/account", { headers: { "Authorization" : `${userLoginToken}` } }).then(res=>{
        var workspaces = res.data.workspaces;
        var curWorkID = localStorage.getItem("currWorkspaceID");
        var hasCurr = false;
        if(!curWorkID){
          localStorage.setItem("currWorkspaceID", workspaces[0]);
          return;
        }
        else{
          var ind = workspaces.indexOf(curWorkID);
          if(ind==-1){
            localStorage.setItem("currWorkspaceID", workspaces[0]);
          }
        }
      });
    }
    // Get data from server and update state
    fetchData() {
        workspaceID = localStorage.getItem("currWorkspaceID");
        axios.get(`/api/workspaces/${workspaceID}/inventory`, {}).then(res => {
            // Add functionality to see if the last modified item is the same as the local last modified item.
            // Only refresh i.e. setState when the last modified items are different
            let serverData = parseData(res.data);
            this.setState({ data: serverData });
            localStorage.setItem("inventory", JSON.stringify(serverData));
        });
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
        let updatedJSON = {
            quantities: {
                [newDate]: item.quantity,
            },
        };
        axios
            .delete(`/api/workspaces/${workspaceID}/inventory/${itemID}`, {
                data: { expiration: item.expiration },
            })
            .then(res => {
                // console.log(res.data);
                if (res.status === 200) {
                    axios
                        .put(
                            `/api/workspaces/${workspaceID}/inventory/${itemID}`,
                            updatedJSON
                        )
                        .then(res => {
                            // HTTP status 200 OK
                            if (res.status === 200) {
                                console.log("updated date");
                            }
                            console.log(res.data);
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

    // handles +/- button for items
    // updown is either +1 or -1 for adding 1 and removing 1
    handleEditQuantityButton(item, updown) {
        console.log("Updating quantity of " + item.id + " by " + updown);

        // JSON to send to server with the associated expiration date and +1/-1 quantity
        let updatedQuantity = {
            quantities: {
                [item.expiration]: updown,
            },
        };
        workspaceID = localStorage.getItem("currWorkspaceID");
        let itemID = item.id;
        axios
            .put(
                `/api/workspaces/${workspaceID}/inventory/${itemID}`,
                updatedQuantity
            )
            .then(res => {
                // HTTP status 200 OK
                if (res.status === 200) {
                    console.log("updated quantity");
                }
                console.log(res.data);
                this.fetchData();
            })
            .catch(error => {
                console.log(error);
                toast(`There was error updating the quantity. ${error}`, {
                    type: "error",
                });
            });
    }

    handleDeleteItemButton(item) {
        console.log("Removing item: " + item.expiration);
        // use axios.delete here
        workspaceID = localStorage.getItem("currWorkspaceID");
        let itemID = item.id;
        axios
            .delete(`/api/workspaces/${workspaceID}/inventory/${itemID}`, {
                data: { expiration: item.expiration },
            })
            .then(res => {
                if (res.status === 200) {
                    console.log("Deleted item");
                    toast("Deleted item successfully!", { type: "success" });
                    this.fetchData();
                }
            })
            .catch(error => {
                console.log(error.response);
                toast(`There was error deleting this item. ${error}`, {
                    type: "error",
                });
            });

        // toast that item has been deleted
    }

    handleEditName(item) {
        // console.log(item);
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
                        row.name
                            .toLowerCase()
                            .indexOf(filter.value.toLowerCase()) !== -1
                    );
                },
                PivotValue: row => {
                    console.log(row);
                    return (
                        <div style={{ display: "inline" }}>
                            <label>{row.row.name}</label>
                            <div style={editButtonStyle}>
                                <Button
                                    compact
                                    style={{ padding: "6px 7px 6px 7px" }}
                                    onClick={() =>
                                        this.handleEditName(row.row)
                                    }>
                                    Edit Name
                                </Button>
                            </div>
                        </div>
                    );
                },
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
                    console.log(rowDate);
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
                        if (this.dateDiff(currDate, rowDate) <= 7) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    if (filter.value == "thirtyDays") {
                        if (this.dateDiff(currDate, rowDate) <= 30) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    if (filter.value == "sixtyDays") {
                        if (this.dateDiff(currDate, rowDate) <= 60) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    if (filter.value == "ninetyDays") {
                        if (this.dateDiff(currDate, rowDate) <= 90) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    if (filter.value == "later") {
                        if (this.dateDiff(currDate, rowDate) > 90) {
                            return true;
                        } else {
                            return false;
                        }
                    }

                    console.log(row);
                    console.log(filter);
                },
                Filter: ({ filter, onChange }) => (
                    <select
                        onChange={event => onChange(event.target.value)}
                        style={{ width: "100%" }}
                        value={filter ? filter.value : "all"}>
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
                    let rowDate = new Date(
                        Date.parse(row.row.expiration.join(""))
                    );
                    const diff = rowDate < Date.now();
                    const style = {
                        color: diff ? "red" : "inherit",
                        fontWeight: diff ? "bold" : "inherit",
                    };
                    if (row.original) {
                        if (diff) {
                            return (
                                <div style={style}>
                                    <label>
                                        EXPIRED: {row.row.expiration.join("")}
                                    </label>
                                    <div style={editButtonStyle}>
                                        <DatePicker
                                            onChange={date =>
                                                this.handleCalendarEdit(
                                                    row.row._original,
                                                    date
                                                )
                                            }
                                            selected={Date.parse(
                                                row.row.expiration.join("")
                                            )}
                                            className="date"
                                            class="date"
                                            id={
                                                row.row._original.id +
                                                row.row._original.expiration
                                            }
                                            ref={c => (this._calendar = c)}
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            customInput={
                                                <Button
                                                    compact
                                                    style={{
                                                        padding:
                                                            "6px 7px 6px 7px",
                                                    }}
                                                    calendar={this._calendar}>
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
                                                this.handleCalendarEdit(
                                                    row.row._original,
                                                    date
                                                )
                                            }
                                            selected={Date.parse(
                                                row.row.expiration.join("")
                                            )}
                                            className="date"
                                            class="date"
                                            id={
                                                row.row._original.id +
                                                row.row._original.expiration
                                            }
                                            ref={c => (this._calendar = c)}
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            customInput={
                                                <Button
                                                    compact
                                                    style={{
                                                        padding:
                                                            "6px 7px 6px 7px",
                                                    }}
                                                    calendar={this._calendar}>
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
                                        One or more items are expired:{" "}
                                        {row.row.expiration.join("")}
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
                },
            },
            {
                Header: "Quantity",
                accessor: "quantity",
                aggregate: vals => sum(vals),
                Aggregated: row => {
                    return <span>{row.value} (Total)</span>;
                },
                Cell: row => {
                    console.log(row);
                    return (
                        <div>
                            <label>{row.row.quantity}</label>
                            <Button.Group floated="right">
                                <Button
                                    icon
                                    compact
                                    style={{ padding: "6px 7px 6px 7px" }}
                                    onClick={() =>
                                        this.handleEditQuantityButton(
                                            row.row._original,
                                            -1
                                        )
                                    }>
                                    <Icon name="minus" />
                                </Button>
                                <Button
                                    icon
                                    compact
                                    style={{ padding: "6px 7px 6px 7px" }}
                                    onClick={() =>
                                        this.handleEditQuantityButton(
                                            row.row._original,
                                            1
                                        )
                                    }>
                                    <Icon name="plus" />
                                </Button>
                            </Button.Group>
                        </div>
                    );
                },
            },
            {
                Header: "",
                Cell: row => (
                    <div>
                        <button
                            className="ui fluid compact negative button"
                            style={{ padding: "6px 7px 6px 7px" }}
                            onClick={() =>
                                this.handleDeleteItemButton(row.row._original)
                            }>
                            Delete
                        </button>
                    </div>
                ),
                sortable: false,
                filterable: false,
                resizable: false,
                width: 70,
            },
        ];

        return (
            <div class="inventoryPage">
                <GenericNavigationBar />
                <div class="Content" style={{ position: "relative" }}>
                    <div
                        class="InventoryTopBar"
                        style={{ display: "inline-block" }}>
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
                            trigger={
                                <Button icon labelPosition="left" size="small">
                                    <Icon name="add" />
                                    Add new item
                                </Button>
                            }
                            centered={false}>
                            <Modal.Header>Add a new item</Modal.Header>
                            <AddChangeItemComponent
                                fetchData={() => {
                                    this.fetchData();
                                }}
                            />
                        </Modal>
                    </div>
                    <ReactTable
                        ref={refReactTable => {
                            this.refReactTable = refReactTable;
                        }}
                        data={data}
                        columns={columns}
                        pivotBy={["name"]}
                        sortable={true}
                        filterable
                        defaultFilterMethod={(filter, row) =>
                            String(row[filter.id]) === filter.value
                        }
                        collapseOnDataChange={false}
                        collapseOnSortingChange={false}
                        collapseOnPageChange={false}
                        style={{ marginRight: "10px" }}
                    />
                </div>
            </div>
        );
    }
}
const editButtonStyle = {
    float: "right",
    marginRight: "18px",
};
