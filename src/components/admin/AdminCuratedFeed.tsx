import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Loader2, Save, Trash2, Globe, ExternalLink, RefreshCw, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";
import { useImageUpload } from '@/hooks/useImageUpload';

interface AdminCuratedFeedProps {
    isDarkMode: boolean;
}

interface CuratedPost {
    id: string;
    title: string;
    description: string; // Mapped to excerpt
    image: string;
    url: string; // Mapped to link
    source_site: string; // Mapped to source
    category: string;
    date: string;
    status: 'draft' | 'published' | 'trash';
}

const AdminCuratedFeed = ({ isDarkMode }: AdminCuratedFeedProps) => {
    const [urlInput, setUrlInput] = useState('');
    const [isFetchingUrl, setIsFetchingUrl] = useState(false);
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [activePost, setActivePost] = useState<Partial<CuratedPost>>({});
    const [isSaving, setIsSaving] = useState(false);

    const { uploadImage, uploading: isUploadingImage } = useImageUpload();

    // Fetch existing curated posts
    const fetchPosts = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('type', 'curated')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setPosts(data.map(p => ({
                id: p.id,
                title: p.title,
                description: p.excerpt,
                image: p.image,
                url: p.link,
                source_site: p.source || p.author, // Fallback
                category: p.category,
                date: p.date,
                status: p.status
            })));
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchMetadata = async () => {
        if (!urlInput) return;
        setIsFetchingUrl(true);

        try {
            // Use a CORS proxy to fetch the HTML
            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(urlInput)}`;
            const response = await fetch(proxyUrl);
            const html = await response.text();

            // Parse HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            // Extract Metadata
            const title = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || doc.title || '';
            const description = doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
            const image = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
            const siteName = doc.querySelector('meta[property="og:site_name"]')?.getAttribute('content') || new URL(urlInput).hostname.replace('www.', '');

            // Auto-fill form
            setActivePost({
                title,
                description,
                image,
                url: urlInput,
                source_site: siteName,
                category: 'Strategy', // Default
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: 'draft'
            });
            setIsEditing(true);

        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch metadata. Please enter details manually.");
            // Open empty form
            setActivePost({
                url: urlInput,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: 'draft'
            });
            setIsEditing(true);
        } finally {
            setIsFetchingUrl(false);
            setUrlInput('');
        }
    };

    const handleSave = async () => {
        if (!activePost.title || !activePost.url) {
            toast.error("Title and URL are required.");
            return;
        }

        setIsSaving(true);

        const payload = {
            title: activePost.title,
            slug: `curated-${Date.now()}`, // Simple unique slug
            excerpt: activePost.description,
            image: activePost.image,
            link: activePost.url,
            source: activePost.source_site,
            category: activePost.category,
            date: activePost.date,
            type: 'curated',
            status: activePost.status,
            author: activePost.source_site // Store source as author too for compatibility
        };

        if (activePost.id) {
            const { error } = await supabase
                .from('posts')
                .update(payload)
                .eq('id', activePost.id);
            if (error) toast.error(error.message);
            else toast.success("Updated successfully");
        } else {
            const { error } = await supabase
                .from('posts')
                .insert([payload]);
            if (error) toast.error(error.message);
            else toast.success("Curated post added!");
        }

        setIsSaving(false);
        setIsEditing(false);
        setActivePost({});
        fetchPosts();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        const { error } = await supabase.from('posts').delete().eq('id', id);
        if (!error) {
            toast.success("Deleted");
            fetchPosts();
        } else {
            toast.error("Error deleting");
        }
    };

    if (isEditing) {
        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto pb-24">
                <div className="flex items-center justify-between mb-8">
                    <h2 className={cn("text-3xl font-serif font-bold", isDarkMode ? "text-white" : "text-gray-900")}>
                        {activePost.id ? "Edit Curated Link" : "Review & Tag"}
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-transparent border border-gray-500 rounded-full hover:bg-gray-500/10 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-lg hover:brightness-110",
                                "bg-accent text-white"
                            )}
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Publish to Feed
                        </button>
                    </div>
                </div>

                <div className={cn("space-y-6 p-8 rounded-3xl border", isDarkMode ? "bg-zinc-900 border-white/10" : "bg-white border-gray-200")}>

                    {/* Header Image Preview */}
                    <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 relative group">
                        {activePost.image ? (
                            <img src={activePost.image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ImageIcon className="w-12 h-12 opacity-20" />
                            </div>
                        )}
                        <input
                            type="text"
                            className={cn("absolute bottom-0 left-0 right-0 p-2 text-xs bg-black/50 text-white backdrop-blur-md border-t border-white/10 outline-none opacity-0 group-hover:opacity-100 transition-opacity")}
                            placeholder="Image URL"
                            value={activePost.image || ''}
                            onChange={(e) => setActivePost({ ...activePost, image: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-widest opacity-50">Article Title</label>
                        <textarea
                            value={activePost.title || ''}
                            onChange={(e) => setActivePost({ ...activePost, title: e.target.value })}
                            className={cn("w-full bg-transparent text-xl font-serif font-bold border-none outline-none resize-none p-0", isDarkMode ? "text-white placeholder:text-zinc-600" : "text-black placeholder:text-gray-300")}
                            placeholder="Article Title..."
                            rows={2}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold tracking-widest opacity-50">Source Site</label>
                            <input
                                type="text"
                                value={activePost.source_site || ''}
                                onChange={(e) => setActivePost({ ...activePost, source_site: e.target.value })}
                                className={cn("w-full bg-transparent border-b outline-none py-2 text-sm", isDarkMode ? "border-white/10 focus:border-accent" : "border-gray-200 focus:border-accent")}
                                placeholder="e.g. The Verge"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold tracking-widest opacity-50">Category</label>
                            <select
                                value={activePost.category || 'Strategy'}
                                onChange={(e) => setActivePost({ ...activePost, category: e.target.value })}
                                className={cn("w-full bg-transparent border-b outline-none py-2 text-sm", isDarkMode ? "border-white/10 focus:border-accent bg-black" : "border-gray-200 focus:border-accent bg-white")}
                            >
                                <option value="Strategy">Strategy</option>
                                <option value="Design">Design</option>
                                <option value="Technology">Technology</option>
                                <option value="Culture">Culture</option>
                                <option value="Marketing">Marketing</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-widest opacity-50">Short Description</label>
                        <textarea
                            value={activePost.description || ''}
                            onChange={(e) => setActivePost({ ...activePost, description: e.target.value })}
                            className={cn(
                                "w-full bg-transparent border rounded-xl p-4 text-sm resize-none outline-none focus:ring-1 focus:ring-accent",
                                isDarkMode ? "border-white/10 focus:border-accent" : "border-gray-200 focus:border-accent"
                            )}
                            placeholder="Brief summary..."
                            rows={3}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="space-y-1 flex-1">
                            <label className="text-[10px] uppercase font-bold tracking-widest opacity-50">Original URL</label>
                            <div className="flex items-center gap-2 text-xs opacity-70 truncate bg-black/5 p-2 rounded">
                                <Globe className="w-3 h-3" />
                                {activePost.url}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold tracking-widest opacity-50">Status</label>
                            <select
                                value={activePost.status || 'draft'}
                                onChange={(e) => setActivePost({ ...activePost, status: e.target.value as any })}
                                className={cn("w-full bg-transparent border-b outline-none py-2 text-sm font-bold",
                                    activePost.status === 'published' ? "text-green-500" : "text-amber-500"
                                )}
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="trash">Trash</option>
                            </select>
                        </div>
                    </div>

                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className={cn("text-3xl font-serif font-bold", isDarkMode ? "text-white" : "text-gray-900")}>Curated Feed</h2>
                    <p className={cn("text-sm mt-1", isDarkMode ? "text-gray-400" : "text-gray-500")}>Share external links and inspiration.</p>
                </div>
            </div>

            {/* URL Input Area */}
            <div className={cn("p-1 rounded-full border-2 focus-within:ring-2 focus-within:ring-accent transition-all flex items-center shadow-lg", isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100")}>
                <div className="pl-6 pr-4 opacity-50">
                    <Globe className="w-5 h-5" />
                </div>
                <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Paste a URL to curate (e.g. https://techcrunch.com/...)"
                    className={cn("flex-1 bg-transparent py-4 outline-none text-sm", isDarkMode ? "text-white" : "text-black")}
                    onKeyDown={(e) => e.key === 'Enter' && fetchMetadata()}
                />
                <button
                    onClick={fetchMetadata}
                    disabled={!urlInput || isFetchingUrl}
                    className={cn(
                        "m-1 px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all",
                        !urlInput ? "opacity-50 cursor-not-allowed bg-gray-500 text-white" : "bg-black text-white hover:bg-zinc-800"
                    )}
                >
                    {isFetchingUrl ? <Loader2 className="w-4 h-4 animate-spin" /> : "Fetch"}
                </button>
            </div>

            {/* List */}
            {isLoading ? (
                <div className="py-20 text-center font-mono text-xs animate-pulse opacity-50">Loading curated feed...</div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {posts.length === 0 && (
                        <div className="py-20 text-center opacity-50 border-2 border-dashed border-white/10 rounded-3xl">
                            <p className="text-sm uppercase tracking-widest font-bold">No curated links yet</p>
                        </div>
                    )}
                    {posts.map((post) => (
                        <div key={post.id} className={cn("group flex items-center justify-between p-4 rounded-xl border transition-all", isDarkMode ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-white border-gray-100 hover:shadow-md")}>
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 shrink-0 relative">
                                    {post.image && <img src={post.image} className="w-full h-full object-cover" alt="" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1">
                                        <span>{post.source_site}</span>
                                        <span>•</span>
                                        <span>{post.category}</span>
                                        {post.status !== 'published' && <span className="text-amber-500">[{post.status}]</span>}
                                    </div>
                                    <h4 className={cn("text-base font-bold truncate", isDarkMode ? "text-white" : "text-black")}>{post.title}</h4>
                                    <p className="text-xs opacity-60 truncate mt-1">{post.url}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity px-4">
                                <a href={post.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                                <button onClick={() => { setActivePost(post); setIsEditing(true); }} className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-400">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(post.id)} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminCuratedFeed;
