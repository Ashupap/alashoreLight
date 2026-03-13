import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense, lazy, useEffect } from "react";
import BeautifulLoader from "@/components/ui/beautiful-loader";
import { initializePerformance, preventLayoutShifts } from "@/utils/performance";

// Lazy load pages for better performance
const Home = lazy(() => import("@/pages/home"));
const AboutUs = lazy(() => import("@/pages/about-us"));
const Products = lazy(() => import("@/pages/products"));
const Sustainability = lazy(() => import("@/pages/sustainability"));
const Media = lazy(() => import("@/pages/media"));
const Contact = lazy(() => import("@/pages/contact"));
const Blog = lazy(() => import("@/pages/blog"));
const MarketingTeam = lazy(() => import("@/pages/marketing-team"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Beautiful loading component

function Router() {
  return (
    <Suspense fallback={<BeautifulLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about-us" component={AboutUs} />
        <Route path="/products" component={Products} />
        <Route path="/sustainability" component={Sustainability} />
        <Route path="/media" component={Media} />
        <Route path="/contact" component={Contact} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={Blog} />
        <Route path="/connect" component={MarketingTeam} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  // Initialize performance optimizations
  useEffect(() => {
    initializePerformance();
    preventLayoutShifts();
  }, []);

  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;
