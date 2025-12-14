import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import FloatingMenuExtension from '@tiptap/extension-floating-menu';
import {
    Bold, Italic, List, ListOrdered, Link as LinkIcon,
    Image as ImageIcon, Heading1, Heading2, Quote,
    Code, Plus, X
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { useState } from 'react';

const Editor = ({ content, onChange, isDarkMode }: { content: string, onChange: (html: string) => void, isDarkMode: boolean }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            BubbleMenuExtension,
            FloatingMenuExtension,
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

    const [isMenuOpen, setIsMenuOpen] = useState(false);

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

    const BubbleButton = ({ onClick, isActive, children, title }: any) => (
        <button
            onClick={onClick}
            title={title}
            className={cn(
                "p-2 transition-colors hover:text-accent",
                isActive ? "text-accent" : (isDarkMode ? "text-gray-300" : "text-gray-600")
            )}
        >
            {children}
        </button>
    );

    const FloatingActionButton = ({ onClick, children, title }: any) => (
        <button
            onClick={onClick}
            title={title}
            className={cn(
                "flex items-center gap-2 w-full p-2 text-sm font-sans rounded-md transition-colors",
                isDarkMode
                    ? "text-gray-300 hover:bg-white/10 hover:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-black"
            )}
        >
            {children}
        </button>
    );

    return (
        <div className={cn(
            "rounded-2xl overflow-hidden shadow-2xl ring-1 transition-all duration-500 relative",
            isDarkMode
                ? "bg-black/40 backdrop-blur-xl ring-white/5"
                : "bg-white ring-gray-200 shadow-[0_20px_40px_rgba(0,0,0,0.05)]"
        )}>
            {/* Context Menu for Text Selection */}
            {editor && (
                <BubbleMenu
                    editor={editor}
                    className={cn(
                        "flex items-center gap-1 p-1 rounded-full shadow-xl border backdrop-blur-md overflow-hidden",
                        isDarkMode ? "bg-black/90 border-white/20" : "bg-white border-gray-200"
                    )}
                >
                    <BubbleButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                    >
                        <Bold className="w-4 h-4" />
                    </BubbleButton>
                    <BubbleButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                    >
                        <Italic className="w-4 h-4" />
                    </BubbleButton>
                    <BubbleButton
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        isActive={editor.isActive('code')}
                    >
                        <Code className="w-4 h-4" />
                    </BubbleButton>
                    <div className={cn("w-px h-4 mx-1", isDarkMode ? "bg-white/20" : "bg-gray-300")} />
                    <BubbleButton
                        onClick={setLink}
                        isActive={editor.isActive('link')}
                    >
                        <LinkIcon className="w-4 h-4" />
                    </BubbleButton>
                </BubbleMenu>
            )}

            {/* Floating Block Menu (The "+" button) */}
            {editor && (
                <FloatingMenu
                    editor={editor}
                    className="flex items-center gap-2"
                >
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={cn(
                                "p-1 rounded-full border transition-all duration-300",
                                isMenuOpen ? "rotate-45" : "rotate-0",
                                isDarkMode
                                    ? "border-white/20 hover:bg-white/20 text-gray-400 hover:text-white bg-black/50"
                                    : "border-gray-200 hover:bg-gray-100 text-gray-500 hover:text-black bg-white"
                            )}
                        >
                            <Plus className="w-5 h-5" />
                        </button>

                        {isMenuOpen && (
                            <div className={cn(
                                "absolute left-8 top-1/2 -translate-y-1/2 w-48 p-2 rounded-xl shadow-2xl border backdrop-blur-xl flex flex-col gap-1 z-50 animate-in fade-in zoom-in-95 slide-in-from-left-2 duration-200",
                                isDarkMode ? "bg-black/90 border-white/10" : "bg-white border-gray-100"
                            )}>
                                <FloatingActionButton onClick={() => { editor.chain().focus().toggleHeading({ level: 1 }).run(); setIsMenuOpen(false); }}>
                                    <Heading1 className="w-4 h-4" /> Heading 1
                                </FloatingActionButton>
                                <FloatingActionButton onClick={() => { editor.chain().focus().toggleHeading({ level: 2 }).run(); setIsMenuOpen(false); }}>
                                    <Heading2 className="w-4 h-4" /> Heading 2
                                </FloatingActionButton>
                                <FloatingActionButton onClick={() => { editor.chain().focus().toggleBulletList().run(); setIsMenuOpen(false); }}>
                                    <List className="w-4 h-4" /> Bullet List
                                </FloatingActionButton>
                                <FloatingActionButton onClick={() => { editor.chain().focus().toggleOrderedList().run(); setIsMenuOpen(false); }}>
                                    <ListOrdered className="w-4 h-4" /> Ordered List
                                </FloatingActionButton>
                                <FloatingActionButton onClick={() => { editor.chain().focus().toggleBlockquote().run(); setIsMenuOpen(false); }}>
                                    <Quote className="w-4 h-4" /> Quote
                                </FloatingActionButton>
                                <div className={cn("h-px w-full my-1", isDarkMode ? "bg-white/10" : "bg-gray-100")} />
                                <FloatingActionButton onClick={() => { addImage(); setIsMenuOpen(false); }}>
                                    <ImageIcon className="w-4 h-4" /> Image
                                </FloatingActionButton>
                            </div>
                        )}
                    </div>
                </FloatingMenu>
            )}

            <EditorContent editor={editor} />
        </div>
    );
};

export default Editor;
