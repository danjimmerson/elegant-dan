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

const MenuBar = ({ editor, isDarkMode }: { editor: any, isDarkMode: boolean }) => {
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
                "p-2 rounded-lg transition-all duration-200",
                isDarkMode
                    ? "hover:bg-white/10 text-gray-400 hover:text-white"
                    : "hover:bg-gray-100 text-gray-500 hover:text-black",
                isActive && (isDarkMode
                    ? "bg-white/10 text-accent shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                    : "bg-gray-100 text-black shadow-inner"
                ),
                disabled && "opacity-50 cursor-not-allowed"
            )}
        >
            {children}
        </button>
    );

    const Divider = () => <div className={cn("w-px h-6 mx-1 self-center", isDarkMode ? "bg-white/10" : "bg-gray-200")} />;

    return (
        <div className={cn(
            "flex flex-wrap items-center gap-1 p-2 border-b sticky top-0 z-20 backdrop-blur-md transition-colors",
            isDarkMode ? "bg-black/40 border-white/10" : "bg-white/80 border-gray-100"
        )}>
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

const Editor = ({ content, onChange, isDarkMode }: { content: string, onChange: (html: string) => void, isDarkMode: boolean }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-xl shadow-lg border my-8 w-full transition-colors ' + (isDarkMode ? 'border-white/10' : 'border-gray-200'),
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
                class: cn(
                    'prose prose-lg max-w-3xl focus:outline-none min-h-[500px] px-8 py-8 font-serif leading-relaxed transition-colors duration-500',
                    isDarkMode ? 'prose-invert' : 'prose-gray text-black'
                ),
            },
        },
    });

    return (
        <div className={cn(
            "rounded-2xl overflow-hidden shadow-2xl ring-1 transition-all duration-500",
            isDarkMode
                ? "bg-black/40 backdrop-blur-xl ring-white/5"
                : "bg-white ring-gray-200 shadow-[0_20px_40px_rgba(0,0,0,0.05)]"
        )}>
            <MenuBar editor={editor} isDarkMode={isDarkMode} />
            <EditorContent editor={editor} />
        </div>
    );
};

export default Editor;
