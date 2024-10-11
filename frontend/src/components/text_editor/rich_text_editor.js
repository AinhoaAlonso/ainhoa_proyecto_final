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
            initialContentLoaded: false, // Para rastrear si se ha cargado el contenido inicial
        };
        this.onEditorStateChange = this.onEditorStateChange.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { contentToEdit } = nextProps;
        if (contentToEdit && !prevState.initialContentLoaded) {
            const contentBlock = htmlToDraft(contentToEdit);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                return {
                    editorState: editorState,
                    initialContentLoaded: true, 
                };
            }
        }
        // Si no hay contenido para editar y el contenido anterior estaba presente
        if (!contentToEdit && prevState.initialContentLoaded) {
            return {
                editorState: EditorState.createEmpty(), 
                initialContentLoaded: false, 
            };
        }
        return null;
    }

    onEditorStateChange(editorState) {
        this.setState({ editorState }, () => {
            this.props.handleRichTextEditor(
                draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
            );
        });
    }

    render() {
        return (
            <div className='rich_editor_container'>
                <Editor
                    editorState={this.state.editorState}
                    wrapperClassName='text-editor-wrapper'
                    editorClassName='editor'
                    onEditorStateChange={this.onEditorStateChange}
                />
            </div>
        );
    }
}
