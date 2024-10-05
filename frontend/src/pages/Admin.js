// src/pages/Admin.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { logout, setUserEmail } from "../reducers/authSlice"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from "react-router-dom";
import ProductModal from "../components/modals/product-modal";
import BlogModal from "../components/modals/blog_modal";


const Admin = () => {
    const dispatch = useDispatch();
    const {loggedInStatus, userRole, userEmail} = useSelector((state) => state.auth);
    const [errorMsg, setErrorMsg] = React.useState("");
    const [isProductModalOpen, setIsProductModalOpen]= useState(false);
    const [isBlogModalOpen, setIsBlogModalOpen]= useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = (token) => {
            axios.get("http://127.0.0.1:8000/verify_token", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                if (response.status === 200) {
                    //console.log(response.data.payload);
                    const userRole = response.data.payload.role;
                    const userEmail = response.data.payload.sub;
                    //console.log("Role",userRole);
                    //console.log("Email",userEmail);

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

    const openProductModal= ()=>{
        setIsProductModalOpen(true);

    }
    const closeProductModal = () => {
        setIsProductModalOpen(false);
    };
    const openBlogModal= ()=>{
        if(userEmail){
            setIsBlogModalOpen(true);
        } else{
            console.error("User email no está");
        };
        
    }
    const closeBlogModal = () => {
        setIsBlogModalOpen(false);
    };
    const openProductForm = () =>{
        navigate('/admin/product-form');
    }
    const openBlogForm = () =>{
        navigate('/admin/blog-form');
    }

    return (
        <div className="admin-container">
            <div className="admin-navigation-wrapper">
                <div className="logo">
                    <NavLink to="/" className="active">
                        <h1> Aqui va el Logo</h1>
                    </NavLink>
                </div>
                <div className="logout">
                    <FontAwesomeIcon icon="fa-solid fa-user-check" onClick={handleLogout} alt="Cerrar sesión" />
                </div>
            </div>
            <div className="admin-page-wrapper">
                <div className="left-side-wrapper">
                    <div className="add-products" >
                        <button onClick={openProductForm}>Añadir producto nuevo</button>
                        {/*<button onClick={openProductModal}>Añadir productos</button>
                        <ProductModal isOpen={isProductModalOpen} onRequestClose={closeProductModal} />*/}
                    </div>
                    <div className="add-posts">
                        <button onClick={openBlogForm}>Añadir posts nuevo</button>
                    </div>
                    {/*<div className="update-products">
                        <button>Editar productos</button>
                    </div>
                    <div className="delete-products">
                        <button>Eliminar productos</button>
                    </div>*/}
                </div>
                {/*<div className="right-side-wrapper">
                    <div className="add-posts" >
                        <button onClick={openBlogModal}>Añadir posts</button>
                        <BlogModal isOpen={isBlogModalOpen} onRequestClose={closeBlogModal} userEmail={userEmail} />
                    </div>
                    <div className="update-post">
                        <button>Editar posts</button>
                    </div>
                    <div className="delete-posts">
                        <button>Eliminar posts</button>
                    </div>
                </div>*/}
            </div>
        </div>
    );
};

export default Admin;
