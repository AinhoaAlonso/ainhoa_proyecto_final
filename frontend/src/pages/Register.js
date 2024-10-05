import React, {Component} from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default class Register extends Component{
    constructor(props){
        super(props);
        
        this.state ={
            name:"",
            lastname_one:"",
            lastname_two:"",
            email:"",
            password:"",
            verify_password:"",
            errorMsg:"",
            redirectToHome: false
        }
        this.handleSubmitRegister = this.handleSubmitRegister.bind(this);
        this.handleChangeRegister = this.handleChangeRegister.bind(this);
    }
    handleSubmitRegister(event){
        event.preventDefault();
        console.log("handleSubmitRegister", event);

        if (this.state.password !== this.state.verify_password) {
            this.setState({ errorMsg: "Las contraseñas no coinciden." });
            return;
        }

        axios.post("http://127.0.0.1:8000/user/insert",{
            users_name: this.state.name,
            users_lastname_one: this.state.lastname_one,
            users_lastname_two: this.state.lastname_two,
            users_email: this.state.email,
            users_password: this.state.password,
        }, { withCredentials: true })
        .then(response =>{
            console.log("Usuario registrado:", response.data);
            this.setState({redirectToHome: true});
        })
        .catch(error =>{
            console.log("Error la registrar el usuario:", error);
            this.setState({errorMsg: "Error al registrar al usuario. Intenta de nuevo"});
        })
    }
    handleChangeRegister(event){
        this.setState({
            [event.target.name]: event.target.value,
            errorMsg:""
        })
    }
    render(){
        if (this.state.redirectToHome) {
            return <Navigate to="/" />;
        }
        return(
            <div>
                <h1>Introduce tus datos personales</h1>
                <form onSubmit={this.handleSubmitRegister}>
                    <input 
                    type="text" 
                    name="name"
                    placeholder="Nombre"
                    value={this.state.name}
                    onChange={this.handleChangeRegister}
                    >
                    </input>
                    <input 
                    type="text" 
                    name="lastname_one"
                    placeholder="Primer Apellido"
                    value={this.state.lastname_one}
                    onChange={this.handleChangeRegister}
                    >
                    </input>
                    <input 
                    type="text" 
                    name="lastname_two"
                    placeholder="Segundo Apellido"
                    value={this.state.lastname_two}
                    onChange={this.handleChangeRegister}
                    >
                    </input>
                    <input 
                    type="email" 
                    name="email"
                    placeholder="Escribe tu mail"
                    value={this.state.email}
                    onChange={this.handleChangeRegister}
                    >
                    </input>
                    <input 
                    type="password" 
                    name="password"
                    placeholder="Escribe tu contraseña"
                    value={this.state.password}
                    onChange={this.handleChangeRegister}
                    >
                    </input>
                    <input 
                    type="password" 
                    name="verify_password"
                    placeholder="Verifica tu contraseña"
                    value={this.state.verify_password}
                    onChange={this.handleChangeRegister}
                    >
                    </input>
                    <div>
                        <button type="submit">Crear usuario</button>
                    </div>
                </form>
                {this.state.errorMsg ? (
                    <div style={{ color: "red" }}>Las contraseñas no coinciden</div>
                ): null}
            </div>
        );
    }
}