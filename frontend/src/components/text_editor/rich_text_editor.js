import React, {Component} from 'react';
import {EditorState, convertToRaw, ContentState} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';



export default class RichEditorText extends Component{
    constructor(props){
        super(props);

        this.state = {
            editorState: EditorState.createEmpty()
        }
        this.onEditorStateChange = this.onEditorStateChange.bind(this);
    }

    componentDidMount() {
        const { contentToEdit } = this.props;
        if (contentToEdit) {
            const contentBlock = htmlToDraft(contentToEdit);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                this.setState({ editorState });
            }
        }
    }
    

    onEditorStateChange(editorState){
        this.setState({ editorState}, () => {
            this.props.handleRichTextEditor(
                //Vamos a tomar el contenido de draft, lo va a revisar y si esta bien lo va a convertir a un string
                draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
            );
        });
    }
    render(){
        return(
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