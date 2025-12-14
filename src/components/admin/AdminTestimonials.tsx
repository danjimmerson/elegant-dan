import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Reorder } from 'framer-motion';
import { Plus, Edit2, Loader2, Save, Trash2, Upload, GripVertical } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Testimonial } from '@/data/testimonials';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";
import { useImageUpload } from '@/hooks/useImageUpload';

interface AdminTestimonialsProps {
    isDarkMode: boolean;
}

const AdminTestimonials = ({ isDarkMode }: AdminTestimonialsProps) => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [fetching, setFetching] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<Partial<Testimonial>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [isOrderChanged, setIsOrderChanged] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploadImage, uploading: isUploadingImage } = useImageUpload();

    // Fetch testimonials
    const fetchTestimonials = async () => {
        setFetching(true);
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .order('sort_order', { ascending: true });

        if (!error && data) {
            setTestimonials(data as Testimonial[]);
            setIsOrderChanged(false);
        }
        setFetching(false);
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleReorder = (newOrder: Testimonial[]) => {
        setTestimonials(newOrder);
        setIsOrderChanged(true);
    };

    const saveOrder = async () => {
        setIsSaving(true);
        // Save just the sort_order for each id
        const updates = testimonials.map((t, index) => ({
            id: t.id,
            author: t.author,
            quote: t.quote,
            role: t.role,
            company: t.company,
            image: t.image,
            color: t.color,
            sort_order: index,
        }));

        const { error } = await supabase
            .from('testimonials')
            .upsert(updates);

        if (error) {
            toast.error("Failed to update order");
        } else {
            toast.success("Order updated");
            setIsOrderChanged(false);
        }
        setIsSaving(false);
    };

    const handleEdit = (t: Testimonial) => {
        setEditingId(t.id);
        setFormData(t);
    };

    const handleCreate = () => {
        setEditingId(0); // 0 indicates new
        setFormData({
            quote: '',
            author: '',
            role: '',
            company: '',
            image: '',
            color: '#6366f1',
            sort_order: testimonials.length
        });
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to remove this testimonial?")) return;

        const { error } = await supabase
            .from('testimonials')
            .delete()
            .eq('id', id);

        if (error) {
            toast.error("Failed to delete: " + error.message);
        } else {
            toast.success("Testimonial removed.");
            fetchTestimonials();
        }
    };

    const handleSave = async () => {
        if (!formData.quote || !formData.author) {
            toast.error("Quote and Author are required.");
            return;
        }
        setIsSaving(true);

        const payload = {
            ...formData,
        };
        // Remove ID if creating new so DB generates it
        if (editingId === 0) {
            delete (payload as any).id;
        }

        const { error } = await supabase
            .from('testimonials')
            .upsert(payload)
            .select();

        if (error) {
            toast.error("Failed to save: " + error.message);
        } else {
            toast.success("Testimonial saved.");
            setEditingId(null);
            fetchTestimonials();
        }
        setIsSaving(false);
    };

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const url = await uploadImage(e.target.files[0]);
            if (url) {
                setFormData({ ...formData, image: url });
            }
        }
    };

    if (editingId !== null) {
        const headerActions = document.getElementById('admin-header-actions');

        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 w-full max-w-4xl mx-auto">
                {headerActions && createPortal(
                    <div className="flex gap-2">
                        <button
                            onClick={() => setEditingId(null)}
                            className="flex items-center gap-2 px-6 py-2 bg-transparent border border-white/20 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-2 bg-accent text-white rounded-full font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save
                        </button>
                    </div>,
                    headerActions
                )}

                <h2 className={cn("text-3xl font-serif font-bold mb-8", isDarkMode ? "text-white" : "text-gray-900")}>
                    {editingId === 0 ? "New Testimonial" : "Editing Testimonial"}
                </h2>

                <div className="space-y-8 bg-zinc-900/50 p-8 rounded-3xl border border-white/5">
                    <div className="space-y-4">
                        <label className={cn("text-[10px] uppercase tracking-widest font-bold opacity-50 block", isDarkMode ? "text-white" : "text-black")}>Quote</label>
                        <textarea
                            value={formData.quote || ''}
                            onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                            className={cn(
                                "w-full min-h-[150px] text-xl font-serif bg-transparent outline-none border p-4 rounded-xl resize-none",
                                isDarkMode ? "border-white/10 focus:border-accent/50 text-white placeholder:text-white/20" : "border-gray-200 focus:border-black text-gray-900"
                            )}
                            placeholder="Type the testimonial here..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className={cn("text-xs font-bold uppercase tracking-widest border-b pb-2", isDarkMode ? "border-white/10 text-white/50" : "border-black/10 text-black/50")}>Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] text-white/30 uppercase font-bold mb-1 block">Author Name</label>
                                    <input
                                        type="text"
                                        value={formData.author || ''}
                                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                        className={cn("w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent/50 transition-colors", isDarkMode ? "border-white/10 text-white" : "border-gray-300 text-black")}
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-white/30 uppercase font-bold mb-1 block">Role</label>
                                    <input
                                        type="text"
                                        value={formData.role || ''}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className={cn("w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent/50 transition-colors", isDarkMode ? "border-white/10 text-white" : "border-gray-300 text-black")}
                                        placeholder="CEO"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-white/30 uppercase font-bold mb-1 block">Company</label>
                                    <input
                                        type="text"
                                        value={formData.company || ''}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        className={cn("w-full bg-transparent border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent/50 transition-colors", isDarkMode ? "border-white/10 text-white" : "border-gray-300 text-black")}
                                        placeholder="Acme Corp"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className={cn("text-xs font-bold uppercase tracking-widest border-b pb-2", isDarkMode ? "border-white/10 text-white/50" : "border-black/10 text-black/50")}>Visuals</h3>
                            <div className="space-y-4">
                                <label className="text-[10px] text-white/30 uppercase font-bold mb-1 block">Author Image</label>
                                <div className="flex gap-4 items-center">
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className={cn(
                                            "w-20 h-20 rounded-2xl overflow-hidden border border-dashed flex items-center justify-center cursor-pointer group relative transition-all",
                                            isDarkMode ? "border-white/20 hover:border-accent hover:bg-white/5" : "border-gray-300 hover:border-accent hover:bg-white"
                                        )}
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageSelect}
                                        />
                                        {isUploadingImage ? (
                                            <Loader2 className="w-8 h-8 animate-spin opacity-50" />
                                        ) : formData.image ? (
                                            <>
                                                <img src={formData.image} alt="Author" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-bold uppercase tracking-widest text-white transition-opacity">
                                                    <Upload className="w-4 h-4" />
                                                </div>
                                            </>
                                        ) : (
                                            <Upload className="w-6 h-6 opacity-30" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-white/50 mb-2">Upload a high-res formatted image.</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] text-white/30 uppercase font-bold mb-1 block">Accent Color</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={formData.color || '#6366f1'}
                                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                            className="h-10 w-20 rounded cursor-pointer bg-transparent"
                                        />
                                        <span className="text-xs font-mono opacity-50">{formData.color}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const headerActions = document.getElementById('admin-header-actions');

    return (
        <div className="animate-in fade-in duration-500 w-full max-w-5xl mx-auto">
            {isOrderChanged && headerActions && createPortal(
                <button
                    onClick={saveOrder}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-full font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg animate-pulse"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Order
                </button>,
                headerActions
            )}

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className={cn("text-3xl font-serif font-bold", isDarkMode ? "text-white" : "text-gray-900")}>Testimonials</h2>
                </div>
                <button
                    onClick={handleCreate}
                    className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5",
                        isDarkMode ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
                    )}
                >
                    <Plus className="w-4 h-4" /> New Testimonial
                </button>
            </div>

            {fetching ? (
                <div className="py-20 text-center font-mono text-xs animate-pulse opacity-50">Loading testimonials...</div>
            ) : (
                <Reorder.Group axis="y" values={testimonials} onReorder={handleReorder} className="space-y-3 w-full">
                    {testimonials.map((t) => (
                        <Reorder.Item
                            key={t.id}
                            value={t}
                            id={String(t.id)}
                            className={cn(
                                "group relative w-full flex items-center gap-5 p-4 rounded-xl border transition-all select-none cursor-grab active:cursor-grabbing",
                                isDarkMode ? "bg-zinc-900/80 border-white/5 hover:border-white/20 hover:bg-zinc-900" : "bg-white border-gray-100 hover:border-gray-300 hover:shadow-md"
                            )}
                        >
                            {/* Drag Handle Indicator */}
                            <div className="text-white/10 group-hover:text-white/40 transition-colors">
                                <GripVertical className="w-5 h-5" />
                            </div>

                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 shrink-0 border border-white/10">
                                {t.image ? (
                                    <img src={t.image} alt={t.author} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white bg-indigo-500">
                                        {t.author.charAt(0)}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0 pr-4">
                                <div className={cn("text-base font-serif font-medium leading-snug line-clamp-1", isDarkMode ? "text-white/90" : "text-gray-900")}>{t.quote}</div>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={cn("text-[10px] font-bold uppercase tracking-widest", isDarkMode ? "text-white/40" : "text-gray-500")}>
                                        {t.author}
                                    </span>
                                    <span className="text-white/20">•</span>
                                    <span className={cn("text-[10px] font-bold uppercase tracking-widest", isDarkMode ? "text-accent" : "text-accent")}>
                                        {t.company}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-200">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(t);
                                    }}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400 hover:text-blue-300"
                                    title="Edit"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(t.id);
                                    }}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-red-500 hover:text-red-400"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            )}
            {!fetching && testimonials.length === 0 && (
                <div className="py-20 text-center opacity-50 border-2 border-dashed border-white/10 rounded-3xl">
                    <p className="text-sm uppercase tracking-widest font-bold">No testimonials found</p>
                    <p className="text-xs mt-2 opacity-50">Add one to get started</p>
                </div>
            )}
        </div>
    );
};

export default AdminTestimonials;
