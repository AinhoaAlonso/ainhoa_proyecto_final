import React, { useState} from 'react';
import axios from 'axios';
import Footer from '../footer/footer';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEraser, faUserPen } from "@fortawesome/free-solid-svg-icons";

const UserForm = () => {
    const [name, setName] = useState('');
    const [lastnameOne, setLastnameOne] = useState('');
    const [lastnameTwo, setLastnameTwo] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 
    const [currentPassword, setCurrentPassword] = useState(''); 
    const [role, setRole] = useState('admin');
    const [isActive, setIsActive] = useState(true);
    const [userId, setUserId] = useState(null); 
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);

    const handleGetUsers = async () => {
        try {
            await axios.get('http://127.0.0.1:8000/users')
            .then(response =>{
                setUsers(response.data);
                if (response.data.length > 0) {
                    setCurrentIndex(0);
                    setUserData(response.data[0]);
                    setIsEditMode(true);
                }
            })
        }catch (error) {
            console.error('Error al traer los usuarios:', error);
        }
    };

    const setUserData = (user) => {
        setName(user.users_name || '');
        setLastnameOne(user.users_lastname_one || '');
        setLastnameTwo(user.users_lastname_two || '');
        setEmail(user.users_email || '');
        setCurrentPassword(user.users_password || ''); // Almacenar la contraseña actual
        setPassword(''); // Mantener vacío 
        setRole(user.users_role || 'admin');
        setIsActive(user.users_is_active || false);
        setUserId(user.users_id); 
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("users_name", name);
        formData.append("users_lastname_one", lastnameOne);
        formData.append("users_lastname_two", lastnameTwo);
        formData.append("users_email", email);
        formData.append("users_role", role);
        formData.append("users_is_active", isActive);

        for (let pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }

        if (password) {
            formData.append("users_password", password);
        } else {
            formData.append("users_password", currentPassword);
        }

        try {
            if (isEditMode && userId) { 
                formData.append("users_id", userId);
                await axios.put("http://127.0.0.1:8000/update/users", 
                    formData, 
                    { headers: { "Content-Type": "multipart/form-data" }}
                )
                .then(response =>{
                    setSuccessMessage('Usuario actualizado correctamente');
                    handleGetUsers();
                })
                .catch(error =>{
                    console.log("Usuario no actualizado", error);
                });
            } else {
                await axios.post("http://127.0.0.1:8000/insert/user", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                setSuccessMessage('Usuario creado correctamente');
                resetForm();
            }
        } catch (error) {
            setErrorMessage('Error al crear o actualizar el usuario. Por favor, intenta nuevamente.');
            console.error('Error:', error);
        }
    };

    const resetForm = () => {
        setName('');
        setLastnameOne('');
        setLastnameTwo('');
        setEmail('');
        setPassword('');
        setCurrentPassword('');
        setRole('admin');
        setIsActive(true);
        setUserId(null); 
        setErrorMessage('');
        setSuccessMessage('');
        setIsEditMode(false);
        setCurrentIndex(0);
    };

    const handleNextUser = () => {
        if (currentIndex < users.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setUserData(users[currentIndex + 1]);
        }
    };

    const handlePreviousUser = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setUserData(users[currentIndex - 1]);
        }
    };

    return (
        <div className="userform-container">
            <h1>Usuarios</h1>
            <div className='user-form-icon-wrapper'>
                <button className="action-icon" onClick={handleGetUsers}>
                    <FontAwesomeIcon icon={faUserPen} />
                </button>
                <button className="action-icon" onClick={resetForm}>
                    <FontAwesomeIcon icon={faEraser} />
                </button>
            </div>
            <form onSubmit={handleSubmit} className="userform">
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
                <div className="userform-data-wrapper">
                    <div className='userform-data-row-one'>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {isEditMode && (
                            <div className='userform-active'>
                                <h2>Usuario Activo</h2>
                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                />
                            </div>
                        )}
                    </div>
                    <div className='userform-data-row-two'>
                        <input
                            type="text"
                            placeholder="Primer Apellido"
                            value={lastnameOne}
                            onChange={(e) => setLastnameOne(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Segundo Apellido"
                            value={lastnameTwo}
                            onChange={(e) => setLastnameTwo(e.target.value)}
                        />
                    </div>
                    <div className='email-row'>
                        <input
                            type="email"
                            placeholder="Correo Electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Nueva Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {isEditMode && (
                        <div className="userform-navigation">
                            <button type="button" onClick={handlePreviousUser} disabled={currentIndex === 0}>
                                ← Anterior
                            </button>
                            <button type="button" onClick={handleNextUser} disabled={currentIndex === users.length - 1}>
                                Siguiente →
                            </button>
                        </div>
                    )}
                    <div>
                        <button className="save" type="submit">
                            {isEditMode ? 'Actualizar Usuario' : 'Guardar'}
                        </button>
                    </div>
                </div>
            </form>
            <div className="footer-wrapper">
                <Footer />
            </div>
        </div>
    );
};

export default UserForm;
