
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateTicket from "./pages/CreateTicket";
import QRDisplay from "./pages/QRDisplay";
import ClientTicket from "./pages/ClientTicket";
import TestVoiceSystem from "./pages/TestVoiceSystem";
import Entry from "./pages/Entry";
import ScanClose from "./components/ScanClose";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <MainLayout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Entry />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/entry" element={
              <ProtectedRoute>
                <Entry />
              </ProtectedRoute>
            } />
            <Route path="/create-ticket" element={
              <ProtectedRoute>
                <CreateTicket />
              </ProtectedRoute>
            } />
            <Route path="/qr-display" element={
              <ProtectedRoute>
                <QRDisplay />
              </ProtectedRoute>
            } />
            <Route path="/scan-close" element={
              <ProtectedRoute>
                <ScanClose />
              </ProtectedRoute>
            } />
            <Route path="/test-voice" element={
              <ProtectedRoute>
                <TestVoiceSystem />
              </ProtectedRoute>
            } />
            {/* Public ticket route - no authentication required */}
            <Route path="/ticket/:ticketId" element={<ClientTicket />} />
            <Route path="*" element={
              <ProtectedRoute>
                <NotFound />
              </ProtectedRoute>
            } />
          </Routes>
        </MainLayout>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
