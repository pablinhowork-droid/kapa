import { useState, useEffect } from 'react'
import { LayoutDashboard, Flame, Dumbbell, ListChecks, Calendar, LogOut } from 'lucide-react'
import Dashboard from './pages/Dashboard'
import Calories from './pages/Calories'
import Workouts from './pages/Workouts'
import Routine from './pages/Routine'
import WorkoutPlanPage from './pages/WorkoutPlan'
import Auth from './pages/Auth'
import { useAuth } from './lib/auth'

type Page = 'dashboard' | 'calories' | 'workouts' | 'routine' | 'plan'

const navItems: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
  { id: 'calories', label: 'Calorias', icon: Flame },
  { id: 'workouts', label: 'Treinos', icon: Dumbbell },
  { id: 'plan', label: 'Rotina', icon: Calendar },
  { id: 'routine', label: 'Tarefas', icon: ListChecks },
]

export default function App() {
  const { session, loading, signOut } = useAuth()
  const [page, setPage] = useState<Page>('dashboard')

  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as Page
    if (['dashboard', 'calories', 'workouts', 'routine', 'plan'].includes(hash)) {
      setPage(hash)
    }
  }, [])

  const navigate = (p: Page) => {
    setPage(p)
    window.location.hash = p
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    return <Auth />
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-neutral-800 tracking-tight">VivaBem</h1>
          </div>
          <div className="flex items-center gap-1">
            <nav className="hidden sm:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    page === item.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <button
              onClick={signOut}
              className="ml-1 w-9 h-9 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center"
              title="Sair"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 pb-24 sm:pb-6">
        <div key={page} className="animate-fade-in">
          {page === 'dashboard' && <Dashboard onNavigate={navigate} />}
          {page === 'calories' && <Calories />}
          {page === 'workouts' && <Workouts />}
          {page === 'plan' && <WorkoutPlanPage />}
          {page === 'routine' && <Routine />}
        </div>
      </main>

      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 flex items-center justify-around py-2 px-1 z-20">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all ${
                page === item.id ? 'text-primary-600' : 'text-neutral-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
