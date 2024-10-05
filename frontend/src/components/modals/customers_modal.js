import React, {Component} from "react";
import ReactModal from 'react-modal';
import CustomersForm from "../customers/customers_form";

export default class CustomersModal extends Component{
    constructor(props){
        super(props);

        //Vamos a aplicar los estilos en línea para que prevalezcan a los que tiene por defecto el react-modal
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
            //Efecto de superposición,oscurece lo de abajo cuando se abre, color negro pero un poco transparente(0.75)
            overlay:{
                backgroundColor: "rgba(0, 0, 0, 0.75)"
            }
        };
    };
    render(){
        const { isOpen, onRequestClose, onSubmit, cartItems, total } = this.props; // Recibe la prop para controlar la apertura
        return(
            <ReactModal
                style={this.customStyles}
                isOpen={isOpen} 
                onRequestClose={onRequestClose} // Para cerrar el modal
                contentLabel="Customers Modal"
            >
                <CustomersForm 
                    onSubmit={onSubmit}
                    cartItems={cartItems}  // Pasar cartItems a CustomersForm
                    total={total}  // Pasar el total a CustomersForm
                />
            </ReactModal>
        );
    }
}