import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate} from "react-router-dom";
import { loginUser } from "../reducers/authSlice"; 
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
        const token = localStorage.getItem("access_token"); 
    
        if (loggedInStatus === "LOGGED_IN") {
            if (userRole === "admin" || token) {
                const timer = setTimeout(() => {
                    navigate('/admin');
                }, 2000);
                
                return () => clearTimeout(timer);
            }
        }
    
        if (errorMsg) {
            setLocalErrorMsg(errorMsg);
        }
    }, [loggedInStatus, userRole, navigate, errorMsg]);
    
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

    const goToHome =()=>{
        navigate("/");
    }

    return (
        <div className="login-container">
            <div className="icon-header">
                <div className="icon-circle">
                    <FontAwesomeIcon icon={faUser} onClick={goToHome}/>
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

