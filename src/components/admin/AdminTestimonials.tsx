import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Reorder, useDragControls } from 'framer-motion';
import { Plus, Edit2, Loader2, Save, Trash2, Upload, GripVertical } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Testimonial } from '@/data/testimonials';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";
import { useImageUpload } from '@/hooks/useImageUpload';

interface AdminTestimonialsProps {
    isDarkMode: boolean;
}

interface TestimonialItemProps {
    t: Testimonial;
    isDarkMode: boolean;
    onEdit: (t: Testimonial) => void;
    onDelete: (id: number) => void;
}

const TestimonialItem = ({ t, isDarkMode, onEdit, onDelete }: TestimonialItemProps) => {
    const dragControls = useDragControls();

    return (
        <Reorder.Item
            value={t}
            id={String(t.id)}
            dragListener={false}
            dragControls={dragControls}
            className={cn(
                "group p-6 rounded-2xl border transition-all duration-300 flex items-center gap-6 relative select-none",
                isDarkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white border-gray-200 hover:shadow-lg"
            )}
        >
            {/* Drag Handle */}
            <div
                className="cursor-grab active:cursor-grabbing p-2 hover:bg-white/10 rounded transition-colors touch-none"
                onPointerDown={(e) => dragControls.start(e)}
            >
                <GripVertical className="w-5 h-5 opacity-30 group-hover:opacity-100" />
            </div>

            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 shrink-0">
                {t.image ? (
                    <img src={t.image} alt={t.author} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white bg-indigo-500">
                        {t.author.charAt(0)}
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="text-lg font-serif font-bold truncate pr-8">{t.quote}</div>
                <div className={cn("text-xs font-bold uppercase tracking-widest mt-1", isDarkMode ? "text-gray-500" : "text-gray-400")}>
                    {t.author} • {t.company}
                </div>
            </div>

            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onEdit(t)}
                    className="p-2 hover:bg-blue-500/20 hover:text-blue-500 rounded-lg transition-colors"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onDelete(t.id)}
                    className="p-2 hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </Reorder.Item>
    );
};

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
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
                {headerActions && createPortal(
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2 bg-accent text-white rounded-full font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save
                    </button>,
                    headerActions
                )}

                <h2 className={cn("text-3xl font-serif font-bold mb-8", isDarkMode ? "text-white" : "text-gray-900")}>
                    {editingId === 0 ? "New Testimonial" : "Editing Testimonial"}
                </h2>

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
                                    onClick={() => fileInputRef.current?.click()}
                                    className={cn(
                                        "w-16 h-16 rounded-full overflow-hidden border border-dashed flex items-center justify-center cursor-pointer group relative transition-all",
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
                                                <Upload className="w-4 h-4 mr-2" /> Change
                                            </div>
                                        </>
                                    ) : (
                                        <span className="text-xs font-bold uppercase tracking-widest opacity-50">Upload</span>
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

    const headerActions = document.getElementById('admin-header-actions');

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
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

            {fetching ? (
                <div className="py-20 text-center font-mono text-xs animate-pulse opacity-50">Loading testimonials...</div>
            ) : (
                <Reorder.Group axis="y" values={testimonials} onReorder={handleReorder} className="space-y-4">
                    {testimonials.map((t) => (
                        <TestimonialItem
                            key={t.id}
                            t={t}
                            isDarkMode={isDarkMode}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </Reorder.Group>
            )}
            {!fetching && testimonials.length === 0 && (
                <div className="py-20 text-center opacity-50">
                    <p className="text-sm">No testimonials yet.</p>
                </div>
            )}
        </div>
    );
};

export default AdminTestimonials;
