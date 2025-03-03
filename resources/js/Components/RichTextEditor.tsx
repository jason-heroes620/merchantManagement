import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
    ClassicEditor,
    Bold,
    Essentials,
    Italic,
    Paragraph,
    Undo,
    Font,
    Link,
    Heading,
    List,
    Indent,
    IndentBlock,
    Underline,
    BlockQuote,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";
import "./custom.css";

const RichTextEditor = ({ value, onChange, contentFor }: any) => {
    return (
        <CKEditor
            editor={ClassicEditor}
            config={{
                toolbar: {
                    items: [
                        "undo",
                        "redo",
                        "|",
                        "heading",
                        "|",
                        "fontsize",
                        "fontColor",
                        "|",
                        "bold",
                        "italic",
                        "underline",
                        "|",
                        "link",
                        "blockQuote",
                        "|",
                        "bulletedList",
                        "numberedList",
                        "outdent",
                        "indent",
                    ],
                },
                link: {
                    addTargetToExternalLinks: true,
                },
                plugins: [
                    Bold,
                    Essentials,
                    Italic,
                    Paragraph,
                    Undo,
                    Font,
                    Link,
                    List,
                    Heading,
                    Indent,
                    IndentBlock,
                    Underline,
                    BlockQuote,
                ],
            }}
            data={value}
            onChange={(event, editor) => {
                const data = editor.getData();
                onChange(contentFor, data);
            }}
        />
    );
};

export default RichTextEditor;
