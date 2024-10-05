import React, {Component} from "react";
import ReactModal from 'react-modal';
import ProductForm from "../products/Product_form";


export default class ProductModal extends Component{
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
                width: "1000px",
                height:"550px"
            },
            //Efecto de superposición,oscurece lo de abajo cuando se abre, color negro pero un poco transparente(0.75)
            overlay:{
                backgroundColor: "rgba(1, 1, 1, 0.75)"
            }
        };
    }
    render(){
        const { isOpen, onRequestClose } = this.props; // Recibe la prop para controlar la apertura

        return (
            <ReactModal
                style={this.customStyles}
                isOpen={isOpen} 
                onRequestClose={onRequestClose} // Para cerrar el modal
                contentLabel="Product Modal"
            >
                <ProductForm />
            </ReactModal>
        );
    }
}