import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Meal = {
  id: string
  name: string
  calories: number
  meal_type: string
  logged_at: string
  created_at: string
}

export type Workout = {
  id: string
  name: string
  exercise_type: string
  duration_minutes: number
  calories_burned: number
  intensity: string
  logged_at: string
  created_at: string
}

export type RoutineTask = {
  id: string
  title: string
  category: string
  scheduled_time: string | null
  completed: boolean
  completed_at: string | null
  due_date: string
  created_at: string
}

export type DailyGoal = {
  id: string
  date: string
  calorie_goal: number
  calorie_burn_goal: number
  workout_goal: number
  tasks_goal: number
  created_at: string
}

export type WorkoutPlan = {
  id: string
  day_of_week: string
  title: string
  exercise_type: string
  description: string | null
  scheduled_time: string | null
  is_rest_day: boolean
  created_at: string
}

export type MealType = 'café' | 'almoço' | 'lanche' | 'jantar' | 'suplemento'
export type ExerciseType = 'cardio' | 'força' | 'flexibilidade' | 'esporte'
export type Intensity = 'leve' | 'moderado' | 'intenso'
export type TaskCategory = 'saúde' | 'fitness' | 'bem-estar' | 'produtividade'
