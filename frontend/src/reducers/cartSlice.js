import { createSlice } from '@reduxjs/toolkit';

// Función para cargar el carrito desde localStorage
const loadCartFromLocalStorage = () => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        const expirationDate = new Date(parsedCart.expirationDate);
        // Verifica si el carrito ha expirado (7 días)
        if (new Date() > expirationDate) {
            localStorage.removeItem('cart'); // Elimina si ha expirado
            return { cartItems: [] }; // Devuelve un carrito vacío
        }
        return { cartItems: parsedCart.items }; // Devuelve los items almacenados
    }
    return { cartItems: [] }; // Si no hay carrito almacenado
};

// Slice de carrito
const cartSlice = createSlice({
    name: 'cart',
    initialState: loadCartFromLocalStorage(),
    reducers: {
        addToCart: (state, action) => {
            const product = action.payload;
            console.log('Producto recibido:', product);

            // Verifica si el producto ya existe en el carrito usando products_id
            const existingProduct = state.cartItems.find((item) => item.products_id === product.products_id);
            console.log('Producto existente:', existingProduct);

            if (existingProduct) {
                // Si existe, solo incrementa la cantidad
                existingProduct.quantity += 1;
                console.log(`Incrementado la cantidad de ${existingProduct.products_name} a ${existingProduct.quantity}`);
            } else {
                // Si no existe, añade el producto al carrito
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
                // Actualizar localStorage después de cambiar la cantidad
                saveCartToLocalStorage(state.cartItems); // Guarda en localStorage
            }
        },
        removeFromCart: (state, action) => {
            const products_id = action.payload;
            state.cartItems = state.cartItems.filter(item => item.products_id !== products_id);
            // Actualizar localStorage después de eliminar el producto
            saveCartToLocalStorage(state.cartItems); // Guarda en localStorage
        },
        clearCart: (state) => {
            state.cartItems = [];
            // Limpiar localStorage
            localStorage.removeItem('cart');
        }
  },
});

// Función para guardar el carrito en localStorage
const saveCartToLocalStorage = (cartItems) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // 7 días de duración
    localStorage.setItem('cart', JSON.stringify({ items: cartItems, expirationDate }));
};

// Exportar la acción para añadir al carrito
export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;

// Exportar el reducer del carrito
export default cartSlice.reducer;
