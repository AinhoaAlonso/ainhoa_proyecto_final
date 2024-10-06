import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faUser } from "@fortawesome/free-solid-svg-icons";


import blog_image from '../../src/static/assets/blog_image.jpg';
import shop_image from '../../src/static/assets/shop_image.jpg';
import image_logo from '../../src/static/assets/image_logo.jpg';


export default class Home extends Component{
    constructor(props){
        super(props);

        this.state ={
            redirectToLogin: false
        };
        
    this.handleSubmitLogin = this.handleSubmitLogin.bind(this);
    }
    handleSubmitLogin(event){
        event.preventDefault();

        this.setState({redirectToLogin: true});
        
    }
    render(){
        
        if(this.state.redirectToLogin){
            return <Navigate to={'/Login'} />
        }
        return(
            <div className="home-container">
                <div className="home-navigation-wrapper">
                    <div className="logo-wrapper">
                        <img src={image_logo} alt="Logo" />
                    </div>
                    <div className="about-contact-wrapper">
                        <div className="aboutme-wrapper">
                            <NavLink to="/about-me" className="active">
                                Sobre mí
                            </NavLink>
                        </div>
                        <div className="service-price-wrapper">
                            <NavLink to="/services" className="active">
                                Servicios y Tarifas
                            </NavLink>
                        </div>
                        <div className="contact-wrapper">
                            <NavLink to="/contact" className="active">
                                Contacto
                            </NavLink>
                        </div>
                        <div className="icon-login-wrapper">
                            <FontAwesomeIcon icon="fa-solid fa-user-lock" onClick={this.handleSubmitLogin} alt="Iniciar Sesión"/>
                            {/*<button type="submit" onClick={this.handleSubmitLogin}>Iniciar Sesión</button>*/}
                        </div>
                    </div>
                </div>
                <div className="home-page-wrapper">
                    <div className='links-images-wrapper'>
                        <div className='link-wrapper'>
                            <NavLink to="/blog" className="active">
                                <img src={blog_image} alt="Blog_image" />
                                <div className="text-blog">
                                    Blog
                                </div>
                            </NavLink>
                        </div>
                        <div className='link-wrapper'>
                            <NavLink to="/shop" className="active"> 
                                <img src={shop_image} alt="Blog_image" />
                                <div className="text-blog">
                                    Shop
                                </div>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}