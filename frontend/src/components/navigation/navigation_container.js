import React from 'react';
import { NavLink } from 'react-router-dom';
import image_logo from '../../static/assets/image_logo.jpg';


const NavigationContainer = props => {
    
    return (
        <div className='nav-container'>
            <div className='up-nav-left-wrapper'>
                <NavLink to="/" className="active">
                    <img src={image_logo} alt='Imagen Logo' />
                </NavLink>
            </div>
            <div className='up-nav-right-wrapper'>
                <div className='up-nav-link-side'>
                    <NavLink to="/shop" className={({ isActive }) => isActive ? "active" : ""}>
                    Shop
                    </NavLink>
                </div>
                <div className='up-nav-link-side'>
                    <NavLink to="/about-me" className={({ isActive }) => isActive ? "active" : ""}>
                    Sobre mí
                    </NavLink>
                </div>
                <div className='up-nav-link-side'>
                    <NavLink to="/blog" className={({ isActive }) => isActive ? "active" : ""}>
                    Blog
                    </NavLink>
                </div>
                <div className='up-nav-link-side'>
                    <NavLink to="/services" className={({ isActive }) => isActive ? "active" : ""}>
                        Servicios y Tarifas
                    </NavLink>
                </div>
                <div className='up-nav-link-side'>
                    <NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""}>
                        Contacto
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

// Aquí lo llamamos
export default NavigationContainer;