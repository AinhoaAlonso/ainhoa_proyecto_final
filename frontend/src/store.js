// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import cartReducer from './reducers/cartSlice';


// Crea el store usando configureStore
const store = configureStore({
    reducer: {
        auth: authReducer, // Aquí se asigna el reducer de autenticación
        cart: cartReducer,
    },
});

export default store;