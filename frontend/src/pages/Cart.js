
import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateQuantity, removeFromCart, clearCart, addToCart} from '../reducers/cartSlice';
import { useNavigate, NavLink } from 'react-router-dom';
import CustomersModal from '../components/modals/customers_modal';
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import image_logo from '../../src/static/assets/image_logo.jpg';
import Footer from '../components/footer/footer';

const Cart = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.cartItems);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen]= useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const loadCart = () => {
            const storedCart = localStorage.getItem('cart');
            if (storedCart) {
                const { items } = JSON.parse(storedCart);
                items.forEach(item => {
                    const existingItem = cartItems.find(cartItem => cartItem.products_id === item.products_id);
                    if (!existingItem) {
                        dispatch(addToCart(item));
                    }
                });
            }
        };
    
        loadCart();
    }, [dispatch, cartItems]); 

    const groupedCartItems = cartItems.reduce((acc, item) => {
        const existing = acc.find(i => i.products_id === item.products_id);
        if (existing) {
            return acc.map(i =>
                i.products_id === item.products_id ? { ...i, quantity: i.quantity + item.quantity } : i
            );
        } else {
            return [...acc, { ...item }];
        }
        
    }, []);

    const handleQuantityChange = (products_id, quantity) => {
        if (quantity >= 0) { 
            dispatch(updateQuantity({ products_id, quantity }));
        }
    };

    const handleRemove = (products_id) => {
        dispatch(removeFromCart(products_id));
    };
    const handleClearCart = () => {
        dispatch(clearCart());
        localStorage.removeItem('cart');
    };

    const handleCheckout = () => {
        setIsModalOpen(true);
    };
    const handleContinueShopping = () => {
        navigate('/shop');
    }

    const getTotal = () => {
        return groupedCartItems.reduce((total, item) => total + (Number(item.products_price) * item.quantity), 0);
        
    };
    const handleCustomerSubmit = (message) => {
        setSuccessMessage(message); 
        handleClearCart(); 
        closeModal(); 
    };
 
    const closeModal = () => {
        setIsModalOpen(false);
    };
   
    return (
        <div className='cart-container'>
            <div className='nav-cart-wrapper'>
                <div className='nav-logo'>
                    <NavLink to="/shop" className="active">
                        <img src={image_logo} alt="Logo" />
                    </NavLink>
                </div>
                <div className="nav-shop-title">
                    <h1>Shop</h1>
                </div>
            </div>
            <div className='cartitems-wrapper'>
                {groupedCartItems.length === 0 ? (
                    <p className='empty-cart-message'>No hay productos en el carrito.</p>
                ) : (
                    <table className='cart-table' style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th >Producto</th>
                                <th >Precio</th>
                                <th >Cantidad</th>
                                <th >Subtotal</th>
                                <th ></th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedCartItems.map((item, index) => (
                                <tr key={`${item.unique_id}-${index}`}>
                                    <td >{item.products_name}</td>
                                    <td >{Number(item.products_price).toFixed(2)}€</td>
                                    <td >
                                        <button className='quantity-button' onClick={() => handleQuantityChange(item.products_id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                                        {item.quantity}
                                        <button className='quantity-button' onClick={() => handleQuantityChange(item.products_id, item.quantity + 1)}>+</button>
                                    </td>
                                    <td >
                                        {(item.products_price * item.quantity).toFixed(2)}€
                                    </td>
                                    <td >
                                        <FontAwesomeIcon icon={faCircleXmark} onClick={()=>handleRemove(item.products_id)}/>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {successMessage && <div className="success-message">{successMessage}</div>}
                <div className='cart-buttons'>
                    <button className='action-button' onClick={handleClearCart}>Vaciar Carrito</button>
                    <button className='action-button' onClick={handleContinueShopping}>Seguir Comprando</button>
                </div>
                <div className='total-cart-wrapper'>
                    <div className='titles'>
                        <h2>Subtotal</h2>
                        <h2>Total</h2>
                    </div>
                    <div className='totals'>
                        <h2>{getTotal().toFixed(2)}€</h2>
                        <h2>{getTotal().toFixed(2)}€ <span>(Incluye el 21% de IVA)</span> </h2>
                    </div>   
                </div>
                <button className='btn-shopping' onClick={handleCheckout}>Finalizar Compra</button>
                    <CustomersModal 
                        isOpen={isModalOpen} 
                        onRequestClose={closeModal}
                        onSubmit={handleCustomerSubmit} 
                        cartItems={groupedCartItems} 
                        total={getTotal().toFixed(2)} 
                    />
            </div>
            <div className="footer-wrapper">
                <Footer />
            </div>
        </div>
    );
};

export default Cart;

