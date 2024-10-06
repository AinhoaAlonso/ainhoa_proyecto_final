import React from 'react';
import NavigationContainer from "../components/navigation/navigation_container";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareXTwitter  } from '@fortawesome/free-brands-svg-icons';
import { faSquareFacebook } from '@fortawesome/free-brands-svg-icons';
import { faSquareInstagram } from '@fortawesome/free-brands-svg-icons';

const Contact = () => {
    return (
        <div className="contact-container">
            <div className="contact-nav-wrapper">
                <NavigationContainer />
            </div>
            <div className="contact-page-wrapper">
                <h1 className='title'>
                    ¡Hablemos!
                </h1>
                <p>Me encantaría saber de ti. Ya sea que tengas alguna pregunta, una sugerencia, o simplemente quieras compartir tus experiencias y trucos de organización, siempre es un placer escuchar de personas como tú.</p>

                <p>Puedes ponerte en contacto conmigo a través de las siguientes redes y medios:</p>
                <ul className="contact-list">
                    <li className='email'>
                        <strong>Correo Electrónico:</strong> Si prefieres un mensaje más personal, no dudes en enviarme un correo a:&nbsp; <a href="mailto:holaorganizacion@gmail.com">holaorganizacion@gmail.com</a>
                    </li>
                </ul>
                <p>Redes Sociales: Me puedes encontrar en:</p>
                <ul className='contact-list'>
                    <li className='social-media'>
                        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faSquareFacebook} />
                        </a>
                    </li>
                    <li className='social-media'>
                        <a href="https://x.com/home?lang=es" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faSquareXTwitter} />
                        </a>
                    </li>
                    <li className='social-media'>
                        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faSquareInstagram} />
                        </a>
                    </li>
                    
                </ul>
                <p>Estoy disponible para ayudarte en todo lo que necesites y para aprender juntos cómo mantener el hogar más organizado. ¡Espero tu mensaje!</p>
            </div>
        </div>
    );
};

export default Contact;
