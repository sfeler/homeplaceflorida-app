import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PerformanceOptimizer from '@/components/shared/PerformanceOptimizer'
import { useEffect } from 'react'
import { initClarity } from '@/utils/clarity'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

function App() {
  useEffect(() => {
    // Initialize Microsoft Clarity
    // Replace 'YOUR_CLARITY_PROJECT_ID' with your actual Clarity project ID
    const clarityProjectId = import.meta.env.VITE_CLARITY_PROJECT_ID;
    if (clarityProjectId) {
      initClarity(clarityProjectId);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <PerformanceOptimizer />
      <Pages />
      <Toaster />
    </QueryClientProvider>
  )
}

export default App 