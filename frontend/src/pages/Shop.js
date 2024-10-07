import React, { useState, useEffect} from "react";
import axios from "axios";
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; 
import { Button, Popover, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addToCart } from "../reducers/cartSlice";
import image_logo from '../../src/static/assets/image_logo.jpg';

const Shop = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null); 
    const [products, setProducts] = useState([]);
    const dispatch = useDispatch(); 
    const navigate = useNavigate(); 

    const cartItems = useSelector((state) => state.cart.cartItems); 

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/products")
        .then(response => {
            const activeProducts = response.data.filter(product => product.products_is_active);
            setProducts(activeProducts);
            const uniqueCategories = [...new Set(activeProducts.map(product => product.products_category))];
            setCategories(uniqueCategories);
            setLoading(false);

        })
        .catch(error => {
            console.log("Error al traer los productos", error);
            setError(error);
            setLoading(false);
        });
    }, []);

    // Abrir el Popover
    const handlePopoverClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget); // Alternar el estado del Popover
    };

    const open = Boolean(anchorEl); 

    const handleGoCart = (event) => {
        navigate('/cart');
    }
    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };

    const filteredProducts = selectedCategory 
        ? products.filter(product => product.products_category === selectedCategory)
        : products;

    if (loading) {
        return <h2>Cargando categorías...</h2>;
    }

    const getTotal=()=>{
        return cartItems.reduce((total, item) => {
            return total + item.products_price * item.quantity; 
        }, 0).toFixed(2); 
    };

    return (
        <div className="shop-container">
            <div className='up-nav-wrapper'>
                <div className='up-nav-left-wrapper'>
                    <div className="shop-logo">
                        <NavLink to="/" className="active">
                            <img src={image_logo} alt="Logo" />
                        </NavLink>
                    </div>
                    <div className="shop-title">
                        <h1>Shop</h1>
                    </div>
                </div>
                <div className='up-nav-right-wrapper'>
                    <div className='up-nav-link-side'>
                        <NavLink to="/blog" className="active">
                        Blog
                        </NavLink>
                    </div>
                    <div className='up-nav-link-side'>
                        <NavLink to="/contact" className="active">
                        Contacto
                        </NavLink>
                    </div>
                </div>
            </div>

            <div className="categories-wrapper">
                {categories.map((category, index) => (
                    <div 
                        className={`category ${selectedCategory === category ? 'active' : ''}`}  
                        key={index}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </div>
                ))}
                <div 
                    className={`category ${selectedCategory === null ? 'active' : ''}`}  
                    onClick={() => setSelectedCategory(null)} 
                >
                    Mostrar todos
                </div>

                <div className="shop-cart-container">
                    <Button
                    onClick={handlePopoverClick}
                    endIcon={<FontAwesomeIcon icon="fa-solid fa-bag-shopping" alt="Bag Shopping" />}
                    >
                        Productos ({cartItems.length})
                    </Button>
                    <Popover
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handlePopoverClick}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <div style={{ padding: '20px', width: '200px', height:'auto', fontFamily: 'Roboto, sans-serif' }}>
                            <Typography variant="h6"></Typography>
                            {cartItems.length === 0 ? (
                            <Typography variant="body1">Tu carrito está vacío</Typography>
                            ) : (
                                <div>
                                    {Object.values(cartItems.reduce((acc, item) => {
                                        if (!acc[item.products_id]) {
                                            acc[item.products_id] = { ...item, quantity: 0 };
                                        }
                                        acc[item.products_id].quantity += item.quantity;
                                        return acc;
                                    }, {})).map((item, index) => (
                                        <div 
                                            key={index} 
                                            style={{
                                                marginBottom: '10px',
                                                borderBottom: '1px solid #ccc', 
                                                paddingBottom: '10px'
                                            }}
                                        >
                                            <Typography 
                                                variant="body2"
                                                style={{ fontWeight: 'bold', fontSize: '16px' }}
                                            >
                                                {item.products_name}
                                            </Typography>
                                            <Typography 
                                                variant="body2"
                                                style={{ fontSize: '14px', color: '#555', display: 'flex', justifyContent: 'space-between' }}
                                            >
                                                {item.quantity} X {item.products_price}€
                                            </Typography>
                                        </div>
                                    ))}
                                    <Typography 
                                        variant="body2"
                                        style={{ textAlign: 'center', marginTop: '10px', fontWeight: 'bold', color: '#333' }}
                                    >
                                        Subtotal: {getTotal()}€
                                    </Typography>
                                </div>
                            )}
                        </div>
                        <div style={{display:'flex', justifyContent:'center'}}>
                            <Button 
                                onClick={handleGoCart} 
                                alt='Ir al carrito' 
                                style={{
                                    marginTop:'10px',
                                    marginBottom:'10px',
                                    backgroundColor:'#0f1b27',
                                    borderColor:'#0f1b27',
                                    color:'#F9F9F9',
                                    padding:'10px 20px',
                                    borderRadius:'50px',
                                    cursor: 'pointer',
                                    width:'70%'
                                }}>
                                    Carrito
                            </Button>
                        </div>
                    </Popover>
                </div>   
            </div>
            <div className="product-list-wrapper">
                {filteredProducts.map(({ products_id, products_image_url, products_name, products_price }) => (
                    <div className="product_item" key={products_id}>
                        {products_image_url && products_image_url.trim() !== "" ? (
                            <img className="product-image" src={products_image_url} alt={products_name} />
                        ) : (
                            <div className="placeholder-image" />
                        )}
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
                                Añadir
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default Shop;
