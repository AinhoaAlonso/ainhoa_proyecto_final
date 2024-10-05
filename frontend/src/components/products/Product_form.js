import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone"; // Importa useDropzone de react-dropzone
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";

import "../../../node_modules/dropzone/dist/min/dropzone.min.css";

const ProductForm = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [image_url, setImageUrl] = useState(null);
    const [stock, setStock] = useState("");
    const [category, setCategory] = useState("Limpieza");
    const [editMode, setEditMode] = useState(false);
    const [products, setProducts] = useState([]);
    const [editProductId, setEditProductId] = useState(null);
    const [files, setFiles] = useState([]); // Mantén un estado para los archivos
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();

    const handleDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            //const newProduct = { name: acceptedFiles[0].name };
            const file = acceptedFiles[0];
            setFiles(acceptedFiles); // Actualiza el estado con los archivos aceptados
            setImagePreview(URL.createObjectURL(file));
            uploadImageToImageBB(file);
            //uploadImageToImageBB(acceptedFiles[0]); // Sube solo el primer archivo
            //setProducts((prevProducts) => [...prevProducts, newProduct]);
        } else {
            console.warn("No se aceptaron archivos."); // Agrega un mensaje de advertencia si no hay archivos aceptados
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDrop,
        accept: {
            'image/*': [] // Acepta solo archivos de imagen
        },
        onDropRejected: (rejectedFiles) => {
            console.warn("Archivos rechazados:", rejectedFiles);
        }
    });

    const handleRemoveImage = () => {
        setFiles(null); // Restablece el archivo
        setImagePreview(null); // Restablece la vista previa
        setImageUrl(null); // Borra la URL de la imagen
    };

    useEffect(() => {
        handleGetProducts();
    }, [])

    const handleGetProducts = () => {
        axios.get("http://127.0.0.1:8000/products")
            .then(response => {
                console.log("Traer los productos", response.data);
                setProducts(response.data);
            })
            .catch(error => {
                console.log("Error al traer los productos", error);
            });
    };

    const uploadImageToImageBB = async (imageFile) => {
        const apiKey = '0f491d8d00ee1bbd4f39764f40db5031'; // Api key de imgBB
        let formData = new FormData();
        formData.append('image', imageFile);

        try {
            const response = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData);
            console.log("Respuesta de ImgBB:", response.data); // Log de la respuesta completa
            if (response.data && response.data.data && response.data.data.url) {
                setImageUrl(response.data.data.url); // Guarda la URL de la imagen
            } else {
                throw new Error("URL de la imagen no disponible");
            }
        } catch (error) {
            console.log("Error al subir la imagen al servidor imgbb:", error);
        }
    };

    const handleEditClickProduct = (product) => {
        console.log("handleEditClickProduct", product);
        setName(product.products_name);
        setDescription(product.products_description);
        setPrice(product.products_price);
        setImageUrl(product.products_image_url);
        setStock(product.products_stock);
        setCategory("Limpieza");
        setEditProductId(product.products_id);
        setFiles([]); // Reinicia el estado de archivos al editar
        setImagePreview(product.products_image_url);
    };

    const handleSubmitProductForm = async (event) => {
        event.preventDefault();

        let formData = new FormData();
        
        formData.append("products_name", name);
        formData.append("products_description", description);
        formData.append("products_price", price);
        formData.append("products_stock", stock);
        formData.append("products_category", category);
        formData.append("products_image_url", image_url);


        if (editProductId) {
            formData.append("products_id", editProductId);

            axios.put("http://127.0.0.1:8000/update/products", formData, { headers: { "Content-Type": "multipart/form-data" } })
                .then(response => {
                    console.log("Producto actualizado", response);
                    // Actualiza el estado de products con el producto editado
                    setProducts((prevProducts) => {
                        const updatedProduct = {
                            products_id: editProductId,
                            products_name: name,
                            products_description: description,
                            products_price: price,
                            products_stock: stock,
                            products_image_url: image_url,
                        };

                        // Filtra el producto editado y lo agrega al principio del array
                        const filteredProducts = prevProducts.filter(product => product.products_id !== editProductId);
                        return [updatedProduct, ...filteredProducts];
                    });

                    resetForm();
                })
                .catch(error => {
                    console.log("Error al actualizar el producto", error);
                });
        } else {
            console.log("productos", products);
            
            for (let pair of formData.entries()) {
                console.log("formadata", pair[0] + ': ' + pair[1]);
            }
            //console.log(name,description,category,price,stock,image_url);
            axios.post("http://127.0.0.1:8000/insert/products", formData, { headers: { "Content-Type": "multipart/form-data" } })
                .then(response => {
                    console.log("Respuesta insert product", response);
                    //console.log("Producto guardado con éxito", response);
                    if (response && response.status === 200) {
                        resetForm();
                        setFiles([]);
                    } else {
                        console.error("Respuesta inesperada del servidor", response);
                    }
                })
                .catch(error => {
                    console.log("Error al guardar el producto", error);
                });
        }
    };

    const handleDeleteClickProduct = (product) => {
        axios.delete(`http://127.0.0.1:8000/delete/products/${product.products_id}`)
            .then(response => {
                console.log("handleDeleteClickProduct", response);
                setProducts(prevProducts => prevProducts.filter(itemProduct => itemProduct.products_id !== product.products_id));
            })
            .catch(error => {
                console.log("Error al eliminar el producto", error);
            });
    };

    const resetForm = () => {
        setName("");
        setDescription("");
        setPrice("");
        setImageUrl("");
        setStock("");
        setCategory("Limpieza");
        setEditProductId(null);
        setFiles([]); // Reinicia el estado de archivos
        setImagePreview(null);
    };

    const renderProducts = () => {
        //const reversedProducts = [...products].reverse();
        if (!Array.isArray(products) || products.length === 0) {
            return <p>No hay productos disponibles.</p>;
        }


        return products.map(product => (
            <div key={product.products_id} className="products-item">
                <div className="product-item-left">
                    <h2>{product.products_name}</h2>
                    <img src={product.products_image_url} alt={product.products_name} />
                    <p><strong>Precio:</strong> {product.products_price}</p>
                    <p><strong>Stock:</strong> {product.products_stock}</p>
                </div>
                <div className="product-item-right">
                    <button className="action-icon" onClick={() => handleEditClickProduct(product)}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button className="action-icon" onClick={() => handleDeleteClickProduct(product)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            </div>
        ));
    };

    const goToAdmin= () =>{
        navigate('/admin');
    }

    return (
        <div className="product-form-container">
            <div className="logo">
                <NavLink to="/" className="active">
                    <h1>Aqui va a estar el Logo</h1>
                </NavLink>
            </div>
            <div className="product-form-wrapper">
                <div className="product-form-left-side-wrapper">
                    <div className="title-close-wrapper">
                        <div className="title">
                            <h1>Formulario para añadir productos</h1>
                        </div>
                        <div className="close">
                            <button onClick={goToAdmin}>X</button>
                        </div>
                    </div>
                    <form onSubmit={handleSubmitProductForm}>
                        <div className="form-data-wrapper">
                            <div className="form-data-row">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Producto"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <select name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                                    <option value="Limpieza">Limpieza</option>
                                    <option value="Organización">Organización</option>
                                </select>
                            </div>
                            <div className="form-data">
                                <textarea
                                    type="text"
                                    name="description"
                                    placeholder="Descripción del producto"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <div className="form-number-wrapper">
                                    <input
                                        type="number"
                                        name="price"
                                        placeholder="Precio"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        name="stock"
                                        placeholder="Stock"
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                    />
                                </div>
                                <div className="image-uploaders" {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}>
                                    <input {...getInputProps()} />
                                    <p>Arrastra y suelta una imagen aquí o haz clic para seleccionar</p>
                                    {/*<p>{files.length > 0 ? `Archivo seleccionado: ${files[0].name}` : 'No hay archivos seleccionados'}</p>*/}
                                    {imagePreview && <img src={imagePreview} alt="Vista previa" style={{ width: "100px", height: "100px", objectFit: "cover" }} />}
                                    {imagePreview && (
                                        <button type="button" onClick={handleRemoveImage}>
                                            Eliminar Imagen
                                        </button>
                                )}
                                </div>
                                {/* Mostrar la miniatura de la imagen seleccionada 
                                {imagePreview && <img src={imagePreview} alt="Vista previa" style={{ width: "100px", height: "100px", objectFit: "cover" }} />}
                                    <div className="image-preview">
                                        <h3>Vista previa de la imagen:</h3>
                                        <img src={imagePreview} alt="Vista previa" style={{ width: '100px', height: '100px' }} />
                                    </div>
                                )}*/}
                                <div>
                                    <button type="submit">Guardar</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="product-form-right-side-wrapper">
                    <h1>Productos Actuales</h1>
                    <div className="products-item-wrapper">
                        {renderProducts()}
                    </div>
                </div>
            </div> 
        </div>
    );
};

export default ProductForm;
