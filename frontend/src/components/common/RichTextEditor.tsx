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
            console.log("Initializing Quill editor");
            
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
                quillRef.current.clipboard.dangerouslyPasteHTML(value);
            }

            // Listen for text changes
            quillRef.current.on("text-change", () => {
                if (quillRef.current) {
                    const html = quillRef.current.root.innerHTML;
                    console.log("Quill text-change triggered, HTML:", html);
                    onChange(html);
                }
            });
            
            console.log("Quill initialized successfully");
        }
    }, []);

    // Update editor content when value prop changes
    useEffect(() => {
        if (quillRef.current) {
            const currentHtml = quillRef.current.root.innerHTML;
            if (value !== currentHtml) {
                console.log("Updating Quill content with new value");
                quillRef.current.clipboard.dangerouslyPasteHTML(value || "");
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
