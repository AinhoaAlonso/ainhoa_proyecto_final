import React, {Component} from "react";
import DropzoneComponent from 'react-dropzone-component';
import axios from "axios";
import { connect } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import RichEditorText from "../text_editor/rich_text_editor";
//import Blog from "../../pages/Blog";

import "../../../node_modules/react-dropzone-component/styles/filepicker.css";
import "../../../node_modules/dropzone/dist/min/dropzone.min.css";

class BlogForm extends Component{
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
            editPostId: null,
            editMode:false
        }
        this.handleSubmitBlogForm = this.handleSubmitBlogForm.bind(this);
        this.handleChangePost = this.handleChangePost.bind(this);
        this.handleGetPosts = this.handleGetPosts.bind(this);

        this.componentConfig = this.componentConfig.bind(this);
        this.djsConfig = this.djsConfig.bind(this);
        this.handleImagePostUpload = this.handleImagePostUpload.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleRichTextEditor = this.handleRichTextEditor.bind(this);

        this.imageRef = React.createRef();
    }

    componentDidMount(){

        if (!this.props.userEmail) {
            console.log("userEmail no está disponible aún.");
            return; // Evitar que se ejecute el resto del código
        }
    
        console.log("userEmail", this.props.userEmail);

        /*if (prevProps.userEmail !== this.props.userEmail) {
            console.log("userEmail ha cambiado:", this.props.userEmail);
        }*/

        if (this.props.userEmail) {
            axios.get("http://127.0.0.1:8000/users")
                .then(response =>{
                console.log("Usuarios:", response.data);
                const user = response.data.find(user => user.users_email === this.props.userEmail);
                    if(user){
                            this.setState({
                                users_id: user.users_id
                            });
                    }
                })
                .catch(error =>{
                    console.log("No se ha podidos extraer el users_id", error);
                });
        }
        this.handleGetPosts();
    }
    handleGetPosts(){
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
    handleRichTextEditor(content){
        this.setState({
            content

        });
    }
    
    //Dropzone
    componentConfig(){
        return{
            iconFileTypes: [".jpg", "png"],
            showFiletypeIcon: true,
            postUrl: "http://127.0.0.1:8000/insert/posts"
            
        }
    }
    djsConfig(){
        return{
            addRemoveLinks: true,
            maxFiles:1,
        }
    }
    handleImagePostUpload(){
        return {
            addedfile: async (file) => {
                //console.log("Archivo agregado:", file);
                // Llamar a la función para subir el archivo
                const imageUrl = await this.uploadImageToImageBB(file);
                console.log(imageUrl);
                if (imageUrl) {
                    this.setState({ image_url: imageUrl }); // Guardar la URL de la imagen en el estado
                    file.status = "success"; // Cambia el estado del archivo a 'success'
                } else {
                    console.error("Error al obtener la URL de la imagen de ImgBB");
                }
                console.log("Estado del archivo después de la carga:", file.status);
            },
            removedfile: (file) => {
                this.setState({ image_url: "" }); // Limpiar el estado si el archivo es eliminado
            }
        }; 
    }
    async uploadImageToImageBB(imageFile) {
        const apiKey = '0f491d8d00ee1bbd4f39764f40db5031'; //Api key de imgBB
        
        let formData = new FormData();
        formData.append('image', imageFile);
        console.log("uploadImageToImageBB",imageFile);

        try {
            const response = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData);
            console.log("Respuesta de ImgBB:", response.data); // Log de la respuesta completa
    
            // Verificar si hay una URL disponible en la respuesta
            if (response.data && response.data.data && response.data.data.url) {
                return response.data.data.url; // Devuelve la URL de la imagen
            } else {
                throw new Error("URL de la imagen no disponible");
            }
        }catch(error){
            console.log("Error al subir la imagen al servidor imgbb:", error);
            return null;
        };
    };

    async handleSubmitBlogForm(event){
        event.preventDefault();
        let imageUrl = "";

        //console.log("handleGetPosts en BlogForm:", this.handleGetPosts);

        // Si hay una imagen, subirla a ImageBB
        console.log("State Image_url",this.state.image_url);
        console.log(imageUrl);
        if (this.state.image_url) {
            imageUrl = await this.uploadImageToImageBB(this.state.image_url);
            console.log("URL de la imagen:", imageUrl);
        }

        if (!this.state.users_id) {
            console.log("El users_id no está disponible aún.");
            return; // Evita que el formulario se envíe sin el users_id
        }

        let formData = new FormData();

        formData.append("posts_title", this.state.title);
        formData.append("posts_author", this.state.author);
        formData.append("posts_content", this.state.content);
        formData.append("posts_date", this.state.date);
        formData.append("posts_users_id", this.state.users_id);
        
        if (imageUrl) {
            formData.append("posts_image_url", imageUrl);
        };

        if(this.state.editPostId){
            
            formData.append("posts_id", this.state.editPostId);

            axios.put("http://127.0.0.1:8000/update/posts",
                formData,
                {headers:{"Content-Type": "multipart/form-data"}}
            )
            .then(response =>{
                console.log("Post actualizado", response);
                this.handleGetPosts(); 
                this.resetForm(); 
            })
            .catch(error =>{
                console.log("Error al actualizar el post", error);
            });
        } else{
            axios.post("http://127.0.0.1:8000/insert/posts",
                formData,
                {headers:{"Content-Type": "multipart/form-data"}}
            )
            .then(response =>{
                console.log("Post Insertado", response);
                this.handleGetPosts(); 
                this.resetForm(); 
               
                if (this.imageRef.current) {
                    this.imageRef.current.dropzone.removeAllFiles();
                }
            })
            .catch(error =>{
                console.log("Error al guardar el post", error);
            })
        } 
    }
    handleChangePost(event){
        console.log("handleChangePost", event);
        this.setState({
            [event.target.name] : event.target.value
        });
    }
    handleEditClick(post){
        this.setState({
            title: post.posts_title,
            author: post.posts_author,
            date: post.posts_date,
            content: post.posts_content,
            image_url: post.posts_image_url,
            editPostId: post.posts_id,
            editMode:true
        //}, () =>{
            //this.handleRichTextEditor(post.posts_content);
        });
    }
    handleDeleteClick(post){
        console.log("handleDeleteClick", post.posts_id);
        
        //console.log("Posts:", JSON.stringify(this.state.posts, null, 2));


        axios.delete(`http://127.0.0.1:8000/delete/posts/${post.posts_id}`)

        .then(response =>{
            console.log("handleDeleteClick", response);
            //console.log(this.state.posts);
            this.setState({
                posts: this.state.posts.filter (itempost => {
                    return itempost.posts_id !== post.posts_id;
                })
            })

        })
        .catch(error =>{
            console.log("Error al eliminar el post", error);
        })
    }

    resetForm() {
        this.setState({
            title: "",
            author: "",
            date: "",
            content: "",
            image_url: "",
            editingPostId: null 
        });
    }
    renderPosts() {
        const reversedPosts = [...this.state.posts].reverse();
        
        return reversedPosts.map((post) => (
            <div key={post.posts_id} className="post-item">
                <div className="post-item-left">
                    <h2>{post.posts_title}</h2>
                    <img src={post.posts_image_url} alt={post.posts_title} />
                    <p><strong>Autor:</strong> {post.posts_author}</p>
                    <p><strong>Fecha:</strong> {post.posts_date}</p>
                </div>
                <div className="post-item-right">
                    <button className="action-icon" onClick={() =>this.handleEditClick(post)}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button className="action-icon" onClick={() => this.handleDeleteClick(post)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
                
            </div>
        ));
    }
    render(){
        console.log("Estado actual:", this.state);
        console.log("Props actuales:", this.props);

        if (!this.props.userEmail) {
            return <div>Cargando...</div>;
        }
        return(
            <div className="blogform-container">
                {/*<Blog handleGetPosts={this.handleGetPosts} />*/}
                <div className="blogform-left-side-wrapper">
                    <h1>{this.state.editPostId ? "Editar Post" : "Nuevo Post"}</h1>
                    <form onSubmit={this.handleSubmitBlogForm}>
                        <div className="blogform-data-wrapper">
                            <div className="blogform-data-row">
                                <input 
                                    type="text" 
                                    name="title" 
                                    placeholder="Título del post"
                                    value={this.state.title}
                                    onChange={this.handleChangePost}
                                ></input>
                                <input 
                                    type="text" 
                                    name="author" 
                                    placeholder="Autor"
                                    value={this.state.author}
                                    onChange={this.handleChangePost}
                                ></input>
                                <input 
                                    type="date" 
                                    name="date" 
                                    placeholder="Fecha"
                                    value={this.state.date}
                                    onChange={this.handleChangePost}
                                ></input>
                            </div>
                            <div className="blogform-data">
                                <RichEditorText 
                                    handleRichTextEditor = {this.handleRichTextEditor}
                                    editMode = {this.state.editMode}
                                    //content = {this.state.content}
                                    contentToEdit = {
                                        this.state.editMode && this.state.content ?
                                            this.state.content : null
                                    }
                                />    
                                {/*<textarea 
                                    type="text"
                                    name="content" 
                                    placeholder="Contenido del post"
                                    value={this.state.content}
                                    onChange={this.handleChangePost}
                                />*/}
                                
                            </div>
                            <div className="image-uploaders">
                                <DropzoneComponent
                                    ref = {this.imageRef}
                                    config={this.componentConfig()}
                                    djsConfig={this.djsConfig()}
                                    eventHandlers={this.handleImagePostUpload()}
                                >
                                    <div className="dz-message">Arrastra y suelta una imagen aquí o haz clic para seleccionar</div>
                                </DropzoneComponent>
                            </div>
                            <div>
                                <button type="submit">{this.state.editPostId ? "Actualizar" : "Guardar"}</button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="blogform-right-side-wrapper">
                    <h1>Posts Actuales</h1>
                    {this.renderPosts()}
                </div>
            </div>
        );

    }
}
const mapStateToProps = (state) => {
    console.log("Estado de Redux:", state);
    return {
        userEmail: state.auth.userEmail,
    };
};

export default connect(mapStateToProps)(BlogForm);