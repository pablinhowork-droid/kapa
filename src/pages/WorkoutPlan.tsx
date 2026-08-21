import { useState, useEffect, useCallback } from 'react'
import { Calendar, Plus, Trash2, Dumbbell, Bed, Clock, Edit3, Check } from 'lucide-react'
import { supabase, type WorkoutPlan } from '../lib/supabase'
import { weekDays, getDayOfWeekLabel, getCurrentDayOfWeek } from '../lib/workoutPlan'
import { Card, Button, Input, Select, Modal, EmptyState } from '../components/ui'

const exerciseTypeLabels: Record<string, string> = {
  'cardio': 'Cardio',
  'forca': 'Musculação',
  'flexibilidade': 'Flexibilidade',
  'esporte': 'Esporte',
  'descanso': 'Descanso',
}

const exerciseTypeColors: Record<string, string> = {
  'cardio': 'bg-red-50 text-red-600',
  'forca': 'bg-blue-50 text-blue-600',
  'flexibilidade': 'bg-green-50 text-green-600',
  'esporte': 'bg-amber-50 text-amber-600',
  'descanso': 'bg-neutral-100 text-neutral-500',
}

export default function WorkoutPlanPage() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editingDay, setEditingDay] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [dayOfWeek, setDayOfWeek] = useState('segunda')
  const [exerciseType, setExerciseType] = useState('forca')
  const [description, setDescription] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [isRestDay, setIsRestDay] = useState(false)
  const [saving, setSaving] = useState(false)

  const currentDay = getCurrentDayOfWeek()

  const fetchPlans = useCallback(async () => {
    const { data } = await supabase.from('workout_plans').select('*').order('created_at')
    setPlans(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchPlans()
  }, [fetchPlans])

  const openAddForDay = (day: string) => {
    setEditingDay(day)
    setDayOfWeek(day)
    const existing = plans.find((p) => p.day_of_week === day)
    if (existing) {
      setTitle(existing.title)
      setExerciseType(existing.exercise_type)
      setDescription(existing.description || '')
      setScheduledTime(existing.scheduled_time || '')
      setIsRestDay(existing.is_rest_day)
    } else {
      setTitle('')
      setExerciseType('forca')
      setDescription('')
      setScheduledTime('')
      setIsRestDay(false)
    }
    setShowAdd(true)
  }

  const handleSave = async () => {
    if (!title.trim() && !isRestDay) return
    setSaving(true)

    const finalTitle = isRestDay ? 'Descanso' : title.trim()
    const finalType = isRestDay ? 'descanso' : exerciseType

    const existing = plans.find((p) => p.day_of_week === dayOfWeek)
    if (existing) {
      await supabase
        .from('workout_plans')
        .update({
          title: finalTitle,
          exercise_type: finalType,
          description: description.trim() || null,
          scheduled_time: scheduledTime || null,
          is_rest_day: isRestDay,
        })
        .eq('id', existing.id)
    } else {
      await supabase.from('workout_plans').insert({
        day_of_week: dayOfWeek,
        title: finalTitle,
        exercise_type: finalType,
        description: description.trim() || null,
        scheduled_time: scheduledTime || null,
        is_rest_day: isRestDay,
      })
    }

    setShowAdd(false)
    setSaving(false)
    setTitle('')
    setDescription('')
    setScheduledTime('')
    setIsRestDay(false)
    setEditingDay(null)
    fetchPlans()
  }

  const handleDelete = async (id: string) => {
    await supabase.from('workout_plans').delete().eq('id', id)
    setPlans(plans.filter((p) => p.id !== id))
  }

  const getPlanForDay = (day: string) => plans.find((p) => p.day_of_week === day)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-neutral-800">Rotina de Treinos</h1>
        <p className="text-sm text-neutral-500">Planeje sua semana e seus dias de descanso</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      ) : plans.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            icon={<Calendar className="w-7 h-7" />}
            title="Sua rotina está vazia"
            subtitle="Toque em um dia da semana para planejar seu treino"
          />
        </Card>
      ) : null}

      {/* Lista de dias da semana */}
      <div className="space-y-2.5">
        {weekDays.map((day) => {
          const plan = getPlanForDay(day)
          const isToday = day === currentDay
          return (
            <Card
              key={day}
              className={`p-4 ${isToday ? 'border-primary-300 ring-1 ring-primary-200' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${
                  isToday ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-500'
                }`}>
                  <span className="text-xs font-bold uppercase">{getDayOfWeekLabel(day).slice(0, 3)}</span>
                </div>

                <div className="flex-1 min-w-0">
                  {plan ? (
                    <div>
                      <div className="flex items-center gap-2">
                        {plan.is_rest_day ? (
                          <Bed className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        ) : (
                          <Dumbbell className={`w-4 h-4 flex-shrink-0 ${exerciseTypeColors[plan.exercise_type]?.split(' ')[1] || 'text-neutral-600'}`} />
                        )}
                        <h3 className="font-semibold text-neutral-800 truncate">{plan.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${exerciseTypeColors[plan.exercise_type] || exerciseTypeColors.descanso}`}>
                          {exerciseTypeLabels[plan.exercise_type] || plan.exercise_type}
                        </span>
                        {plan.scheduled_time && (
                          <span className="flex items-center gap-1 text-xs text-neutral-400">
                            <Clock className="w-3 h-3" />
                            {plan.scheduled_time.slice(0, 5)}
                          </span>
                        )}
                        {plan.description && (
                          <span className="text-xs text-neutral-400 truncate">{plan.description}</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-medium text-neutral-400">Nenhum treino planejado</h3>
                      <p className="text-xs text-neutral-300 mt-0.5">Toque no lápis para adicionar</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => openAddForDay(day)}
                    className="w-8 h-8 rounded-lg text-neutral-400 hover:text-primary-600 hover:bg-primary-50 transition-colors flex items-center justify-center"
                  >
                    {plan ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                  {plan && (
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="w-8 h-8 rounded-lg text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              {isToday && (
                <div className="mt-2 pt-2 border-t border-neutral-100">
                  <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">Hoje</span>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title={`Treino - ${getDayOfWeekLabel(editingDay || dayOfWeek)}`}>
        <div className="space-y-4">
          {/* Toggle: treino ou descanso */}
          <div className="flex gap-2">
            <button
              onClick={() => setIsRestDay(false)}
              className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-1.5 ${
                !isRestDay
                  ? 'bg-primary-50 text-primary-700 border-2 border-primary-300'
                  : 'bg-neutral-50 text-neutral-400 border-2 border-transparent hover:bg-neutral-100'
              }`}
            >
              <Dumbbell className="w-4 h-4" /> Treino
            </button>
            <button
              onClick={() => setIsRestDay(true)}
              className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-1.5 ${
                isRestDay
                  ? 'bg-blue-50 text-blue-700 border-2 border-blue-300'
                  : 'bg-neutral-50 text-neutral-400 border-2 border-transparent hover:bg-neutral-100'
              }`}
            >
              <Bed className="w-4 h-4" /> Descanso
            </button>
          </div>

          {!isRestDay && (
            <>
              <Input
                label="Nome do treino"
                value={title}
                onChange={setTitle}
                placeholder="Ex: Treino A - Peito e Tríceps"
              />
              <Select
                label="Tipo de exercício"
                value={exerciseType}
                onChange={setExerciseType}
                options={[
                  { value: 'cardio', label: 'Cardio' },
                  { value: 'forca', label: 'Musculação' },
                  { value: 'flexibilidade', label: 'Flexibilidade' },
                  { value: 'esporte', label: 'Esporte' },
                ]}
              />
              <Input
                label="Descrição (opcional)"
                value={description}
                onChange={setDescription}
                placeholder="Ex: 4 séries de 12 repetições"
              />
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-1.5">
              {isRestDay ? 'Horário do descanso (opcional)' : 'Horário do treino (opcional)'}
            </label>
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
