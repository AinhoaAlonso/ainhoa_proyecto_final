// src/pages/Login.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { loginUser } from "../reducers/authSlice"; // Importa la acción de login
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";


const Login = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [localErrorMsg, setLocalErrorMsg] = useState("");
    const { loggedInStatus, errorMsg, userRole } = useSelector((state) => state.auth);
    const navigate = useNavigate();


    useEffect(() => {
        const token = localStorage.getItem("access_token"); // Verifica si hay token en localStorage
        if (token && loggedInStatus === "LOGGED_IN" && userRole === "admin") {
            navigate("/admin");
        }
    },[loggedInStatus, userRole, navigate]);

    useEffect(() => {
        
        if (errorMsg) {
            setLocalErrorMsg(errorMsg);
        }
    }, [errorMsg]);


    const handleSubmitLogin = (event) => {
        event.preventDefault();
        dispatch(loginUser({ email, password })).unwrap()
            .then((data) => {
                console.log("Login successful", data);
            })
            .catch((error) => {
                setLocalErrorMsg(error);
                console.log("Login error:", error);
            });
        
    }; 


    if (loggedInStatus === "LOGGED_IN" && userRole === "admin") {
        return <Navigate to="/admin" replace />;
    }

    return (
        <div className="login-container">
            <div className="icon-header">
                <div className="icon-circle">
                    <FontAwesomeIcon icon={faUser} />
                </div>
            </div>
            <form onSubmit={handleSubmitLogin}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Acceder</button>
            </form>
            {localErrorMsg && <div style={{ color: "red" }}>{localErrorMsg}</div>}
            {loggedInStatus === "LOGGED_IN" && (
                <div style={{ color: "green" }}>¡Login exitoso! Redirigiendo...</div>
            )}
        </div>
    );
};

export default Login;

