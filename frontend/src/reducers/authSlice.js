import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
        
        try {
            const response = await axios.post("https://tucasaorganizada-backend-6ca489a38407.herokuapp.com/login", {
                users_email: email,
                users_password: password,
            });
            if (response.status === 200) {
                
                localStorage.setItem("access_token", response.data.access_token);
                localStorage.setItem("userEmail", email); 

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
        userEmail: localStorage.getItem("userEmail") || null,
    },
    reducers: {
        logout: (state) => {
            state.loggedInStatus = "NOT LOGGED IN";
            state.userRole = null;
            state.userEmail = null;
            localStorage.removeItem("access_token");
            localStorage.removeItem("userEmail"); 
        },
        setUserEmail: (state, action) => { 
            state.userEmail = action.payload;
            localStorage.setItem("userEmail", action.payload);

        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                if (action.payload.users_role === 'admin' && action.payload.users_is_active) {
                    state.loggedInStatus = "LOGGED_IN";
                    state.userRole = 'admin';
                    state.userEmail = action.payload.users_email; 
                    state.errorMsg = null;
                } else if (!action.payload.users_is_active) {
                    state.errorMsg = "Usuario inactivo. No se permite el acceso";
                } else{
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
