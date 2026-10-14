import { Moon, Sun, ArrowLeft } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

export const Header = ({ theme, toggleTheme }) => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const canGoBack = location.pathname !== '/'

  return (
    <header className="absolute top-0 w-full p-6 flex justify-between items-center z-10">
      <div>
        {canGoBack && (
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors py-1 px-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft size={20} />
            <span className="font-bold text-sm">Inicio</span>
          </button>
        )}
      </div>
      <button 
        onClick={toggleTheme} 
        className="p-2 bg-slate-200 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors border border-slate-300 dark:border-slate-700"
        title="Alternar entre blanco y negro"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </header>
  )
}
