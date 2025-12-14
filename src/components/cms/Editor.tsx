import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import {
    Bold, Italic, List, ListOrdered, Link as LinkIcon,
    Image as ImageIcon, Heading1, Heading2, Quote,
    Undo, Redo, Code, RemoveFormatting
} from 'lucide-react';
import { cn } from "@/lib/utils";

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const addImage = () => {
        const url = window.prompt('Image URL');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const Button = ({ onClick, isActive, disabled, children, title }: any) => (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={cn(
                "p-2 rounded-lg transition-all duration-200 hover:bg-white/10 text-gray-400 hover:text-white",
                isActive && "bg-white/10 text-accent shadow-[0_0_10px_rgba(255,255,255,0.1)]",
                disabled && "opacity-50 cursor-not-allowed"
            )}
        >
            {children}
        </button>
    );

    const Divider = () => <div className="w-px h-6 bg-white/10 mx-1 self-center" />;

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-20">
            <div className="flex items-center gap-1">
                <Button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
                    <Undo className="w-4 h-4" />
                </Button>
                <Button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
                    <Redo className="w-4 h-4" />
                </Button>
            </div>

            <Divider />

            <div className="flex items-center gap-1">
                <Button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="Bold"
                >
                    <Bold className="w-4 h-4" />
                </Button>
                <Button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="Italic"
                >
                    <Italic className="w-4 h-4" />
                </Button>
                <Button
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    isActive={editor.isActive('code')}
                    title="Code"
                >
                    <Code className="w-4 h-4" />
                </Button>
            </div>

            <Divider />

            <div className="flex items-center gap-1">
                <Button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                    title="Heading 1"
                >
                    <Heading1 className="w-4 h-4" />
                </Button>
                <Button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    title="Heading 2"
                >
                    <Heading2 className="w-4 h-4" />
                </Button>
            </div>

            <Divider />

            <div className="flex items-center gap-1">
                <Button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="Bullet List"
                >
                    <List className="w-4 h-4" />
                </Button>
                <Button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="Ordered List"
                >
                    <ListOrdered className="w-4 h-4" />
                </Button>
                <Button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    title="Quote"
                >
                    <Quote className="w-4 h-4" />
                </Button>
            </div>

            <Divider />

            <div className="flex items-center gap-1">
                <Button
                    onClick={setLink}
                    isActive={editor.isActive('link')}
                    title="Link"
                >
                    <LinkIcon className="w-4 h-4" />
                </Button>
                <Button
                    onClick={addImage}
                    title="Image"
                >
                    <ImageIcon className="w-4 h-4" />
                </Button>
                <Button
                    onClick={() => editor.chain().focus().unsetAllMarks().run()}
                    title="Clear Formatting"
                >
                    <RemoveFormatting className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

const Editor = ({ content, onChange }: { content: string, onChange: (html: string) => void }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-xl shadow-lg border border-white/10 my-8 w-full',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-accent underline decoration-accent/30 hover:decoration-accent transition-all',
                },
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-lg max-w-none focus:outline-none min-h-[500px] px-8 py-8 font-serif leading-relaxed',
            },
        },
    });

    return (
        <div className="rounded-2xl overflow-hidden bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl ring-1 ring-white/5">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};

export default Editor;
