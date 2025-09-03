import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { isIOSPWA } from "@/lib/utils";
import Index from "./pages/Index";
import ColorsGuide from "./pages/ColorsGuide";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    if (isIOSPWA()) {
      // Add PWA-specific class for styling
      document.body.classList.add('pwa-no-zoom');
      
      // Update viewport meta to disable zoom
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
        );
      }

      // Prevent pinch-to-zoom
      const preventZoom = (e: TouchEvent) => {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      };

      // Prevent double-tap zoom
      let lastTouchEnd = 0;
      const preventDoubleTapZoom = (e: TouchEvent) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
          e.preventDefault();
        }
        lastTouchEnd = now;
      };

      document.addEventListener('touchstart', preventZoom, { passive: false });
      document.addEventListener('touchend', preventDoubleTapZoom, { passive: false });

      return () => {
        document.body.classList.remove('pwa-no-zoom');
        document.removeEventListener('touchstart', preventZoom);
        document.removeEventListener('touchend', preventDoubleTapZoom);
        
        // Restore original viewport
        if (viewportMeta) {
          viewportMeta.setAttribute('content', 
            'width=device-width, initial-scale=1.0, viewport-fit=cover'
          );
        }
      };
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/colors-guide" element={<ColorsGuide />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
