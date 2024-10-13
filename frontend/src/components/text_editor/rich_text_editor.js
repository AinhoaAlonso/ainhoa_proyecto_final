import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Importar estilos de Quill

export default class RichEditorText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorHtml: '', 
        };
    }

    componentDidMount() {
        this.loadContent(this.props.contentToEdit);
    }

    componentDidUpdate(prevProps) {
        // Cargar contenido nuevo solo si ha cambiado
        if (this.props.contentToEdit !== prevProps.contentToEdit) {
            this.loadContent(this.props.contentToEdit);
        }
    }

    loadContent(contentToEdit) {
        // Establecer el contenido inicial en el editor
        this.setState({ editorHtml: contentToEdit || '' });
    }

    handleChange = (html) => {
        this.setState({ editorHtml: html });
        this.props.handleRichTextEditor(html); // Llamar a la función cuando cambia el contenido
    };

    render() {
        return (
            <div className='rich_editor_container'>
                <ReactQuill
                    value={this.state.editorHtml}
                    onChange={this.handleChange}
                    className="text-editor-wrapper"
                />
            </div>
        );
    }
}
