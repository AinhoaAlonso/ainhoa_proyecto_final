import React, {Component} from "react";
import NavigationContainer from "../components/navigation/navigation_container";
import axios from "axios";
import parse from 'html-react-parser';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsLeftRight } from "@fortawesome/free-solid-svg-icons";
import Footer from "../components/footer/footer";


export default class Blog extends Component{
    constructor(props){
        super(props);

        this.state ={
            title: "",
            image_url:"",
            content:"",
            author:"",
            date:"",
            users_id:"",
            posts:[],
            editPostId: null
        }
    }
    componentDidMount() {
        axios.get("https://tucasaorganizada-backend-6ca489a38407.herokuapp.com/posts")
        .then(response =>{
            console.log("Traer los posts", response.data);
            this.setState({
                posts:response.data
            }, () =>{
                console.log(" Posts desde get",this.state.posts);
            });
            return response.data;
        })
        .catch(error=>{
            console.log("Error al traer los posts", error);
        });
    }

    render(){
        console.log("Props en Blog:", this.props);
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); 
            const year = date.getFullYear();

            return `${day}/${month}/${year}`;
        };

        return(
            <div className="blog-container">
                <NavigationContainer />
                <div className="blog-wrapper">
                    <div className="page-blog-wrapper">
                        {this.state.posts.length > 0 ? (
                            this.state.posts.map(post => (
                                <div key={post.posts_id}>
                                    <div className="blog-title">
                                        <h2>{post.posts_title}</h2>
                                    </div>
                                    <div className="blog-image">
                                        <img src={post.posts_image_url} alt={post.posts_title} />
                                    </div>
                                    <div className="blog-row-wrapper">
                                        <div className="blog-date">
                                            {formatDate(post.posts_date)}
                                        </div>
                                        <div className="blog-author">
                                            {post.posts_author}
                                        </div>
                                    </div>
                                    <div className="blog-content">
                                        <p>{parse(post.posts_content)}</p>
                                    </div>
                                    <div className="arrow">
                                        <FontAwesomeIcon icon={faArrowsLeftRight} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No hay posts disponibles.</p> 
                        )}
                    </div>
                </div>
                <div className="footer-wrapper">
                    <Footer />
                </div>
            </div>
        );
    }
}
