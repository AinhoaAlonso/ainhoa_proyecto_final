import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import image_aboutme from "../../src/static/assets/image_aboutme.jpg";
import NavigationContainer from "../components/navigation/navigation_container";
import Footer from "../components/footer/footer";
export default class AboutMe extends Component{
    constructor(props){
        super();

    }
    render(){
        return (
            <div className="aboutme-container">
                <NavigationContainer />
                <div className="aboutme-page-wrapper">
                    <div className="left-side-wrapper">
                        <img src={image_aboutme} alt="Image_About me" />
                    </div>
                    <div className="right-side-wrapper">
                        <p>¡Hola! Soy Ainhoa, y mi pasión es transformar espacios desordenados en entornos organizados y funcionales. Desde pequeña, siempre he tenido un amor por el orden y la limpieza.</p>

                        <h2>Mi experiencia</h2>
                        <p>Con 8 años de experiencia en el sector de la organización y limpieza, he trabajado con una variedad de clientes, desde hogares familiares hasta oficinas. Mi enfoque se basa en:</p>
                        <ul>
                            <li>Entender las necesidades específicas de cada cliente.</li>
                            <li>Diseñar soluciones personalizadas que se adapten a su estilo de vida.</li>
                        </ul>

                        <h2>Beneficios de un espacio ordenado</h2>
                        <p>Creo firmemente en el poder de un espacio ordenado:</p>
                        <ul>
                            <li>Mejora el aspecto de cualquier lugar.</li>
                            <li>Contribuye al bienestar mental y emocional de quienes lo habitan.</li>
                            <li>Ayuda a reducir el estrés y aumentar la productividad.</li>
                        </ul>
                        <p>Utilizo métodos y productos sostenibles para asegurar que cada proyecto no solo sea eficiente, sino también respetuoso con el medio ambiente.</p>

                        <h2>En mi tiempo libre</h2>
                        <p>Cuando no estoy organizando y limpiando, me encanta:</p>
                        <ul>
                            <li>Leer.</li>
                            <li>Hacer ejercicio.</li>
                            <li>Cocinar.</li>
                        </ul>

                        <p>Si estás buscando transformar tu hogar u oficina en un espacio más organizado y armonioso, 
                            <span>
                                <NavLink to="/contact" style={{textDecoration:"none", color:"#9BC5A4", fontWeight:"bold"}}>¡no dudes en contactarme!</NavLink>
                            </span>
                            Estoy aquí para ayudarte a lograr la paz y la claridad que mereces.</p>
                    </div>
                </div>
                <div className="footer-wrapper">
                    <Footer />
                </div>
            </div>
        );
    }
}