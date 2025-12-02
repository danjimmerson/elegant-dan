import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BlogPost from "./pages/BlogPost";
import FeedArchive from "./pages/FeedArchive";
import NotFound from "./pages/NotFound";
import CustomCursor from "./components/CustomCursor";
import ScrollToTop from "./components/ScrollToTop";
import { ContactProvider } from "./context/ContactContext";
import ContactDrawer from "./components/ContactDrawer";
import GlobalAudioPlayer from "./components/GlobalAudioPlayer";
import { MusicProvider } from "./context/MusicContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/feed/:slug" element={<BlogPost />} />
              <Route path="/feed" element={<FeedArchive />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </MusicProvider>
    </ContactProvider>
  </QueryClientProvider>
);

export default App;
