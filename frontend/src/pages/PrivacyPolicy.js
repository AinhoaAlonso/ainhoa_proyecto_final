import React from 'react';
import NavigationContainer from '../components/navigation/navigation_container';
import Footer from '../components/footer/footer';


const PrivacyPolicy = () => {
    return (
        <div className='privacy-policy-container'>
            <div className='nav-policy-wrapper'>
                <NavigationContainer />
            </div>
            <div className='privacy-page-wrapper'>
                <h1>Política de Privacidad</h1>
                <p><strong>Última actualización: 01/01/9999</strong></p>

                <h2>1. Información que Recopilamos</h2>
                <p><strong>Información Personal:</strong> Podremos recopilar información personal que usted nos proporciona directamente, como su nombre, dirección de correo electrónico, número de teléfono, dirección de envío, y otra información necesaria para procesar su pedido o proporcionarle nuestros Servicios.</p>
                <p><strong>Información No Personal:</strong> También podremos recopilar información no personal sobre usted cuando interactúa con nuestro Sitio, como su dirección IP, tipo de navegador, tiempo de acceso, y páginas visitadas. Esta información se utiliza para mejorar nuestros Servicios y la experiencia del usuario.</p>

                <h2>2. Cómo Usamos su Información</h2>
                <p>Utilizamos la información que recopilamos para los siguientes propósitos:</p>
                <ul>
                    <li>Para procesar y gestionar sus pedidos.</li>
                    <li>Para comunicarnos con usted sobre su pedido y nuestra empresa.</li>
                    <li>Para mejorar nuestro sitio web y nuestros Servicios.</li>
                    <li>Para enviarle información sobre productos y servicios que puedan interesarle (si ha dado su consentimiento para recibir comunicaciones de marketing).</li>
                    <li>Para cumplir con obligaciones legales y proteger nuestros derechos.</li>
                </ul>

                <h2>3. Compartir su Información</h2>
                <p>No vendemos, alquilamos ni intercambiamos su información personal a terceros. Podemos compartir su información en las siguientes circunstancias:</p>
                <ul>
                    <li><strong>Proveedores de Servicios:</strong> Podemos compartir su información con terceros que nos ayudan a operar nuestro Sitio y a proporcionar nuestros Servicios, como procesadores de pagos, proveedores de envíos, y servicios de atención al cliente.</li>
                    <li><strong>Cumplimiento Legal:</strong> Podemos divulgar su información si así lo exige la ley o para proteger nuestros derechos y los derechos de otros.</li>
                </ul>

                <h2>4. Seguridad de su Información</h2>
                <p>Tomamos medidas razonables para proteger la información personal que recopilamos. Sin embargo, ninguna transmisión de datos a través de Internet o método de almacenamiento electrónico es 100% seguro. Si bien nos esforzamos por proteger su información personal, no podemos garantizar su seguridad absoluta.</p>

                <h2>5. Sus Derechos</h2>
                <p>Dependiendo de su ubicación, puede tener ciertos derechos con respecto a su información personal, que pueden incluir:</p>
                <ul>
                    <li>El derecho a acceder a su información personal.</li>
                    <li>El derecho a corregir cualquier información inexacta.</li>
                    <li>El derecho a eliminar su información personal.</li>
                    <li>El derecho a oponerse al procesamiento de su información personal.</li>
                </ul>
                <p>Para ejercer cualquiera de estos derechos, por favor contáctenos utilizando la información de contacto a continuación.</p>

                <h2>6. Cambios a Esta Política de Privacidad</h2>
                <p>Podemos actualizar esta Política de Privacidad de vez en cuando. Publicaremos cualquier cambio en esta página y actualizaremos la fecha de "Última actualización". Le recomendamos que revise esta Política periódicamente para estar al tanto de cualquier cambio.</p>

                <h2>7. Contacto</h2>
                <p>Si tiene alguna pregunta sobre esta Política de Privacidad, contáctenos en:</p>
                <p>
                    Tu Casa Organizada S.L<br />
                    C/Pruebas nº 5 28700 Madrid<br />
                    holaorganizacion@gmail.com<br />
                    555 555 5555
                </p>
            </div>
            <div className='footer'>
                <Footer />
            </div>
        </div>
    );
};

export default PrivacyPolicy;
