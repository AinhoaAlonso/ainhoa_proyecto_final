import { createSlice } from '@reduxjs/toolkit';

// Función para cargar el carrito desde localStorage
const loadCartFromLocalStorage = () => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        const expirationDate = new Date(parsedCart.expirationDate);
 
        if (new Date() > expirationDate) {
            localStorage.removeItem('cart'); 
            return { cartItems: [] }; 
        }
        return { cartItems: parsedCart.items };
    }
    return { cartItems: [] }; 
};


const cartSlice = createSlice({
    name: 'cart',
    initialState: loadCartFromLocalStorage(),
    reducers: {
        addToCart: (state, action) => {
            const product = action.payload;
            console.log('Producto recibido:', product);

            
            const existingProduct = state.cartItems.find((item) => item.products_id === product.products_id);
            console.log('Producto existente:', existingProduct);

            if (existingProduct) {
               
                existingProduct.quantity += 1;
                console.log(`Incrementado la cantidad de ${existingProduct.products_name} a ${existingProduct.quantity}`);
            } else {
               
                state.cartItems.push({ ...product, quantity: 1 });
                console.log(`Añadido ${product.products_name} al carrito`);
            }

            saveCartToLocalStorage(state.cartItems);
        },
        updateQuantity: (state, action) => {
            const { products_id, quantity } = action.payload;
            const existingProduct = state.cartItems.find((item) => item.products_id === products_id);
            if (existingProduct) {
                existingProduct.quantity = quantity;
             
                saveCartToLocalStorage(state.cartItems); // Guarda en localStorage
            }
        },
        removeFromCart: (state, action) => {
            const products_id = action.payload;
            state.cartItems = state.cartItems.filter(item => item.products_id !== products_id);
           
            saveCartToLocalStorage(state.cartItems); // Guarda en localStorage
        },
        clearCart: (state) => {
            state.cartItems = [];
           
            localStorage.removeItem('cart');
        }
  },
});


const saveCartToLocalStorage = (cartItems) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); 
    localStorage.setItem('cart', JSON.stringify({ items: cartItems, expirationDate }));
};


export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;


export default cartSlice.reducer;
