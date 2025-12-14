import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Loader2, Save, Trash2, Globe, ExternalLink, Edit2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";
import { useImageUpload } from '@/hooks/useImageUpload';

interface AdminCuratedFeedProps {
    isDarkMode: boolean;
}

interface CuratedPost {
    id: string;
    title: string;
    description: string;
    image: string;
    url: string;
    source_site: string;
    category: string;
    date: string;
    status: 'draft' | 'published' | 'trash';
}

const COMMON_CATEGORIES = ['Strategy', 'Design', 'Technology', 'Culture', 'Marketing', 'Business', 'AI', 'Productivity'];

const AdminCuratedFeed = ({ isDarkMode }: AdminCuratedFeedProps) => {
    const [urlInput, setUrlInput] = useState('');
    const [isFetchingUrl, setIsFetchingUrl] = useState(false);
    const [posts, setPosts] = useState<CuratedPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [activePost, setActivePost] = useState<Partial<CuratedPost>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { uploadImage, uploading: isUploadingImage } = useImageUpload();

    const fetchPosts = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('type', 'curated')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Supabase Error:", error);
                throw error;
            }

            if (data) {
                const safePosts: CuratedPost[] = data.map(p => ({
                    id: p.id || Math.random().toString(),
                    title: p.title || 'Untitled',
                    description: p.excerpt || '',
                    image: p.image || '',
                    url: p.link || '#',
                    source_site: p.source || p.author || 'Unknown Source',
                    category: p.category || 'Uncategorized',
                    date: p.date || new Date().toISOString(),
                    status: (p.status as any) || 'draft'
                }));
                setPosts(safePosts);
            }
        } catch (err: any) {
            console.error("Fetch Posts Error:", err);
            setError("Failed to load curated feed. Please check console.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const detectCategory = (text: string): string => {
        if (!text) return 'Strategy';
        const lower = text.toLowerCase();
        if (lower.includes('design') || lower.includes('ux') || lower.includes('ui')) return 'Design';
        if (lower.includes('ai') || lower.includes('tech') || lower.includes('code')) return 'Technology';
        if (lower.includes('brand') || lower.includes('market') || lower.includes('ad')) return 'Marketing';
        if (lower.includes('money') || lower.includes('business')) return 'Strategy';
        if (lower.includes('culture') || lower.includes('life')) return 'Culture';
        return 'Strategy';
    };

    const fetchMetadata = async () => {
        if (!urlInput) return;
        setIsFetchingUrl(true);
        setError(null);

        try {
            // Use a CORS proxy to fetch the HTML
            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(urlInput)}`;
            const response = await fetch(proxyUrl);
            if (!response.ok) throw new Error("Proxy failed");

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            const title = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || doc.title || '';
            const description = doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
                doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
            const image = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
            let siteName = doc.querySelector('meta[property="og:site_name"]')?.getAttribute('content');

            if (!siteName) {
                try {
                    const hostname = new URL(urlInput).hostname;
                    siteName = hostname.replace('www.', '');
                } catch (e) {
                    siteName = 'Unknown';
                }
            }

            const detectedCategory = detectCategory(`${title} ${description} ${siteName}`);

            setActivePost({
                title,
                description,
                image,
                url: urlInput,
                source_site: siteName || '',
                category: detectedCategory,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: 'draft'
            });
            setIsEditing(true);

        } catch (error) {
            console.error(error);
            toast.error("Could not fetch metadata automatically.");
            setActivePost({
                url: urlInput,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: 'draft',
                category: 'Strategy'
            });
            setIsEditing(true);
        } finally {
            setIsFetchingUrl(false);
            setUrlInput('');
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);

            // Validation
            if (!activePost.title) {
                throw new Error("Title is required");
            }

            const payload = {
                title: activePost.title,
                slug: `curated-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                excerpt: activePost.description || '',
                image: activePost.image || '',
                link: activePost.url || '#',
                source: activePost.source_site || 'Unknown',
                category: activePost.category || 'Strategy',
                date: activePost.date || new Date().toISOString(),
                type: 'curated',
                status: activePost.status || 'draft',
                author: activePost.source_site || 'Unknown' // Fallback
            };

            if (activePost.id) {
                const { error } = await supabase
                    .from('posts')
                    .update(payload)
                    .eq('id', activePost.id);
                if (error) throw error;
                toast.success("Updated successfully");
            } else {
                const { error } = await supabase
                    .from('posts')
                    .insert([payload]);
                if (error) throw error;
                toast.success("Curated post added!");
            }

            setIsEditing(false);
            setActivePost({});
            await fetchPosts();
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Failed to save");
        } finally {
            setIsSaving(false);
        }
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

    if (error) {
        return <div className="p-8 text-red-500 border border-red-500 rounded-xl bg-red-500/10">{error}</div>;
    }

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
                            <textarea
                                value={activePost.source_site || ''}
                                onChange={(e) => setActivePost({ ...activePost, source_site: e.target.value })}
                                className={cn("w-full bg-transparent border-b outline-none py-2 text-sm resize-none h-10 leading-tight", isDarkMode ? "border-white/10 focus:border-accent" : "border-gray-200 focus:border-accent")}
                                placeholder="e.g. The Verge"
                                rows={1}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold tracking-widest opacity-50">Category (Tag)</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    list="categories-list"
                                    value={activePost.category || ''}
                                    onChange={(e) => setActivePost({ ...activePost, category: e.target.value })}
                                    className={cn("w-full bg-transparent border-b outline-none py-2 text-sm", isDarkMode ? "border-white/10 focus:border-accent bg-transparent" : "border-gray-200 focus:border-accent bg-transparent")}
                                    placeholder="Type or select a tag..."
                                />
                                <datalist id="categories-list">
                                    {COMMON_CATEGORIES.map(c => (
                                        <option key={c} value={c} />
                                    ))}
                                </datalist>
                            </div>
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
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 shrink-0 relative flex items-center justify-center">
                                    {post.image ? <img src={post.image} className="w-full h-full object-cover" alt="" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} /> : <Globe className="w-6 h-6 opacity-20" />}
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
