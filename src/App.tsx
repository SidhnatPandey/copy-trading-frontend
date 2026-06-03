import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute, PublicRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Traders from "./pages/Traders";
import TraderProfile from "./pages/TraderProfile";
import CopyTrading from "./pages/CopyTrading";
import Portfolio from "./pages/Portfolio";
import Market from "./pages/Market";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import ResetPassword from "./pages/Reset-password";
import ForgotPassword from "./pages/Forgot-password";

const queryClient = new QueryClient();

function LayoutWrap({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route
              path="/"
              element={<Navigate to="/login" replace />}
            />
            <Route
              path="/login"
              element={
                <PublicRoute restricted redirectPath="/traders">
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute restricted redirectPath="/traders">
                  <Signup />
                </PublicRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicRoute restricted redirectPath="/traders">
                  <ForgotPassword />
                </PublicRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <PublicRoute restricted redirectPath="/traders">
                  <ResetPassword />
                </PublicRoute>
              }
            />

            {/* Protected routes */}
            <Route
              path="/traders"
              element={
                <ProtectedRoute>
                  <LayoutWrap>
                    <Traders />
                  </LayoutWrap>
                </ProtectedRoute>
              }
            />
            <Route
              path="/traders/:id"
              element={
                <ProtectedRoute>
                  <LayoutWrap>
                    <TraderProfile />
                  </LayoutWrap>
                </ProtectedRoute>
              }
            />
            <Route
              path="/copy-trading"
              element={
                <ProtectedRoute>
                  <LayoutWrap>
                    <CopyTrading />
                  </LayoutWrap>
                </ProtectedRoute>
              }
            />
            <Route
              path="/portfolio"
              element={
                <ProtectedRoute>
                  <LayoutWrap>
                    <Portfolio />
                  </LayoutWrap>
                </ProtectedRoute>
              }
            />
            <Route
              path="/market"
              element={
                <ProtectedRoute>
                  <LayoutWrap>
                    <Market />
                  </LayoutWrap>
                </ProtectedRoute>
              }
            />

            {/* Special routes */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;