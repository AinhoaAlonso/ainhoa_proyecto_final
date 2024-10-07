import React from "react";
import ReactModal from 'react-modal';
import ProductDetails from "../products/product_details";


const ProductModal = ({ isOpen, onRequestClose, product }) => {
    const customStyles = {
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
    
        overlay:{
            backgroundColor: "rgba(1, 1, 1, 0.75)"
        }
    };
    return (
        <ReactModal
            style={customStyles}
            isOpen={isOpen} 
            onRequestClose={onRequestClose} 
            contentLabel="Product Modal"
            shouldCloseOnOverlayClick={true}
        >
            <ProductDetails product={product} onClose={onRequestClose} />
        </ReactModal>
    );
}
export default ProductModal;