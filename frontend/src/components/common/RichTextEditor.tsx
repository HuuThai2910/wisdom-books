import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    style?: React.CSSProperties;
}

const RichTextEditor = ({
    value,
    onChange,
    placeholder = "Nhập nội dung...",
    style,
}: RichTextEditorProps) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);

    useEffect(() => {
        if (editorRef.current && !quillRef.current) {
            // Initialize Quill
            quillRef.current = new Quill(editorRef.current, {
                theme: "snow",
                placeholder,
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ["bold", "italic", "underline", "strike"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        [{ color: [] }, { background: [] }],
                        ["link"],
                        ["clean"],
                    ],
                },
            });

            // Set initial value
            if (value) {
                quillRef.current.root.innerHTML = value;
            }

            // Listen for text changes
            quillRef.current.on("text-change", () => {
                if (quillRef.current) {
                    const html = quillRef.current.root.innerHTML;
                    onChange(html);
                }
            });
        }

        // Update content when value changes externally
        return () => {
            if (quillRef.current) {
                quillRef.current.off("text-change");
            }
        };
    }, []);

    // Update editor content when value prop changes
    useEffect(() => {
        if (quillRef.current && value !== quillRef.current.root.innerHTML) {
            const selection = quillRef.current.getSelection();
            quillRef.current.root.innerHTML = value;
            if (selection) {
                quillRef.current.setSelection(selection);
            }
        }
    }, [value]);

    return (
        <div style={style}>
            <div ref={editorRef} />
        </div>
    );
};

export default RichTextEditor;
