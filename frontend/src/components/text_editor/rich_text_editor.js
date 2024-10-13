import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

export default class RichEditorText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
            previousContent: '', 
        };
    }

    componentDidMount(){
        this.loadContent(this.props.contentToEdit);
        
    }

    componentDidUpdate(prevProps) {
        // Solo cargar contenido nuevo si ha cambiado
        if (this.props.contentToEdit !== prevProps.contentToEdit) {
            this.loadContent(this.props.contentToEdit);
        }
    }

    loadContent(contentToEdit) {
        if (contentToEdit) {
            const contentBlock = htmlToDraft(contentToEdit);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                this.setState({ editorState }, () => {
                    
                    this.props.handleRichTextEditor(contentToEdit);
                });
            }
        } else {
            this.setState({ editorState: EditorState.createEmpty() });
        }
    }

    onEditorStateChange(editorState) {
        this.setState({ editorState });
    }

    handleBlur = () => {
        const { editorState } = this.state;
        const currentHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        
        // Solo llama a handleRichTextEditor cuando el contenido cambia
        if (currentHtml !== this.props.contentToEdit) {
            this.props.handleRichTextEditor(currentHtml);
        }
    }

    render() {
        return (
            <div className='rich_editor_container'>
                <Editor
                    editorState={this.state.editorState}
                    wrapperClassName='text-editor-wrapper'
                    editorClassName='editor'
                    onBlur={this.handleBlur}
                    onEditorStateChange={(editorState) => this.onEditorStateChange(editorState)}
                />
            </div>
        );
    }
}
