import React, { Component } from "react";
import NavigationContainer from "../components/navigation/navigation_container";
import { NavLink } from "react-router-dom";

export default class Services extends Component{
    constructor(props){
        super();

    }
    render(){
        return (
            <div className="services-container">
                <NavigationContainer />
                <p>
                    A continuación, te detallo los servicios de organización y limpieza que ofrezco, junto con sus tarifas. Para más información o para solicitar un servicio, no dudes en 
                    <NavLink to="/contact" className="contact-link"> contactarme aquí</NavLink> o envíame un correo a&nbsp;  
                     <span style={{textDecoration:"none", color:"#9BC5A4", fontWeight:"bold"}}>
                    contacto@miempresa.com.
                    </span>
                </p>

                <h2>Servicios de Organización y Limpieza</h2>
                <p>Ofrezco mis servicios tanto para hogares como para oficinas dentro de la Comunidad de Madrid.</p>

                <h3>Servicios disponibles:</h3>
                <ul>
                    <li>Organización integral de espacios (habitaciones, oficinas, cocinas, etc.)</li>
                    <li>Optimización y reorganización de armarios</li>
                    <li>Organización para mudanzas (pre y post mudanza)</li>
                    <li>Reestructuración de espacios desordenados o abarrotados</li>
                    <li>Planificación de espacios de almacenamiento</li>
                    <li>Limpieza profunda de hogares y oficinas</li>
                </ul>

                <p>
                    En todos estos servicios se realiza una consulta inicial gratuita para comprender tus necesidades y diseñar una solución personalizada. 
                    Una vez aceptado el proyecto, coordinaremos una visita para evaluar el trabajo en detalle.
                </p>

                <h2>Tarifas</h2>
                <ul>
                    <li>
                        <strong>50€/hora + IVA (1 persona):</strong> Este precio aplica para servicios de organización y limpieza general.
                    </li>
                    <li>
                        <strong>80€/hora + IVA (2 personas):</strong> Ideal para proyectos más grandes o con plazos ajustados.
                    </li>
                </ul>

                <p><strong>Condiciones:</strong> Jornada mínima de 3 horas. El coste del aparcamiento será añadido si no se puede proporcionar una plaza de parking gratuita.</p>

                <div className="contact-wrapper">
                    <p>
                        ¿Listo para transformar tu espacio? <NavLink to="/contact" className="contact-link"><span style={{ color: "#9BC5A4", fontWeight: "bold" }}>¡Contáctame!</span></NavLink> y empezamos a trabajar en tu proyecto.
                    </p>
                </div>
            </div>
        );
    }
}