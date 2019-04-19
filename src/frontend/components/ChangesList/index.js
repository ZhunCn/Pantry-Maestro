import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Button, Modal, Grid, List } from "semantic-ui-react";
import "./styles.scss";

export default class ChangesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

    }

    revertChange(changeID) {
        console.log("changeID", changeID)
        let workspaceID = localStorage.getItem("currWorkspaceID");
        let userLoginToken = localStorage.getItem("loginToken");
        axios.delete(`/api/workspaces/${workspaceID}/inventory/changes/${changeID}`, {
            headers: { Authorization: `${userLoginToken}` }
        }).then(res => {
            if (res.data.message === "Successfully reverted change") {
                toast("Successfully reverted change", { type: "success" })
            }
            this.props.getChanges();
        }).catch(err => {
            toast(`An error occurred. ${err}`, { type: "error" })
        });
    }

    listItem(change, i) {
        console.log(change);
        if (change.isCreated) {
            return (
                <List.Item className="changeItem">
                    <List.Content>
                        <div className="changeContent">
                          <h3>{change.itemName}</h3>
                          <p>Created</p>
                        </div>
                        <p className="changeUser">{change.user}</p>
                        Expiration: {Object.entries(change.quantities)[0][0]}<br />
                        <Button
                            onClick={() => this.revertChange(change.changeID)}
                            content="Restore change"
                            color="blue"
                        />
                    </List.Content>
                </List.Item>
            )
        } else if (change.isModified) {
            return (
                <List.Item>
                    <List.Content>
                        <div className="changeContent">
                          <h3>{change.itemName}</h3>
                          <p>Modified</p>
                        </div>
                        <p className="changeUser">{change.user}</p>
                        Expiration: {Object.entries(change.quantities)[0][0]}<br />
                        Original Quantity: {Object.entries(change.quantities)[0][1]}<br />
                        Quantity changed by: {Object.entries(change.changed)[0][1]}<br />
                        <Button
                            onClick={() => this.revertChange(change.changeID)}
                            content="Restore change"
                            color="blue"
                        />
                    </List.Content>
                </List.Item>
            )
        } else if (change.isRenamed) {
            return (
                <List.Item>
                    <List.Content>
                        <div className="changeContent">
                          <h3>{change.itemName}</h3>
                          <p>Renamed</p>
                        </div>
                        <p className="changeUser">{change.user}</p>
                        Original Name: {change.oldName}<br />
                        <Button
                            onClick={() => this.revertChange(change.changeID)}
                            content="Restore change"
                            color="blue"
                        />
                    </List.Content>
                </List.Item>
            )
        }

    }

    makeList(changes) {
        return <List divided >{(changes.length > 0) ? (changes.map((change, i) => this.listItem(change, i))) : (<List.Item><List.Header>No changes found</List.Header></List.Item>)}</List>;
    }
    render() {
        return (
            <div className="changesList">
                {this.makeList(this.props.changes)}
            </div>
        )
    }
}
