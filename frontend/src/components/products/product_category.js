import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Shop from "../../pages/Shop";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../reducers/cartSlice";


export const ProductCategory=()=>{
    const { categoryName } = useParams(); 
    const [products, setProducts] = useState([]);
    const dispatch = useDispatch(); 
    const cartItems = useSelector((state) => state.cart.cartItems); 

    
    useEffect(()=>{
        axios.get("https://tucasaorganizada-backend-6ca489a38407.herokuapp.com/products")
        .then(response=>{
            
            const filteredProducts = response.data.filter(product => product.products_category === categoryName);
                setProducts(filteredProducts);
        })
        .catch(error=>{
            console.log("Error al traer los productos", error)
        })
    }, [categoryName]);

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };

    return (
        <div className="product-container">
            <Shop />
            <div className="product-list-wrapper">
            {products.map(({ products_id, products_image_url, products_name, products_price }) => (
                    <div className="product_item" key={products_id}>
                        <img className="product-image" src={products_image_url} alt={products_name} />
                        <div className="product-details-wrapper">
                            <p className="product-name">{products_name}</p>
                            <p className="product-price">{products_price}€</p>
                        </div>
                        <div className="btn-addcart">
                            <button 
                                type="submit" 
                                onClick={() => handleAddToCart({ 
                                    products_id, 
                                    products_image_url, 
                                    products_name, 
                                    products_price 
                                })}>
                                Añadir al carrito
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

