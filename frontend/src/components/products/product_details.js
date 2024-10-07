import React from 'react';



const ProductDetails = ({product, onClose}) => {

    if (!product) {
        return <p>Cargando detalles del producto...</p>;
    }

    return (
        <div className='product-details-container'>
            <h1>{product.products_name}</h1>
            <img 
                className='product-details-image'
                src={product.products_image_url} 
                alt={product.products_name} 
                style={{ width: '220px', height: 'auto' }} 
            />
            <p><strong>Descripción:</strong> {product.products_description}</p>
            <p><strong>Precio:</strong> {product.products_price}€</p>
            <p><strong>Stock:</strong> {product.products_stock} unidades</p>
            <button onClick={onClose}>CERRAR</button>
        </div>
    );
};

export default ProductDetails;
