// src/reducers/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk para manejar el login asincrónico
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
        
        try {
            const response = await axios.post("http://127.0.0.1:8000/login", {
                users_email: email,
                users_password: password,
            });
            if (response.status === 200) {
                
                localStorage.setItem("access_token", response.data.access_token);
                return {
                    ...response.data,
                    users_email: email,
                };
            }
        } catch (error) {
            console.error("Login error:", error);
            return rejectWithValue("Error en el login");
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        loggedInStatus: localStorage.getItem("access_token") ? "LOGGED_IN" : "NOT LOGGED IN",
        errorMsg: null,
        userRole: null,
        userEmail: null
    },
    reducers: {
        logout: (state) => {
            state.loggedInStatus = "NOT LOGGED IN";
            state.userRole = null;
            state.userEmail = null;
            localStorage.removeItem("access_token");
        },
        setUserEmail: (state, action) => { // Asegúrate de tener este reducer
            state.userEmail = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                console.log("Login, role:", action.payload.users_role);
                console.log("Email del usuario:", action.payload.users_email);
                if (action.payload.users_role === 'admin') {
                    state.loggedInStatus = "LOGGED_IN";
                    state.userRole = 'admin';
                    state.userEmail = action.payload.users_email; 
                    state.errorMsg = null;
                } else {
                    state.errorMsg = "Acceso denegado: NO eres administrador";
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.errorMsg = action.payload || "Error en el login";
            });
    }
});

export const { logout, setUserEmail } = authSlice.actions;
export default authSlice.reducer;
