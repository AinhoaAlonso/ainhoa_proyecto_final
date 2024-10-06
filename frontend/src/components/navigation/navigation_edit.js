import React from 'react';
import { NavLink } from 'react-router-dom';
import image_logo from '../../static/assets/image_logo.jpg';


const NavigationEdit = ({ activeForm, onFormChange }) => {
    
    return (
        <div className='nav-container'>
            <div className='up-nav-left-wrapper'>
                <NavLink to="/" className="active">
                    <img src={image_logo} alt='Imagen Logo' />
                </NavLink>
            </div>
            <div className='up-nav-right-wrapper'>
                    <div className={`up-nav-link-side ${activeForm === "product" ? "active" : ""}`}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#6d6d6d',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        padding: '0',
                        fontSize: '16px',  
                    }}
                    onClick={() => onFormChange("product")}
                >
                    Formulario Productos
                </div>
                <div className={`up-nav-link-side ${activeForm === "blog" ? "active" : ""}`}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#6d6d6d',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        padding: '0',
                        fontSize: '16px',  
                    }}
                    onClick={() => onFormChange("blog")}
                >
                    Formulario Blog
                </div>
                <div className='up-nav-link-side'>
                    {/*<NavLink to="/about-me" className={({ isActive }) => isActive ? "active" : ""}>
                    Sobre mí
                    </NavLink>*/}
                </div>
                <div className='up-nav-link-side'>
                    {/*<NavLink to="/services" className={({ isActive }) => isActive ? "active" : ""}>
                        Servicios y Tarifas
                    </NavLink>*/}
                </div>
                <div className='up-nav-link-side'>
                    {/*<NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""}>
                        Contacto
                    </NavLink>*/}
                </div>
            </div>
        </div>
    )
}

export default NavigationEdit;