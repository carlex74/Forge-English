import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { useTheme } from './core/hooks/useTheme'
import { Header } from './components/ui/Header'
import { MenuPage } from './pages/MenuPage'
import { ExercisePage } from './pages/ExercisePage'

function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Router>
      <div className="min-h-screen flex flex-col relative font-sans">
        <Toaster position="bottom-center" />

        <Header theme={theme} toggleTheme={toggleTheme} />

        <main className="flex-1 flex flex-col items-center justify-center p-6 mt-16">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<MenuPage />} />
              <Route path="/exercise/:difficulty/:mode" element={<ExercisePage />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  )
}

export default App
