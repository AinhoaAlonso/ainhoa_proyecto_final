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
import UserForm from './components/users/user_form';
import Register from './pages/Register';
import Services from './pages/Services';
import Contact from './pages/Contact';
import AboutMe from './pages/About-me';
import Blog from './pages/Blog';
import Cart from './pages/Cart';
import Icons from './helpers/icons';
import ProductForm from './components/products/Product_form';
import BlogForm from './components/blog/blog_form';
import ProductDetails from './components/products/product_details';
import {ProductCategory} from './components/products/product_category';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';

class App extends Component {
    render() {
        Icons();
        const { loggedInStatus, userRole } = this.props; 

        return (
            <div className='container'>
                <div className='app-navigation-wrapper'>
                    <Router>
                        <div>
                            <Routes>
                                <Route path='/' element={<Home />} />
                                <Route
                                    path='/login' 
                                    element={loggedInStatus === "LOGGED_IN" && userRole === "admin" ? <Navigate to="/admin" /> : <Login />}
                                />
                                <Route 
                                    path='/admin' 
                                    element={
                                        loggedInStatus === "LOGGED_IN" ? (
                                            <Admin />
                                        ) : (
                                            <Navigate to="/login" />
                                        )
                                    }
                                />
                                <Route 
                                    path='/admin/product-form' 
                                    element={
                                        loggedInStatus === "LOGGED_IN" ? (
                                            <ProductForm />
                                        ) : (
                                            <Navigate to="/login" />
                                        )
                                    }
                                />
                                <Route 
                                    path='/admin/blog-form' 
                                    element={
                                        loggedInStatus === "LOGGED_IN" ? (
                                            <BlogForm />
                                        ) : (
                                            <Navigate to="/login" />
                                        )
                                    }
                                />
                                <Route 
                                    path='/admin/user-form' 
                                    element={
                                        loggedInStatus === "LOGGED_IN" ? (
                                            <UserForm />
                                        ) : (
                                            <Navigate to="/login" />
                                        )
                                    }
                                />
                                <Route path='/register' element={<Register />} />
                                <Route path='/about-me' element={<AboutMe />} />
                                <Route path='/services' element={<Services />} />
                                <Route path='/contact' element={<Contact />} />
                                <Route path='/blog' element={<Blog />} />
                                <Route path='/shop' element={<Shop />} />
                                <Route path='/product/:id' element={<ProductDetails />} />
                                <Route path='/cart' element={<Cart />} />
                                <Route path='/category/:categoryName' element={<ProductCategory />} />
                                <Route path='/politicadeprivacidad' element={<PrivacyPolicy />} />
                                <Route path='/terminosycondiciones' element={<Terms />} />
                            </Routes>
                        </div>
                        <div className='app-page-wrapper'>
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
