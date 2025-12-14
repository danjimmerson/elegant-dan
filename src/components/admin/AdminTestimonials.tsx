import { useRef, useState, useEffect } from 'react';
import { Plus, Edit2, Loader2, Save, Trash2, Quote, Upload } from 'lucide-react';
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

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploadImage, uploading: isUploadingImage } = useImageUpload();

    // Fetch testimonials
    const fetchTestimonials = async () => {
        setFetching(true);
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .order('id', { ascending: true });

        if (!error && data) {
            setTestimonials(data as Testimonial[]);
        }
        setFetching(false);
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

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
            color: '#6366f1'
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
        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
                <div className="flex items-center justify-between mb-8 sticky top-20 z-30 py-4 backdrop-blur-md bg-opacity-80 -mx-6 px-6 border-b border-transparent transition-colors">
                    <h2 className={cn("text-lg font-bold uppercase tracking-widest", isDarkMode ? "text-white" : "text-black")}>
                        {editingId === 0 ? "New Testimonial" : "Editing Testimonial"}
                    </h2>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setEditingId(null)}
                            className={cn("px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest border transition-all", isDarkMode ? "border-white/20 hover:bg-white/10 text-white/70 hover:text-white" : "border-gray-300 hover:bg-gray-100 text-gray-600")}
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
                    </div>
                </div>

                <div className="max-w-2xl mx-auto space-y-8">
                    <div className="space-y-4">
                        <label className={cn("text-[10px] uppercase tracking-widest font-bold opacity-50 block", isDarkMode ? "text-white" : "text-black")}>Quote</label>
                        <textarea
                            value={formData.quote || ''}
                            onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                            className={cn(
                                "w-full min-h-[150px] text-xl font-serif bg-transparent outline-none border p-4 rounded-xl",
                                isDarkMode ? "border-white/20 focus:border-white text-white" : "border-gray-200 focus:border-black text-gray-900"
                            )}
                            placeholder="Type the testimonial here..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className={cn("text-[10px] uppercase tracking-widest font-bold opacity-50 block", isDarkMode ? "text-white" : "text-black")}>Author Details</label>
                            <input
                                type="text"
                                value={formData.author || ''}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                className={cn("w-full bg-transparent border-b outline-none py-2 text-sm", isDarkMode ? "border-white/20 text-white" : "border-gray-300 text-black")}
                                placeholder="Author Name"
                            />
                            <input
                                type="text"
                                value={formData.role || ''}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className={cn("w-full bg-transparent border-b outline-none py-2 text-sm", isDarkMode ? "border-white/20 text-white" : "border-gray-300 text-black")}
                                placeholder="Role (e.g. CEO)"
                            />
                            <input
                                type="text"
                                value={formData.company || ''}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                className={cn("w-full bg-transparent border-b outline-none py-2 text-sm", isDarkMode ? "border-white/20 text-white" : "border-gray-300 text-black")}
                                placeholder="Company"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className={cn("text-[10px] uppercase tracking-widest font-bold opacity-50 block", isDarkMode ? "text-white" : "text-black")}>Appearance</label>
                            <div className="flex gap-4 items-center">
                                <div
                                    className="w-16 h-16 rounded-full overflow-hidden border border-dashed flex items-center justify-center bg-gray-100 dark:bg-white/5 cursor-pointer relative group"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                    />
                                    {isUploadingImage ? (
                                        <Loader2 className="w-6 h-6 animate-spin opacity-50" />
                                    ) : formData.image ? (
                                        <>
                                            <img src={formData.image} alt="Avatar" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <Upload className="w-4 h-4 text-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <span className="text-[9px] uppercase">Img</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="color"
                                        value={formData.color || '#6366f1'}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="h-10 w-full rounded cursor-pointer"
                                    />
                                    <span className="text-[10px] opacity-50 uppercase tracking-widest">Brand Color</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className={cn("text-3xl font-serif font-bold", isDarkMode ? "text-white" : "text-gray-900")}>Testimonials</h2>
                    <p className={cn("text-sm mt-1", isDarkMode ? "text-gray-400" : "text-gray-500")}>Manage social proof.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-xl",
                        isDarkMode ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
                    )}
                >
                    <Plus className="w-4 h-4" /> New Testimonial
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {fetching ? (
                    <div className="py-20 text-center font-mono text-xs animate-pulse opacity-50">Loading testimonials...</div>
                ) : (
                    testimonials.map((t) => (
                        <div key={t.id} className={cn(
                            "group p-6 rounded-2xl border transition-all duration-300 flex items-start gap-6",
                            isDarkMode ? "bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10" : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-xl"
                        )}>
                            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 mt-1 ring-2 ring-offset-2 ring-offset-black" style={{ '--tw-ring-color': t.color } as React.CSSProperties}>
                                <img src={t.image} alt={t.author} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className={cn("font-bold", isDarkMode ? "text-white" : "text-gray-900")}>{t.author}</h3>
                                        <p className="text-xs opacity-60 uppercase tracking-widest">{t.role}, {t.company}</p>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(t)}
                                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(t.id)}
                                            className="p-2 rounded-full hover:bg-red-500/20 text-red-500 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="relative pl-4 border-l-2 border-white/10">
                                    <Quote className="w-4 h-4 absolute -top-1 -left-1 opacity-20" />
                                    <p className={cn("text-sm font-serif leading-relaxed line-clamp-2", isDarkMode ? "text-gray-300" : "text-gray-600")}>
                                        {t.quote}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {!fetching && testimonials.length === 0 && (
                    <div className="py-20 text-center opacity-50">
                        <p className="text-sm">No testimonials yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminTestimonials;
