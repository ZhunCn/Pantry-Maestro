import React from 'react';
import ReactDOM from 'react-dom';
import GenericNavigationBar from '@/components/GenericNavigationBar';
import ChangesList from '@/components/ChangesList'
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import { List, Button, Header, Icon } from "semantic-ui-react";
import './styles.scss';


let globalVar = [];

function ListItem(props) {
    const { item, i } = props;
    return (
        <div>
            <List.Item key={`${item[1].changeID}-${i}ListItem`}>
                <List.Content>
                    <List.Header>{item[1].itemName}</List.Header>
                    <p style={{ padding: "5px" }}>
                        Expiration: {Object.entries(item[1].quantities)[0][0]}<br />
                        Original Quantity: {Object.entries(item[1].quantities)[0][1]}<br />
                        Quantity changed by: {Object.entries(item[1].changed)[0][1]}<br />
                        Deleted on: {"item.deletedDate"}<br />
                        Deleted by: {"item.deletedPerson"}<br />
                        <Button
                            onClick={() => console.log("test")}
                            content="Restore change"
                            color="blue"
                        />
                    </p>
                </List.Content>
            </List.Item>
        </div>
    )
}

class Change {
    constructor(changeID, changed, itemID, itemName, quantities, user, userID, isCreated, isModified, isRenamed, oldName = "") {
        this.changeID = changeID;
        this.changed = changed;
        this.itemID = itemID;
        this.itemName = itemName;
        this.quantities = quantities;
        this.user = user;
        this.userID = userID;
        this.isCreated = isCreated;
        this.isModified = isModified;
        this.isRenamed = isRenamed;
        this.oldName = oldName
    }
}

export default class Changes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            changes: [
                {
                    changeID: "131d12d1d190k912kd12ej98",
                    changed: { "01/01/2019": 1 },
                    itemID: "123i1dm1290d12md129ku312",
                    itemName: "Ramen",
                    quantities: { "01/01/2019": 61 }
                },
                {
                    changeID: "12d12d1fd12sd12d12d21e12d1d",
                    changed: { "02/02/2019": -1 },
                    itemID: "vsv423g432g24h3hj34g23g23d312d",
                    itemName: "Pizza",
                    quantities: { "02/02/2019": 23 }
                }
            ],
            allowed: false
        };
    }



    parseChanges(serverData) {
        let workspaceID = localStorage.getItem("currWorkspaceID");
        let userLoginToken = localStorage.getItem("loginToken");
        let data = serverData.changes;
        let tempDataArray = [];
        for (let i = 0; i < data.length; i++) {

            let changeID = data[i]._id;
            let itemID = data[i].item._id;
            let quantities = data[i].item.quantities || { "undef": 1 };
            let changed = data[i].item.changed || { "undef": 1 };
            let itemName = data[i].item.name;
            let user = data[i].modifier.username;
            let userID = data[i].modifier.user_id;
            let isCreated = data[i].item.created;
            let isModified = data[i].item.modified;
            let isRenamed = data[i].item.renamed;
            let oldName = "";
            if (isRenamed) {
                oldName = data[i].item.oldName;
            }
            let tempData = new Change(changeID, changed, itemID, itemName, quantities, user, userID, isCreated, isModified, isRenamed, oldName);
            tempDataArray.push(tempData);
        }
        return tempDataArray;
    }

    getChanges = () => {
        // console.log(this.state.changes)
        this.setState({
            changes: [
                {
                    changeID: "131d12d1d190k912kd12ej98",
                    changed: { "01/01/2019": 1 },
                    itemID: "123i1dm1290d12md129ku312",
                    itemName: "Ramen",
                    quantities: { "01/01/2019": 61 }
                },
                {
                    changeID: "12d12d1fd12sd12d12d21e12d1d",
                    changed: { "02/02/2019": -1 },
                    itemID: "vsv423g432g24h3hj34g23g23d312d",
                    itemName: "Pizza",
                    quantities: { "02/02/2019": 23 }
                }
            ]
        });
        let workspaceID = localStorage.getItem("currWorkspaceID");
        let userLoginToken = localStorage.getItem("loginToken");
        let serverData;
        axios
            .get(`/api/workspaces/${workspaceID}/inventory/changes`, {
                headers: { Authorization: `${userLoginToken}` }
            })
            .then(res => {
                // Add functionality to see if the last modified item is the same as the local last modified item.
                // Only refresh i.e. setState when the last modified items are different
                if (res.data.error ===
                    "There was an error getting your account information: Invalid token"
                ) {
                    localStorage.removeItem("loginToken");
                    return;
                }
                serverData = this.parseChanges(res.data);
                this.setState({ changes: serverData });
            })
            .catch(err => {
                console.log(err);
            });
    }

    verifyOwner() {
        return new Promise(resolve => {
            let workspaceID = localStorage.getItem("currWorkspaceID");
            let userLoginToken = localStorage.getItem("loginToken");

            axios
                .get(`/api/workspaces/${workspaceID}/own`, {
                    headers: { Authorization: `${userLoginToken}` }
                })
                .then(res => {
                    console.log("res", res.data.roles.includes("owner"));
                    console.log("res", res.data.roles.includes("admin"));
                    if (!(res.data.roles.includes("owner") || res.data.roles.includes("admin"))) {
                        this.setState({ allowed: false }, resolve)
                    } else {
                        this.setState({ allowed: true }, resolve)
                    }
                }).catch(err => {
                    console.log(err);
                })
        })
    }

    componentDidMount() {
        this.verifyOwner().then(() => {
            this.getChanges()
        }
        );
    }

    render() {
        return (
            <div className="ChangesPage">
                <GenericNavigationBar />
                <div className="MainContent">
                    <h1>Changes</h1>

                    {(this.state.allowed) ?
                        (
                            <div>
                                <Button
                                    icon="refresh"
                                    labelPosition="left"
                                    content="Refresh"
                                    size="small"
                                    onClick={() => {
                                        this.getChanges();
                                    }}
                                    style={{ marginBottom: "10px" }}
                                />
                                <ChangesList changes={this.state.changes} getChanges={() => this.getChanges()} />
                            </div>)
                        :
                        (<Header as='h2'>
                            <Icon name='hand paper outline' />
                            <Header.Content>You're not allowed to see changes. Please contact your pantry coordinator.</Header.Content>
                        </Header>)
                    }
                    {/* <ChangesList changes={this.state.changes} getChanges={() => this.getChanges()} /> */}
                </div>
            </div>
        );
    }
};