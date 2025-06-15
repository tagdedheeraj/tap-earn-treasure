
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import GadgetsPage from "./pages/GadgetsPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminSettings from "./pages/AdminSettings";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminTest from "./pages/AdminTest";
import AuthGuard from "./components/AuthGuard";
import AdminGuard from "./components/admin/AdminGuard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={
                  <AuthGuard>
                    <Index />
                  </AuthGuard>
                } />
                <Route path="/auth" element={<Auth />} />
                <Route path="/gadgets" element={
                  <AuthGuard>
                    <GadgetsPage />
                  </AuthGuard>
                } />
                
                {/* Admin Test Route - For debugging */}
                <Route path="/admin-test" element={
                  <AuthGuard>
                    <AdminTest />
                  </AuthGuard>
                } />
                
                {/* Admin Routes - Now properly protected */}
                <Route path="/admin" element={
                  <AdminGuard>
                    <AdminDashboard />
                  </AdminGuard>
                } />
                <Route path="/admin/users" element={
                  <AdminGuard>
                    <AdminUsers />
                  </AdminGuard>
                } />
                <Route path="/admin/settings" element={
                  <AdminGuard>
                    <AdminSettings />
                  </AdminGuard>
                } />
                <Route path="/admin/analytics" element={
                  <AdminGuard>
                    <AdminAnalytics />
                  </AdminGuard>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
