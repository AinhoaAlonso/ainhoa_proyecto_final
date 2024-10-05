import React, {useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Shop from "../../pages/Shop";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../reducers/cartSlice";
import { v4 as uuidv4 } from 'uuid';


export const ProductCategory=()=>{
    const { categoryName } = useParams(); // Obtener el nombre de la categoría desde la URL
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch(); // Crear la función para despachar acciones de Redux
    const cartItems = useSelector((state) => state.cart.cartItems); // Obtener los productos del carrito desde el store de Redux
    const [anchorEl, setAnchorEl] = useState(null); // Estado para el popover

    
    useEffect(()=>{
        axios.get("http://127.0.0.1:8000/products")
        .then(response=>{
            
            const filteredProducts = response.data.filter(product => product.products_category === categoryName);
                setProducts(filteredProducts);
        })
        .catch(error=>{
            console.log("Error al traer los productos", error)
        })
    }, [categoryName]);

    

    const handleAddToCart = (product) => {
        //console.log('Adding product to cart:', product);
        // Genera un ID único y añade al producto antes de despachar
        /*const uniqueProduct = { 
            ...product, 
            unique_id: product.unique_id || uuidv4(),
            quantity: 1 };
        //console.log('Adding product to cart:', product);*/
        dispatch(addToCart(product));
        //navigate('/cart'); // Redirigir a la página de carrito
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

