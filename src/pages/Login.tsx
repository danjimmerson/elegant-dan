import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { ArrowRight, Loader2, Lock } from 'lucide-react';
import Navigation from '@/components/Navigation';
import TrippyVisuals from '@/components/TrippyVisuals';
import { toast } from 'sonner';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Welcome back, Commander.");
            navigate('/admin');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-black flex flex-col relative overflow-hidden text-white selection:bg-accent selection:text-black">
            <div className="absolute inset-0 z-0 opacity-40">
                <TrippyVisuals isPlaying={true} mode={0} />
            </div>

            <div className="relative z-10 w-full pt-12">
                <Navigation alwaysShowBackground={false} />
            </div>

            <div className="flex-1 flex items-center justify-center px-6 relative z-10">
                <div className="w-full max-w-md bg-black/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-4 border border-white/10">
                            <Lock className="w-5 h-5 text-accent" />
                        </div>
                        <h1 className="text-4xl font-serif font-bold tracking-tight mb-2">
                            Enter System
                        </h1>
                        <p className="text-gray-400 font-mono text-xs uppercase tracking-widest">
                            Secure Admin Portal
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-2">Email Identity</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-accent outline-none transition-all font-sans text-white placeholder-gray-600 focus:bg-white/10"
                                placeholder="admin@domain.com"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-2">Passcode</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-accent outline-none transition-all font-sans text-white placeholder-gray-600 focus:bg-white/10"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 mt-4 bg-white text-black rounded-xl font-bold uppercase tracking-widest hover:bg-accent hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-accent/50"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>Authenticate <ArrowRight className="w-5 h-5" /></>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
