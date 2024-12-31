import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/seo/meta-tags";
import { PerformanceMonitor } from "@/components/performance/PerformanceMonitor";
import Index from "@/pages/Index";
import TryNow from "@/pages/TryNow";
import Features from "@/pages/Features";
import HowItWorks from "@/pages/HowItWorks";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import { initGA, logPageView } from "@/utils/analytics";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  useEffect(() => {
    initGA();
    logPageView();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" enableSystem>
        <BrowserRouter>
          <TooltipProvider>
            <div className="min-h-screen bg-background">
              <SEO />
              <PerformanceMonitor />
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow pt-16">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/try-now" element={<TryNow />} />
                    <Route path="/features" element={<Features />} />
                    <Route path="/how-it-works" element={<HowItWorks />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </div>
            <Toaster />
          </TooltipProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
