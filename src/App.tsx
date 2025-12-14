import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

const Index = lazy(() => import("./pages/Index"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const FeedArchive = lazy(() => import("./pages/FeedArchive"));
const NotFound = lazy(() => import("./pages/NotFound"));
import CustomCursor from "./components/CustomCursor";
import ScrollToTop from "./components/ScrollToTop";
import { ContactProvider } from "./context/ContactContext";
import ContactDrawer from "./components/ContactDrawer";
import GlobalAudioPlayer from "./components/GlobalAudioPlayer";
import { MusicProvider } from "./context/MusicContext";

const Login = lazy(() => import("./pages/Login"));
const Admin = lazy(() => import("./pages/Admin"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ContactProvider>
        <MusicProvider>
          <GlobalAudioPlayer />
          <TooltipProvider>
            <CustomCursor />
            <Toaster />
            <Sonner />
            <ContactDrawer />
            <BrowserRouter>
              <ScrollToTop />
              <Suspense fallback={<div className="min-h-screen bg-cream flex items-center justify-center">Loading...</div>}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/feed/:slug" element={<BlogPost />} />
                  <Route path="/feed" element={<FeedArchive />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </MusicProvider>
      </ContactProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
