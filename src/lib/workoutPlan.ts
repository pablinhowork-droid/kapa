import { supabase, type WorkoutPlan } from './supabase'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Mapeia dia da semana em português para o formato armazenado
export function getCurrentDayOfWeek(): string {
  const days = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado']
  return days[new Date().getDay()]
}

export function getDayOfWeekLabel(day: string): string {
  const labels: Record<string, string> = {
    'segunda': 'Segunda',
    'terca': 'Terça',
    'quarta': 'Quarta',
    'quinta': 'Quinta',
    'sexta': 'Sexta',
    'sabado': 'Sábado',
    'domingo': 'Domingo',
  }
  return labels[day] || day
}

export const weekDays = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo']

// Busca o treino planejado para hoje
export async function getTodayWorkoutPlan(): Promise<WorkoutPlan | null> {
  const today = getCurrentDayOfWeek()
  const { data } = await supabase
    .from('workout_plans')
    .select('*')
    .eq('day_of_week', today)
    .maybeSingle()
  return data
}

// Verifica se hoje é dia de descanso
export async function isRestDayToday(): Promise<boolean> {
  const plan = await getTodayWorkoutPlan()
  return plan?.is_rest_day ?? false
}

// Gera mensagem de notificação sobre o treino de hoje
export async function getWorkoutNotification(): Promise<{ type: 'workout' | 'rest' | 'none'; message: string; plan?: WorkoutPlan }> {
  const plan = await getTodayWorkoutPlan()
  if (!plan) {
    return { type: 'none', message: 'Nenhum treino planejado para hoje. Que tal criar sua rotina semanal?' }
  }
  if (plan.is_rest_day) {
    return {
      type: 'rest',
      message: 'Hoje é dia de descanso! Aproveite para recuperar os músculos.',
      plan,
    }
  }
  const timeStr = plan.scheduled_time ? ` às ${plan.scheduled_time.slice(0, 5)}` : ''
  return {
    type: 'workout',
    message: `Treino de hoje: ${plan.title}${timeStr}`,
    plan,
  }
}
