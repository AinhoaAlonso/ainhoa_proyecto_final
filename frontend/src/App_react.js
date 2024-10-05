//import "./style/main.scss";
import React, { Component } from 'react';
import{
    BrowserRouter as Router,
    Routes,
    Route
} from 'react-router-dom';

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


import {ProductCategory} from './components/products/product_category';

export default class App extends Component {
    constructor(props) {
        super(props);
        console.log("Instanciando componente App"); 
        Icons();
        
        this.state={
            loggedInStatus: "NOT LOGGED IN"
        }
        this.handleSuccessfulLogin = this.handleSuccessfulLogin.bind(this);
        this.handleUnSuccessfulLogin = this.handleUnSuccessfulLogin.bind(this);
    }
    handleSuccessfulLogin(){
        this.setState ({
          loggedInStatus: "LOGGED_IN"
        });
    }
    handleUnSuccessfulLogin(){
        this.setState({
          loggedInStatus : "NOT_LOGGED_IN"
        });
    }
    render(){
        
        return(
            <div className='container'>
                <div className='app-navigation-wrapper'>
                    {this.state.loggedInStatus}
                    <Router>
                        <div>
                            <Routes>
                                <Route path='/' element ={<Home/>} />
                                <Route 
                                path='/login' 
                                element={
                                    <Login 
                                        handleSuccessfulLogin = {this.handleSuccessfulLogin}
                                        handleUnSuccessfulLogin = {this.handleUnSuccessfulLogin}
                                    />} />
                                <Route path='/admin' element ={<Admin loggedInStatus={this.state.loggedInStatus}/>} />
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
                            
                        </div>
                    </Router>
                </div>
            </div>
        );
    }
}

