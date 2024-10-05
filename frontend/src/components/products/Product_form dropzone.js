import React, {Component} from "react";
import DropzoneComponent from 'react-dropzone-component';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

//Para que funcione dropzone necesitamos importar otra biblioteca
import "../../../node_modules/react-dropzone-component/styles/filepicker.css";
import "../../../node_modules/dropzone/dist/min/dropzone.min.css";

export default class ProductForm extends Component{
    constructor(props){
        super(props);

        this.state ={
            name:"",
            description:"",
            price:"",
            image_url:"",
            stock:"",
            category:"Limpieza",
            editMode: false,
            products:[],
            editProductId: null
        }
        this.handleChangeProduct = this.handleChangeProduct.bind(this);
        this.handleSubmitProductForm = this.handleSubmitProductForm.bind(this);
        this.handleGetProducts = this.handleGetProducts.bind(this);

        this.componentConfig = this.componentConfig.bind(this);
        this.djsConfig = this.djsConfig.bind(this);
        this.handleImageUpload = this.handleImageUpload.bind(this);
        this.handleEditClickProduct = this.handleEditClickProduct.bind(this);

        
        this.imageRef = React.createRef();
    }
    componentDidMount(){
        this.handleGetProducts();
    }

    handleGetProducts(){
        axios.get("http://127.0.0.1:8000/products")
        .then(response =>{
            console.log("Traer los productos", response.data);
            this.setState({
                products:response.data
            }, () =>{
                console.log("Productos desde get",this.state.products);
            });
            return response.data
        })
        .catch(error=>{
            console.log("Error al traer los posts", error);
        });
        
    }

