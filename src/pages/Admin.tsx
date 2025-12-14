import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { LogOut, LayoutList, MessageSquareQuote, ChevronLeft, ChevronRight, Sun, Moon, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import TrippyVisuals from '@/components/TrippyVisuals';
import { cn } from "@/lib/utils";
import AdminFeed from '@/components/admin/AdminFeed';
import AdminTestimonials from '@/components/admin/AdminTestimonials';

type AdminTab = 'feed' | 'testimonials';

const Admin = () => {
    const { user, loading } = useAuth();
    const [activeTab, setActiveTab] = useState<AdminTab>('feed');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);

    if (loading) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">LOADING SYSTEM...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (user.email !== 'jimmerson@gmail.com') {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-mono">
                <div className="text-red-500 font-bold mb-4 uppercase tracking-widest text-xl animate-pulse">Access Denied</div>
                <button onClick={() => supabase.auth.signOut()} className="text-sm underline opacity-50 hover:opacity-100">Sign Out</button>
            </div>
        );
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <div className={cn(
            "min-h-screen flex transition-colors duration-500",
            isDarkMode ? "bg-black text-white" : "bg-gray-50 text-black"
        )}>
            {/* Trippy BG */}
            <div className={cn("fixed inset-0 z-0 pointer-events-none transition-opacity duration-500", isDarkMode ? "opacity-30" : "opacity-0")}>
                <TrippyVisuals isPlaying={true} mode={1} />
            </div>

            {/* Sidebar */}
            <aside className={cn(
                "fixed left-0 top-0 bottom-0 z-40 border-r backdrop-blur-md transition-all duration-300 flex flex-col",
                isDarkMode ? "bg-black/80 border-white/10" : "bg-white/80 border-gray-200",
                isSidebarCollapsed ? "w-20" : "w-64"
            )}>
                {/* Sidebar Header */}
                <div className="h-16 flex items-center px-6 border-b border-transparent">
                    {!isSidebarCollapsed && (
                        <span className="font-serif font-bold text-xl tracking-tight">DanOS</span>
                    )}
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className={cn("p-2 rounded-lg hover:bg-white/10 transition-colors ml-auto", isSidebarCollapsed && "mx-auto")}
                    >
                        {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 py-8 space-y-2 px-3">
                    <button
                        onClick={() => setActiveTab('feed')}
                        className={cn(
                            "w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all group",
                            activeTab === 'feed'
                                ? "bg-accent text-white shadow-lg shadow-accent/20"
                                : (isDarkMode ? "hover:bg-white/10 text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-500 hover:text-black")
                        )}
                        title="Feed"
                    >
                        <LayoutList className="w-5 h-5 shrink-0" />
                        {!isSidebarCollapsed && <span className="font-bold text-xs uppercase tracking-widest">Feed</span>}
                    </button>

                    <button
                        onClick={() => setActiveTab('testimonials')}
                        className={cn(
                            "w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all group",
                            activeTab === 'testimonials'
                                ? "bg-accent text-white shadow-lg shadow-accent/20"
                                : (isDarkMode ? "hover:bg-white/10 text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-500 hover:text-black")
                        )}
                        title="Testimonials"
                    >
                        <MessageSquareQuote className="w-5 h-5 shrink-0" />
                        {!isSidebarCollapsed && <span className="font-bold text-xs uppercase tracking-widest">Testimonials</span>}
                    </button>
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 space-y-2 border-t border-transparent">
                    <Link to="/" className={cn(
                        "w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all opacity-50 hover:opacity-100",
                        isDarkMode ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-600"
                    )}>
                        <ArrowLeft className="w-5 h-5 shrink-0" />
                        {!isSidebarCollapsed && <span className="font-bold text-xs uppercase tracking-widest">Exit to Site</span>}
                    </Link>

                    <button
                        onClick={handleLogout}
                        className={cn(
                            "w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all opacity-50 hover:opacity-100 hover:text-red-500",
                            isDarkMode ? "hover:bg-red-500/10 text-gray-400" : "hover:bg-red-50 text-gray-600"
                        )}
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        {!isSidebarCollapsed && <span className="font-bold text-xs uppercase tracking-widest">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={cn(
                "flex-1 relative z-10 transition-all duration-300 min-h-screen",
                isSidebarCollapsed ? "ml-20" : "ml-64"
            )}>
                {/* Top Bar for Theme Toggle */}
                <header className="sticky top-0 z-30 h-16 flex items-center justify-end px-8">
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={cn("p-2 rounded-full transition-colors", isDarkMode ? "hover:bg-white/10 text-yellow-400" : "hover:bg-gray-100 text-gray-600")}
                    >
                        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                </header>

                <div className="px-8 lg:px-12 pb-24 max-w-7xl mx-auto">
                    {activeTab === 'feed' && <AdminFeed isDarkMode={isDarkMode} />}
                    {activeTab === 'testimonials' && <AdminTestimonials isDarkMode={isDarkMode} />}
                </div>
            </main>
        </div>
    );
};

export default Admin;
