// App.js
import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';
import { connect } from 'react-redux'; // Importa connect

import Login from './pages/Login';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Shop from './pages/Shop';
import UserData from './pages/UserData';
import Register from './pages/Register';
import Services from './pages/Services';
import Contact from './pages/Contact';
import AboutMe from './pages/About-me';
import Blog from './pages/Blog';
import Cart from './pages/Cart';
import Icons from './helpers/icons';
import ProductForm from './components/products/Product_form';
import BlogForm from './components/blog/blog_form';

import {ProductCategory} from './components/products/product_category';

class App extends Component {
    render() {
        Icons();
        const { loggedInStatus, userRole } = this.props; // Obtén el estado de Redux

        return (
            <div className='container'>
                <div className='app-navigation-wrapper'>
                    {loggedInStatus}
                    <Router>
                        <div>
                            <Routes>
                                <Route path='/' element={<Home />} />
                                <Route 
                                    path='/login' 
                                    element={loggedInStatus === "LOGGED_IN" && userRole === "admin" ? <Navigate to="/admin" /> : <Login />}
                                />
                                <Route path='/admin' element={<Admin />} />
                                <Route path='/admin/product-form' element={<ProductForm />} />
                                <Route path='/admin/blog-form' element={<BlogForm />} />
                                <Route path='/userdata' element={<UserData />} />
                                <Route path='/register' element={<Register />} />
                                <Route path='/about-me' element={<AboutMe />} />
                                <Route path='/services' element={<Services />} />
                                <Route path='/contact' element={<Contact />} />
                                <Route path='/blog' element={<Blog />} />
                                <Route path='/shop' element={<Shop />} />
                                <Route path='/cart' element={<Cart />} />
                                <Route path='/category/:categoryName' element={<ProductCategory />} />
                            </Routes>
                        </div>
                        <div className='app-page-wrapper'>
                            {/* Contenido adicional aquí */}
                        </div>
                    </Router>
                </div>
            </div>
        );
    }
}

// Mapea el estado de Redux a las props
const mapStateToProps = (state) => ({
    loggedInStatus: state.auth.loggedInStatus,
    userRole: state.auth.userRole,
});

// Conecta el componente a Redux
export default connect(mapStateToProps)(App);
