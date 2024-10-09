import React from 'react';
import NavigationContainer from '../components/navigation/navigation_container';
import Footer from '../components/footer/footer';

const Terms = () => {
    return (
        <div className='terms-conditions-container'>
            <div className='nav-policy-wrapper'>
                <NavigationContainer />
            </div>
            <div className='terms-page-wrapper'>
                <h1>Términos y Condiciones</h1>
                <p><strong>Última actualización: 01/02/9999</strong></p>

                <h2>1. Aceptación de los Términos</h2>
                <p>Al acceder y utilizar este sitio web, aceptas estar sujeto a estos Términos y Condiciones y a nuestra Política de Privacidad. Si no estás de acuerdo con alguno de estos términos, no debes usar este sitio.</p>

                <h2>2. Cambios en los Términos</h2>
                <p>Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Cualquier cambio será efectivo inmediatamente al ser publicado en esta página. Te recomendamos revisar esta sección periódicamente.</p>

                <h2>3. Uso del Sitio</h2>
                <p>Al utilizar este sitio, garantizas que tienes al menos 18 años o que tienes el consentimiento de un padre o tutor. No debes utilizar este sitio para fines ilegales o no autorizados.</p>

                <h2>4. Propiedad Intelectual</h2>
                <p>Todos los contenidos, características y funcionalidades del sitio, incluyendo pero no limitado a texto, gráficos, logotipos, iconos, imágenes, audio, video y software, son propiedad de [Nombre de tu Empresa] o sus licenciantes y están protegidos por leyes de derechos de autor, marcas registradas y otros derechos de propiedad intelectual.</p>

                <h2>5. Limitación de Responsabilidad</h2>
                <p>[Nombre de tu Empresa] no será responsable por daños directos, indirectos, incidentales, especiales o consecuentes que resulten del uso o la imposibilidad de usar el sitio, incluyendo pero no limitado a daños por pérdida de beneficios, datos o usos, incluso si se ha advertido sobre la posibilidad de tales daños.</p>

                <h2>6. Enlaces a Terceros</h2>
                <p>Este sitio puede contener enlaces a otros sitios web que no son propiedad ni están controlados por nosotros. No somos responsables del contenido, políticas de privacidad o prácticas de los sitios de terceros. Te recomendamos revisar los términos y condiciones y las políticas de privacidad de cada sitio que visites.</p>

                <h2>7. Legislación Aplicable</h2>
                <p>Estos Términos y Condiciones se regirán e interpretarán de acuerdo con las leyes de [Tu País/Estado], sin tener en cuenta sus disposiciones sobre conflictos de leyes.</p>

                <h2>8. Contacto</h2>
                <p>Si tienes alguna pregunta sobre estos Términos y Condiciones, contáctanos en:</p>
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

export default Terms;
