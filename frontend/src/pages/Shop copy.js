import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Para acceder al carrito de Redux
import { Button, Popover, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



const Shop = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null); // Estado para el popover

    const navigate = useNavigate(); // Hook para redirección

    // Acceder al estado del carrito usando Redux Toolkit
    const cartItems = useSelector((state) => state.cart.cartItems); // Obtener productos en el carrito

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/products")
        .then(response => {
            const categories = response.data.map(product => product.products_category);
            const uniqueCategories = [...new Set(categories)];
            setCategories(uniqueCategories);
            setLoading(false);
        })
        .catch(error => {
            console.log("Error al traer las categorias", error);
            setError(error);
            setLoading(false);
        });
    }, []);

    // Abrir el Popover
    const handlePopoverClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget); // Alternar el estado del Popover
    };

    const open = Boolean(anchorEl); // Determinar si el Popover está abierto

    const handleGoCart = (event) => {
        navigate('/cart');
    }
    if (loading) {
        return <h2>Cargando categorías...</h2>;
    }

    if (error) {
        return <h2>Error: {error}</h2>;
    }
    return (
        <div className="shop-container">
            <div className='up-nav-wrapper'>
                <div className='up-nav-left-wrapper'>
                <NavLink to="/" className="active">
                    <h1>Aqui va a estar el Logo</h1>
                </NavLink>
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
            <div className='category' key={index}>
                {/* Enlace dinámico */}
                <NavLink
                to={`/category/${category}`}
                className={({ isActive }) => (isActive ? 'active' : '')}
                end >
                {category}
                </NavLink>
            </div>
            ))}

            <div className="shop-cart-container">
                
            {/* <div className='shop-cart-wrapper'>
                Icono del carrito con Popover */}
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
                    <div style={{ padding: '20px', maxWidth: '300px' }}>
                        <Typography variant="h6">Tu carrito</Typography>
                        {cartItems.length === 0 ? (
                        <Typography variant="body1">Tu carrito está vacío</Typography>
                        ) : (
                            // Agrupar productos por ID y mostrar solo uno por tipo
                            Object.values(cartItems.reduce((acc, item) => {
                                if (!acc[item.products_id]) {
                                    acc[item.products_id] = { ...item, quantity: 0 };
                                }
                                acc[item.products_id].quantity += item.quantity;
                                return acc;
                            }, {})).map((item, index) => (
                                <div key={index} style={{ marginBottom: '10px' }}>
                                    <Typography variant="body2">{item.products_name}</Typography>
                                    <Typography variant="body2">{item.quantity} X {item.products_price}€</Typography>
                                    <Typography variant="body2">Subtotal: {(item.products_price * item.quantity).toFixed(2)}€</Typography>
                                </div>
                            ))
                        )}
                    </div>
                    <div>
                        <Button onClick={handleGoCart} alt='Ir al carrito'>Carrito</Button>
                    </div>
                </Popover>
            </div>
            
        </div>
        </div>
    );
    }

    export default Shop;
