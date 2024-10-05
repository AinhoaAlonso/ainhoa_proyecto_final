import React, {Component} from "react";
import NavigationContainer from "../components/navigation/navigation_container";
import axios from "axios";
import parse from 'html-react-parser';


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
        axios.get("http://127.0.0.1:8000/posts")
        .then(response =>{
            console.log("Traer los posts", response.data);
            this.setState({
                posts:response.data
            }, () =>{
                console.log(" Posts desde get",this.state.posts);
                //this.props.getPosts(this.state.posts);
            });
            return response.data;
        })
        .catch(error=>{
            console.log("Error al traer los posts", error);
        });
    }

    render(){
        console.log("Props en Blog:", this.props);
        return(
            <div className="blog-container">
                <NavigationContainer />
                <div>
                    {this.state.posts.length > 0 ? (
                        this.state.posts.map(post => (
                            <div key={post.posts_id}>
                                <h2>{post.posts_title}</h2>
                                <p>{parse(post.posts_content)}</p>
                            </div>
                        ))
                    ) : (
                        <p>No hay posts disponibles.</p> 
                    )}
                </div>
            </div>
        );
    }
}
