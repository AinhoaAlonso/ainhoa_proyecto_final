import React, { useState, useEffect, useRef } from "react";
import { useDropzone } from 'react-dropzone';
import axios from "axios";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faEraser, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import RichEditorText from "../text_editor/rich_text_editor";
import { NavLink } from "react-router-dom";
import image_logo from '../../static/assets/image_logo.jpg';
import NavigationEdit from "../navigation/navigation_edit";

import "../../../node_modules/react-dropzone-component/styles/filepicker.css";
import "../../../node_modules/dropzone/dist/min/dropzone.min.css";

const BlogForm = () => {
    const [title, setTitle] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    const [date, setDate] = useState("");
    const [usersId, setUsersId] = useState("");
    const [posts, setPosts] = useState([]);
    const [editPostId, setEditPostId] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [files, setFiles] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const imageRef = useRef(null);

    const [isMounted, setIsMounted] = useState(false); 

    const userEmail = useSelector(state=>state.auth.userEmail);

    useEffect(() => {
        setIsMounted(true); 

        return () => {
            setIsMounted(false);  
        };
    }, []);
   
    const handleDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setFiles(acceptedFiles); 
            setImagePreview(URL.createObjectURL(file));
            uploadImageToImageBB(file);
        } else {
            console.warn("No se aceptaron archivos."); 
        }
    };
    
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDrop,
        maxFiles: 1,
        accept: {
            'image/*': [] 
        },
        onDropRejected: (rejectedFiles) => {
            console.warn("Archivos rechazados:", rejectedFiles);
        }
    });

    const handleRemoveImage = () => {
        setFiles(null); 
        setImagePreview(null); 
        setImageUrl(null); 
    };

    useEffect(() => {

        if (!userEmail || !isMounted) return;
        axios.get("http://127.0.0.1:8000/users")
            .then(response => {
                const user = response.data.find(user => user.users_email === userEmail);
                if (user && isMounted) {
                    setUsersId(user.users_id);
                }
            })
            .catch(error => {
                console.log("Error fetching users", error);
            });
            if (isMounted) {
                handleGetPosts();
            }
    }, [userEmail, isMounted]);

    const handleGetPosts = async () => {
        if (!isMounted) return;
        await axios.get("http://127.0.0.1:8000/posts")
            .then(response => {
                if (isMounted) {
                    setPosts(response.data || []);
                }
            })
            .catch(error => {
                console.log("Error fetching posts", error);
            });
    };

    const handleRichTextEditor = (content) => {
        setContent(content);
    };

    
    const uploadImageToImageBB = async (imageFile) => {
        const apiKey = '0f491d8d00ee1bbd4f39764f40db5031'; 
        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const response = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData);
            if (response.data && response.data.data && response.data.data.url) {
                setImageUrl(response.data.data.url);
            } else {
                throw new Error("URL de la imagen no disponible");
            }
        } catch (error) {
            console.error("Error al subir la imagen al servidor imgbb:", error);
            return null;
        }
    };

    const handleSubmitBlogForm = async (event) => {
        event.preventDefault();

        if (!usersId) {
            console.log("User ID not available");
            return;
        }

        const formData = new FormData();
        formData.append("posts_title", title);
        formData.append("posts_author", author);
        formData.append("posts_content", content);
        formData.append("posts_date", date);
        formData.append("posts_users_id", usersId);

        if (imageUrl) {
            formData.append("posts_image_url", imageUrl);
        }
        if (editPostId) {
            formData.append("posts_id", editPostId);

            axios.put("http://127.0.0.1:8000/update/posts", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
                .then(response => {
                    console.log("Producto actualizado", response);
                    setPosts((prevPosts) => {
                        const updatedPost = {
                            posts_id: editPostId,
                            posts_title: title,
                            posts_author: author,
                            posts_content: content,
                            posts_image_url: imageUrl,
                            posts_date: date,
                        }
                        const filteredPosts = prevPosts.filter(post => post.posts_id !== editPostId);
                        return [updatedPost, ...filteredPosts];
                    });
                    handleGetPosts();
                    resetForm();
                })
                .catch(error => {
                    console.log("Error actualizando post", error);
                });
        } else {
            axios.post("http://127.0.0.1:8000/insert/posts", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
                .then(response => {
                    handleGetPosts();
                    resetForm();
                    if (imageRef.current) {
                        imageRef.current.value = null;
                    }
                })
                .catch(error => {
                    console.log("Error inserting post", error);
                });
        }
    };

    const handleEditClick = (post) => {
        console.log("handleEditClick", post);
        setTitle(post.posts_title);
        setAuthor(post.posts_author);
        setDate(post.posts_date);
        setContent(post.posts_content);
        setImageUrl(post.posts_image_url);
        setEditPostId(post.posts_id);
        setEditMode(true);
        setFiles([]);
        setImagePreview(post.posts_image_url);
    };

    const handleDeleteClick = (post) => {
        axios.delete(`http://127.0.0.1:8000/delete/posts/${post.posts_id}`)
            .then(response => {
                setPosts(posts.filter(item => item.posts_id !== post.posts_id));
            })
            .catch(error => {
                console.log("Error deleting post", error);
            });
    };

    const resetForm = () => {
        setTitle("");
        setAuthor("");
        setDate("");
        setContent("");
        setImageUrl("");
        setEditPostId(null);
        setEditMode(false);
        setFiles([]); 
        setImagePreview(null);
    };


    if (!userEmail) {
        return <div>Cargando...</div>;
    }

    const renderPosts = () => {
        if (!Array.isArray(posts) || posts.length === 0) {
            return <p>No hay posts disponibles.</p>;
        }
        return posts.map((post, index) => (
            <div key={`${post.posts_id}-${index}`} className="post-item">
                <div className="post-item-left">
                    <h2>{post.posts_title}</h2>
                    <img src={post.posts_image_url} alt={post.posts_title} />
                    <p><strong>Autor:</strong> {post.posts_author}</p>
                    <p><strong>Fecha:</strong> {post.posts_date}</p>
                </div>
                <div className="post-item-right">
                    <button className="action-icon" onClick={() => handleEditClick(post)}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button className="action-icon" onClick={() => handleDeleteClick(post)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            </div>
        ));
    };

    return (
        <div className="blogform-container">
            {/*<div className="blogform-navigation-wrapper">
                <div className="logo">
                    <NavigationEdit />
                </div>
            </div>*/}
            <div className="blogform-wrapper">
                <div className="blogform-left-side-wrapper">
                    <h1>{editPostId ? "Editar Post" : "Nuevo Post"}</h1>
                    <form onSubmit={handleSubmitBlogForm}>
                        <div className="blogform-data-wrapper">
                            <input
                                type="text"
                                name="title"
                                placeholder="Título del post"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <div className="blogform-data-row">
                                <input
                                    type="text"
                                    name="author"
                                    placeholder="Autor"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                />
                                <input
                                    type="date"
                                    name="date"
                                    placeholder="Fecha"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                                <button type="button" onClick={resetForm}>
                                    <FontAwesomeIcon icon={faEraser} />
                                </button>
                            </div>
                            <div className="blogform-data">
                                <RichEditorText
                                    handleRichTextEditor={handleRichTextEditor}
                                    contentToEdit={editPostId ? content : null}
                                />
                            </div>
                            <div className="image-uploaders" {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}>
                                    <input {...getInputProps()} />
                                    {!imagePreview && <p>Arrastra y suelta una imagen aquí o haz clic para seleccionar</p>}
                                    {imagePreview && <img src={imagePreview} alt="Vista previa" style={{ width: "100px", height: "100px", objectFit: "cover" }} />}
                                    {imagePreview && (
                                        <button type="button" onClick={handleRemoveImage}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    )}
                                </div>
                            <div>
                                <button className= "save" type="submit">{editPostId ? "Actualizar" : "Guardar"}</button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="blogform-right-side-wrapper">
                    <h1>Posts Actuales</h1>
                    <div className="posts-item_wrapper">
                        {renderPosts()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogForm;