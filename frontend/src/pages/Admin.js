// src/pages/Admin.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate} from "react-router-dom";
import axios from "axios";
import { logout, setUserEmail } from "../reducers/authSlice"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { NavLink } from "react-router-dom";
//import ProductModal from "../components/modals/product-modal";
//import BlogModal from "../components/modals/blog_modal";
import NavigationEdit from "../components/navigation/navigation_edit";
import BlogForm from "../components/blog/blog_form";
import ProductForm from "../components/products/Product_form";


const Admin = () => {
    const dispatch = useDispatch();
    const {loggedInStatus, userRole, userEmail} = useSelector((state) => state.auth);
    const [errorMsg, setErrorMsg] = React.useState("");
    const [isProductModalOpen, setIsProductModalOpen]= useState(false);
    const [isBlogModalOpen, setIsBlogModalOpen]= useState(false);
    const [activeForm, setActiveForm] = useState("product");
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
            </div>
        </div>
    );
};

export default Admin;