    //Dropzone
    componentConfig(){
        return{
            iconFileTypes: [".jpg", "png"],
            showFiletypeIcon: true,
            postUrl: "http://127.0.0.1:8000/insert/products"
            
        }
    }
    djsConfig(){
        return{
            addRemoveLinks: true,
            maxFiles:1
        }
    }
    handleImageUpload(){
        return {
            addedfile: async (file) => {
                console.log("Archivo agregado:", file);
                // Llamar a la función para subir el archivo
                const imageUrl = await this.uploadImageToImageBB(file);
                console.log(imageUrl);
                if (imageUrl) {
                    this.setState({ image_url: imageUrl }); // Guardar la URL de la imagen en el estado
                } else {
                    console.error("Error al obtener la URL de la imagen de ImgBB");
                }
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
    handleEditClickProduct(product){
        this.setState({
            name: product.products_name,
            description: product.products_description,
            price: product.products_price,
            image_url: product.products_image_url,
            stock: product.products_stock,
            category:"Limpieza",
            editProductId: product.products_id
        })
    }

    async handleSubmitProductForm(event){

        event.preventDefault();
        let imageUrl = "";

        // Si hay una imagen, subirla a ImageBB
        console.log("State Image_url",this.state.image_url);
        console.log(imageUrl);
        if (this.state.image_url) {
            imageUrl = await this.uploadImageToImageBB(this.state.image_url);
            console.log("URL de la imagen:", imageUrl);
        }

        let formData = new FormData();

        formData.append("products_name", this.state.name);
        formData.append("products_description", this.state.description);
        formData.append("products_price", this.state.price);
        formData.append("products_stock", this.state.stock);
        formData.append("products_category", this.state.category);

        // Añadir la URL de la imagen al formulario
        if (imageUrl) {
            formData.append("products_image_url", imageUrl);
        }
        
        if(this.state.editProductId){
            formData.append("products_id", this.state.editProductId);
            axios.put("http://127.0.0.1:8000/update/products",
                formData,
                {headers:{"Content-Type": "multipart/form-data"}}
            )
            .then(response =>{
                console.log("Producto actualizado", response);
                this.handleGetProducts(); 
                this.resetForm(); 
            })
            .catch(error =>{
                console.log("Error al actualizar el producto", error);
            });
        } else {
            axios.post("http://127.0.0.1:8000/insert/products",
                formData,
                {headers:{"Content-Type": "multipart/form-data"}}
            )
            .then(response =>{
                console.log("Producto guardado con exito", response);
                if (response && response.status === 200) {
                    this.setState({
                        name:"",
                        description:"",
                        price:"",
                        image_url:"",
                        stock:"",
                        category:"Limpieza",
                        editMode: false
                    })
                    if (this.imageRef.current) {
                        this.imageRef.current.dropzone.removeAllFiles();
                    }
                }else {
                    console.error("Respuesta inesperada del servidor", response);
                }
            })
            .catch(error=>{
                console.log("Error al guardar el producto", error);
                // Verifica si `error.response` existe antes de intentar acceder a `status`
                if (error.response) {
                    console.error("Error status:", error.response.status);
                    console.error("Error data:", error.response.data);
                } else if (error.request) {
                    // El servidor no respondió (por ejemplo, problema de red o de CORS)
                    console.error("No se recibió respuesta del servidor", error.request);
                } else {
                    // Algo más causó el error
                    console.error("Error", error.message);
                }
            });
        }
    }

    handleChangeProduct(event){
        console.log("handleChangeProduct", event);
        this.setState({
            [event.target.name] : event.target.value
        });
    }

    handleDeleteClickProduct(product){
        console.log("handleDeleteClickProduct", product.products_id);
        axios.delete(`http://127.0.0.1:8000/delete/products/${product.products_id}`)

        .then(response =>{
            console.log("handleDeleteClickProduct", response);
            this.setState({
                products: this.state.products.filter (itemproduct => {
                    return itemproduct.products_id !== product.products_id;
                })
            })

        })
        .catch(error =>{
            console.log("Error al eliminar el producto", error);
        })
    }

    resetForm() {
        this.setState({
            name:"",
            description:"",
            price:"",
            image_url:"",
            stock:"",
            category:"Limpieza",
            editProductId: null
        });
    }

    renderProducts() {
        const reversedProducts = [...this.state.products].reverse();

        return reversedProducts.map((product) => (
            <div key={product.products_id} className="products-item">
                <div className="product-item-left">
                    <h2>{product.products_name}</h2>
                    <img src={product.products_image_url} alt={product.products_name} />
                    <p><strong>Precio:</strong> {product.products_price}</p>
                    <p><strong>Stock:</strong> {product.products_stock}</p>
                </div>
                <div className="product-item-right">
                    <button className="action-icon" onClick={() =>this.handleEditClickProduct(product)}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button className="action-icon" onClick={() => this.handleDeleteClickProduct(product)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            </div>
        ));
    }

    componentDidUpdate(prevProps, prevState) {
        // Puedes realizar acciones aquí si es necesario
        if (prevState.products !== this.state.products) {
            console.log("Los productos han cambiado:", this.state.products);
        }
    }
    
    render(){
        return(
            <div className="product-form-container">
                <div className="product-form-left-side-wrapper">
                    <h1>Formulario para añadir productos</h1>
                    <form  onSubmit={this.handleSubmitProductForm}>
                        <div className="form-data-wrapper">
                            <div className="form-data-row">
                                <input 
                                    type="text" 
                                    name="name" 
                                    placeholder="Producto"
                                    value={this.state.name}
                                    onChange={this.handleChangeProduct}
                                ></input>
                                <select name="category" value={this.state.category} onChange={this.handleChangeProduct}>
                                    <option value = "Limpieza">Limpieza</option>
                                    <option value = "Organización">Organización</option>
                                </select>
                            </div>
                            <div className="form-data">
                                <textarea 
                                    type="text"
                                    name="description" 
                                    placeholder="Descripcion del producto"
                                    value={this.state.description}
                                    onChange={this.handleChangeProduct}
                                />
                                <div className="form-number-wrapper">
                                    <input 
                                        type="number"
                                        name="price" 
                                        placeholder="Precio"
                                        value={this.state.price}
                                        onChange={this.handleChangeProduct}
                                    ></input>
                                        <input 
                                        type="number"
                                        name="stock" 
                                        placeholder="Stock"
                                        value={this.state.stock}
                                        onChange={this.handleChangeProduct}
                                    ></input>
                                </div>
                                <div className="image-uploaders">
                                    <DropzoneComponent
                                        ref = {this.imageRef}
                                        config={this.componentConfig()}
                                        djsConfig={this.djsConfig()}
                                        eventHandlers={this.handleImageUpload()}
                                            //addedfile: this.handleImageUpload,
                                            //removedfile: this.handleImageRemove
                                        
                                    >
                                        <div className="dz-message">Arrastra y suelta una imagen aquí o haz clic para seleccionar</div>
                                    </DropzoneComponent>
                                </div>
                                <div>
                                    <button type="submit">Guardar</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="product-form-right-side-wrapper">
                    <h1>Productos Actuales</h1>
                    {this.renderProducts()}
                </div> 
            </div>
        );
    }
}
