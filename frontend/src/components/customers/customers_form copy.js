import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { faMoneyBillTransfer } from '@fortawesome/free-solid-svg-icons';


const CustomersForm = ({ onSubmit, cartItems, total }) => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [provinces, setProvinces] = useState([]);
    const [customerData, setCustomerData] = useState({
        name: '',
        surname: '',
        addressOne: '',
        addressTwo: '',
        province_cod:'',
        postal_code: '',
        email: '',
        phone: ''
    });

    useEffect(() =>{
        const handleGetProvinces = async () =>{
            axios.get("http://127.0.0.1:8000/provinces")
            .then (response =>{
                setProvinces(response.data);
            })
            .catch (error =>{
                console.log("Error al traer las provincias", error);
            })
        }
        handleGetProvinces();
    }, []);

    const handlePaymentChange = (event) => {
        setSelectedPaymentMethod(event.target.value);
    };

    const handleInsertCustomers = (event) => {
        const { name, value } = event.target;
        setCustomerData((prevCustomerData) => ({
            ...prevCustomerData,
            [name]: value
        }));
    };

    const handleSubmitCustomersForm = (event) => {
        event.preventDefault();

        console.log("Datos Cientes", customerData);
        //Insertamos clientes y guardamos el id para meterlo en orderproducts
        axios.post("http://127.0.0.1:8000/insert/customers",{
            customers_name: customerData.name,
            customers_surname: customerData.surname,
            customers_address_one: customerData.addressOne,
            customers_address_two: customerData.addressTwo,
            customers_email: customerData.email,
            customers_phone: customerData.phone,
            customers_provinces_cod: customerData.province_cod, 
            customers_cp: customerData.postal_code 
        })
        .then(response =>{
            const customerId = response.data.customers_id;

            //Cuando haga eso crea inserta el pedido con el customers_id
            return axios.post("http://127.0.0.1:8000/insert/orders",{
                orders_date: new Date().toISOString().slice(0, 10), // Fecha actual en formato YYYY-MM-DD
                orders_total: total,
                orders_number: `ORD-${Date.now()}`, 
                orders_customers_id: customerId
            });

        })
        .then(response =>{
            const orderId = response.data.orders_id;

            // Actualizamos el stock para cada producto
            const stockPromises = cartItems.map(item => {
                const stockToUpdate = item.products_stock - item.quantity; 

                // Envio el ID del producto y tambien el stock com parametro de la consulta
                return axios.put(`http://127.0.0.1:8000/update/products/${item.products_id}`, null, {
                    params: {
                        products_stock: stockToUpdate
                    }
                })
                .then(stockResponse => {
                    console.log(`Stock actualizado para el producto ID ${item.products_id}:`, stockResponse.data);
                })
                .catch(error => {
                    console.error(`Error al actualizar stock para el producto ID ${item.products_id}:`, error);
                    throw error; 
                });
            });
   
            // Ejecutar todas las solicitudes de actualización de stock en paralelo
            return Promise.all(stockPromises)
                .then(() => {

                    //Creamos los productos del pedido para enviar a la base de datos
                    const productPromises = cartItems.map(item =>
                    axios.post('http://127.0.0.1:8000/insert/orderproducts', {
                        orderproducts_name: item.products_name,
                        orderproducts_quantity: item.quantity,
                        orderproducts_price: item.products_price,
                        orderproducts_subtotal: (item.products_price * item.quantity).toFixed(2),
                        orderproducts_orders_id: orderId,
                        orderproducts_products_id: item.products_id
                    })
                );
                // Ejecutar todas las solicitudes de productos en paralelo
                return Promise.all(productPromises);
            })
        })
        .then(() => {
            // Enviar los datos finales al backend si es necesario
            onSubmit("Compra realizada con éxito");
        })
        .catch(error => {
            console.error('Error al enviar los datos:', error);
            alert('Error al procesar la compra');
        });
    };

    return (
        <div className='customers-form-container'>
            <div className='left-side-wrapper'>
                <h1>Facturación y envío</h1>
                <div className='customers-data-wrapper'>
                    <form onSubmit={handleSubmitCustomersForm}>
                        <div className='form-data-row'>
                            <div className='name-field'>
                                <label htmlFor="name">Nombre</label>
                                <input id="name" name="name" onChange={handleInsertCustomers} required />
                            </div>
                            <div className='surname-field'>
                                <label htmlFor="surname">Apellidos</label>
                                <input id="surname" name="surname" onChange={handleInsertCustomers} required />
                            </div>
                        </div>
                        <div className='form-data'>
                            <label htmlFor="addressOne">Dirección</label>
                            <input id="addressOne" name="addressOne" onChange={handleInsertCustomers} required />
                        </div>
                        <div className='form-data'>
                            <label htmlFor="addressTwo">Dirección 2</label>
                            <input id="addressTwo" name="addressTwo" onChange={handleInsertCustomers} />
                        </div>
                        <div className='form-data'>
                            <label htmlFor="province">Provincia</label>
                            <select 
                                id="province" 
                                name="province_cod" 
                                onChange={handleInsertCustomers} 
                                required
                            >
                                <option value="">Selecciona una provincia</option>
                                {provinces.map(province => (
                                    <option key={province.provinces_cod} value={province.provinces_cod}>
                                        {province.provinces_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='form-data'>
                            <label htmlFor="postal_code">Código Postal</label>
                            <input 
                                id="postal_code" 
                                name="postal_code" 
                                type="text" 
                                maxLength="5" // Limitar a 5 caracteres
                                pattern="\d{5}" // Solo permitir dígitos
                                onChange={handleInsertCustomers} 
                                required 
                            />
                        </div>
                        <div className='form-data'>
                            <label htmlFor="email">Dirección de correo electrónico</label>
                            <input id="email" name="email" type="email" onChange={handleInsertCustomers} required />
                        </div>
                        <div className='form-data'>
                            <label htmlFor="phone">Teléfono</label>
                            <input id="phone" name="phone"  onChange={handleInsertCustomers} required />
                        </div>
                        <div className='btn-customers-form'>
                            <button type="submit">Realizar Pedido</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className='right-side-wrapper'>
                <h1>Pedido</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item, index) => (
                            <tr key={`${item.products_id}-${index}`}>
                                <td>{item.products_name} x {item.quantity}</td>
                                <td>{(item.products_price * item.quantity).toFixed(2)}€</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className='totals-wrapper'>
                    <div className='titles'>
                        <h2>Subtotal</h2>
                        <h2>Total</h2>
                    </div>
                    <div className='totals'>
                        <h2>{total}€</h2>
                        <h2>{total}€ <span>(Incluye el 21% de IVA)</span> </h2>
                    </div>
                </div>
                <div className='pay-wrapper'>
                    <h2>Selecciona tu método de Pago</h2>
                    <div className='creditcard-pay'>
                        <label>
                            <input 
                                type="radio" 
                                value="credit_card" 
                                checked={selectedPaymentMethod === "credit_card"} 
                                onChange={handlePaymentChange} 
                            />
                                Tarjeta de Crédito
                        </label>
                            <h2><FontAwesomeIcon icon={faCreditCard} /></h2>
                    </div>
                    <div className='transfer-pay'>
                        <label>
                            <input 
                                type="radio" 
                                value="transfer" 
                                checked={selectedPaymentMethod === "transer"} 
                                onChange={handlePaymentChange} 
                            />
                                Transferencia Bancaria
                        </label>
                            <h2><FontAwesomeIcon icon={faMoneyBillTransfer}/></h2>
                    </div>
                    <div className='privacity-wrapper'>
                        <p>Tus datos personales se utilizarán para procesar tu pedido y otros propósitos descritos en nuestra política de privacidad.</p>
                        <label>
                            <input type="checkbox" name="terms-field" value="1" required /> {/* El campo checkbox */}
                                He leído y estoy de acuerdo con los términos y condiciones de la web *
                            </label>
                    </div>
                </div>
            </div>
         </div>
    );
};

export default CustomersForm;
