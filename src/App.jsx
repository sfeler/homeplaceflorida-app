import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PerformanceOptimizer from '@/components/shared/PerformanceOptimizer'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PerformanceOptimizer />
      <Pages />
      <Toaster />
    </QueryClientProvider>
  )
}

export default App 