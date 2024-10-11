import React, {Component} from "react";
import ReactModal from 'react-modal';
import CustomersForm from "../customers/customers_form";

export default class CustomersModal extends Component{
    constructor(props){
        super(props);

        this.customStyles = {
            content : {
                fontFamily: "Roboto, sans-serif",
                top: "50%",
                left: "50%",
                right: "auto",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)",
                width: "80%", 
                maxWidth: "1000px", 
                height: "auto", 
                maxHeight: "80%", 
                overflowY: "auto", 
                padding: "20px", 
                bottom: "auto", 
            },
            
            overlay:{
                backgroundColor: "rgba(0, 0, 0, 0.75)"
            }
        };
    };
    render(){
        const { isOpen, onRequestClose, onSubmit, cartItems, total } = this.props; 
        return(
            <ReactModal
                style={this.customStyles}
                isOpen={isOpen} 
                onRequestClose={onRequestClose} 
                contentLabel="Customers Modal"
            >
                <CustomersForm 
                    onSubmit={onSubmit}
                    cartItems={cartItems}  
                    total={total}  
                />
            </ReactModal>
        );
    }
}