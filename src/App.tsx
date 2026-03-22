import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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

const queryClient = new QueryClient();

function LayoutWrap({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/traders" element={<LayoutWrap><Traders /></LayoutWrap>} />
          <Route path="/traders/:id" element={<LayoutWrap><TraderProfile /></LayoutWrap>} />
          <Route path="/copy-trading" element={<LayoutWrap><CopyTrading /></LayoutWrap>} />
          <Route path="/portfolio" element={<LayoutWrap><Portfolio /></LayoutWrap>} />
          <Route path="/market" element={<LayoutWrap><Market /></LayoutWrap>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;