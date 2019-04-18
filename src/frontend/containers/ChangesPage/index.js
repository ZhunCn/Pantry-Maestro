import React from 'react';
import ReactDOM from 'react-dom';
import GenericNavigationBar from '@/components/GenericNavigationBar';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import { Item } from "semantic-ui-react";
import './styles.scss';

function FoodItem(props) {
    const { itemName, pantryName, expiration, quantity, deletedDate, deletedPerson } = props.props;
    return (
        <div>
            <li>
                <ol style={{ size: "20px" }}>{itemName}</ol>
                <ol>Pantry: {pantryName}</ol>
                <ol>Expiration: {expiration}</ol>
                <ol>Quantity: {quantity}</ol>
                <ol>Deleted on: {deletedDate}</ol>
                <ol>Deleted by: {deletedPerson}</ol>
                <ol>RESTORE ITEM</ol>
            </li>
        </div>
    )
}

export default class Changes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        const tempItemProp = {
            itemName: "Ramen",
            pantryName: "Workspace One",
            expiration: "01/01/2019",
            quantity: "23",
            deletedDate: "04/04/2019",
            deletedPerson: "Gustavo"
        }
        return (
            <div className="ChangesPage">
                <GenericNavigationBar />
                <div className="MainContent">
                    <h1>Changes</h1>
                    <div>
                        <FoodItem props={tempItemProp} />
                    </div>

                </div>
            </div>
        );
    }
};