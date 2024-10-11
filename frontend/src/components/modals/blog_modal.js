import React, {Component} from "react";
import ReactModal from 'react-modal';
import BlogForm from "../blog/blog_form";


export default class BlogModal extends Component{
    constructor(props){
        super(props);

        this.customStyles = {
            content : {
                fontFamily: "Roboto, sans-serif",
                top: "50%",
                left: "50%",
                right: "auto",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)",
                width: "95%",
                height:"95%"
            },
  
            overlay:{
                backgroundColor: "rgba(1, 1, 1, 0.75)"
            }
        };
    }
    render(){
        const { isOpen, onRequestClose} = this.props; 

        return (
            <ReactModal
                style={this.customStyles}
                isOpen={isOpen} 
                onRequestClose={onRequestClose} 
                contentLabel="Blog Modal"
            >
                <BlogForm/>
            </ReactModal>
        );
    }
}