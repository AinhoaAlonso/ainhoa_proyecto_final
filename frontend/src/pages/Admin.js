import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate} from "react-router-dom";
import axios from "axios";
import { logout, setUserEmail } from "../reducers/authSlice"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NavigationEdit from "../components/navigation/navigation_edit";
import BlogForm from "../components/blog/blog_form";
import ProductForm from "../components/products/Product_form";
import UserForm from "../components/users/user_form";


const Admin = () => {
    const dispatch = useDispatch();
    const {loggedInStatus, userRole, userEmail} = useSelector((state) => state.auth);
    const [errorMsg, setErrorMsg] = React.useState("");
    const [activeForm, setActiveForm] = useState("product");


    useEffect(() => {
        const verifyToken = (token) => {
            axios.get("https://tucasaorganizada-backend-6ca489a38407.herokuapp.com/verify_token", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                if (response.status === 200) {

                    const userRole = response.data.payload.role;
                    const userEmail = response.data.payload.sub;

                    dispatch(setUserEmail(userEmail));

                    if (userRole !== "admin") {
                        setErrorMsg("Acceso denegado: No eres administrador");
                    }
                }
            })
            .catch(error => {
                localStorage.removeItem("access_token");
                dispatch(logout()); 
                setErrorMsg("Error al verificar el token");
                <Navigate to="/login" />
            });
        };

        const token = localStorage.getItem('access_token');
        if (!token) {
            setErrorMsg("No estás autenticado");
            return;
        }
        verifyToken(token);
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logout());
    };

    if (errorMsg) {
        return <div>{errorMsg}</div>;
    }

    if (loggedInStatus === "NOT LOGGED IN") {
        return <Navigate to="/login" />;
    }

    const handleFormChange = (form) => {
        setActiveForm(form);
    };

    return (
        <div className="admin-container">
            <div className="admin-navigation-wrapper">
                <div className="logo">
                    <NavigationEdit activeForm={activeForm} onFormChange={handleFormChange} />
                </div>
                <div className="logout">
                    <FontAwesomeIcon icon="fa-solid fa-user-check" onClick={handleLogout} alt="Cerrar sesión" />
                </div>
            </div>
            <div className="admin-page-wrapper">
                {activeForm === "product" && <ProductForm />}
                {activeForm === "blog" && <BlogForm />}
                {activeForm === "user" && <UserForm />}
            </div>
        </div>
    );
};

export default Admin;
