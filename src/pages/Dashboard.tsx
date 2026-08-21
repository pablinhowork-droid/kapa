import { useState, useEffect, useCallback } from 'react'
import { Flame, Dumbbell, ListChecks, TrendingUp, ChevronRight, Bell, Bed, AlertCircle } from 'lucide-react'
import { supabase, type Meal, type Workout, type RoutineTask, type DailyGoal } from '../lib/supabase'
import { getWorkoutNotification } from '../lib/workoutPlan'
import { Card, ProgressBar, Button } from '../components/ui'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Page = 'dashboard' | 'calories' | 'workouts' | 'routine' | 'plan'

type Notification = {
  type: 'workout' | 'rest' | 'none'
  message: string
}

export default function Dashboard({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [meals, setMeals] = useState<Meal[]>([])
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [tasks, setTasks] = useState<RoutineTask[]>([])
  const [goals, setGoals] = useState<DailyGoal | null>(null)
  const [notification, setNotification] = useState<Notification | null>(null)
  const [loading, setLoading] = useState(true)

  const today = format(new Date(), 'yyyy-MM-dd')

  const fetchAll = useCallback(async () => {
    const startOfDay = `${today}T00:00:00`
    const endOfDay = `${today}T23:59:59`

    const [mealsRes, workoutsRes, tasksRes, goalsRes, notif] = await Promise.all([
      supabase.from('meals').select('*').gte('logged_at', startOfDay).lte('logged_at', endOfDay).order('logged_at'),
      supabase.from('workouts').select('*').gte('logged_at', startOfDay).lte('logged_at', endOfDay).order('logged_at'),
      supabase.from('routine_tasks').select('*').eq('due_date', today).order('scheduled_time', { nullsFirst: false }),
      supabase.from('daily_goals').select('*').eq('date', today).maybeSingle(),
      getWorkoutNotification(),
    ])

    setMeals(mealsRes.data || [])
    setWorkouts(workoutsRes.data || [])
    setTasks(tasksRes.data || [])
    setGoals(goalsRes.data)
    setNotification(notif)
    setLoading(false)
  }, [today])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const caloriesConsumed = meals.reduce((sum, m) => sum + m.calories, 0)
  const caloriesBurned = workouts.reduce((sum, w) => sum + w.calories_burned, 0)
  const workoutMinutes = workouts.reduce((sum, w) => sum + w.duration_minutes, 0)
  const completedTasks = tasks.filter((t) => t.completed).length

  const calorieGoal = goals?.calorie_goal || 2000
  const burnGoal = goals?.calorie_burn_goal || 500
  const workoutGoal = goals?.workout_goal || 30
  const tasksGoal = goals?.tasks_goal || 5

  const netCalories = caloriesConsumed - caloriesBurned

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-neutral-500 capitalize">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
        </p>
        <h1 className="text-2xl font-bold text-neutral-800 mt-0.5">Olá! Vamos lá?</h1>
      </div>

      {/* Notificação de treino / descanso */}
      {notification && (
        <Card
          className={`p-4 border-2 ${
            notification.type === 'rest'
              ? 'bg-blue-50 border-blue-200'
              : notification.type === 'workout'
              ? 'bg-primary-50 border-primary-200'
              : 'bg-amber-50 border-amber-200'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                notification.type === 'rest'
                  ? 'bg-blue-100 text-blue-600'
                  : notification.type === 'workout'
                  ? 'bg-primary-100 text-primary-600'
                  : 'bg-amber-100 text-amber-600'
              }`}
            >
              {notification.type === 'rest' ? (
                <Bed className="w-5 h-5" />
              ) : notification.type === 'workout' ? (
                <Dumbbell className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Bell className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  {notification.type === 'rest' ? 'Dia de descanso' : notification.type === 'workout' ? 'Treino de hoje' : 'Aviso'}
                </span>
              </div>
              <p className="text-sm text-neutral-700 font-medium">{notification.message}</p>
              {notification.type === 'none' && (
                <button
                  onClick={() => onNavigate('plan')}
                  className="text-xs text-primary-600 font-medium mt-1.5 hover:underline"
                >
                  Criar rotina de treinos
                </button>
              )}
              {notification.type === 'workout' && (
                <button
                  onClick={() => onNavigate('workouts')}
                  className="text-xs text-primary-600 font-medium mt-1.5 hover:underline"
                >
                  Registrar treino agora
                </button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Hero - Calorias */}
      <Card className="p-5 bg-gradient-to-br from-primary-600 to-primary-800 border-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-primary-100 text-sm font-medium">Calorias hoje</p>
            <p className="text-3xl font-bold text-white mt-1">{netCalories} kcal</p>
            <p className="text-primary-200 text-xs mt-1">
              {caloriesConsumed} consumidas · {caloriesBurned} queimadas
            </p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center">
            <Flame className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-primary-100">
            <span>Meta: {calorieGoal} kcal</span>
            <span>{Math.round((netCalories / calorieGoal) * 100)}%</span>
          </div>
          <div className="w-full h-2.5 bg-primary-900/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (netCalories / calorieGoal) * 100)}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-accent-50 flex items-center justify-center">
              <Flame className="w-4 h-4 text-accent-600" />
            </div>
            <span className="text-xs font-medium text-neutral-500">Queimadas</span>
          </div>
          <p className="text-2xl font-bold text-neutral-800">{caloriesBurned}</p>
          <div className="mt-2">
            <ProgressBar value={caloriesBurned} max={burnGoal} color="accent" />
          </div>
          <p className="text-xs text-neutral-400 mt-1">Meta: {burnGoal} kcal</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Dumbbell className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-neutral-500">Treino</span>
          </div>
          <p className="text-2xl font-bold text-neutral-800">{workoutMinutes}<span className="text-base font-normal text-neutral-400">min</span></p>
          <div className="mt-2">
            <ProgressBar value={workoutMinutes} max={workoutGoal} color="blue" />
          </div>
          <p className="text-xs text-neutral-400 mt-1">Meta: {workoutGoal} min</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
              <ListChecks className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-xs font-medium text-neutral-500">Tarefas</span>
          </div>
          <p className="text-2xl font-bold text-neutral-800">{completedTasks}<span className="text-base font-normal text-neutral-400">/{tasks.length}</span></p>
          <div className="mt-2">
            <ProgressBar value={completedTasks} max={tasksGoal} color="green" />
          </div>
          <p className="text-xs text-neutral-400 mt-1">Meta: {tasksGoal} tarefas</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary-600" />
            </div>
            <span className="text-xs font-medium text-neutral-500">Consumidas</span>
          </div>
          <p className="text-2xl font-bold text-neutral-800">{caloriesConsumed}</p>
          <div className="mt-2">
            <ProgressBar value={caloriesConsumed} max={calorieGoal} color="primary" />
          </div>
          <p className="text-xs text-neutral-400 mt-1">Meta: {calorieGoal} kcal</p>
        </Card>
      </div>

      {/* Atalhos rápidos */}
      <div>
        <h2 className="text-sm font-semibold text-neutral-500 mb-3">Acesso rápido</h2>
        <div className="space-y-2">
          <QuickAction
            icon={<Flame className="w-5 h-5 text-accent-600" />}
            title="Registrar refeição"
            subtitle={`${meals.length} refeições hoje`}
            onClick={() => onNavigate('calories')}
          />
          <QuickAction
            icon={<Dumbbell className="w-5 h-5 text-blue-600" />}
            title="Registrar treino"
            subtitle={`${workouts.length} treinos hoje`}
            onClick={() => onNavigate('workouts')}
          />
          <QuickAction
            icon={<ListChecks className="w-5 h-5 text-green-600" />}
            title="Ver tarefas"
            subtitle={`${completedTasks} de ${tasks.length} concluídas`}
            onClick={() => onNavigate('routine')}
          />
        </div>
      </div>
    </div>
  )
}

function QuickAction({ icon, title, subtitle, onClick }: { icon: React.ReactNode; title: string; subtitle: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3.5 bg-white rounded-xl border border-neutral-200 hover:border-primary-300 hover:shadow-sm transition-all group"
    >
      <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center group-hover:scale-105 transition-transform">
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p className="font-medium text-neutral-800">{title}</p>
        <p className="text-xs text-neutral-400">{subtitle}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-primary-500 transition-colors" />
    </button>
  )
}
