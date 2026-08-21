import { useState, useEffect, useCallback } from 'react'
import { Dumbbell, Plus, Trash2, Heart, Zap, StretchHorizontal, Trophy } from 'lucide-react'
import { supabase, type Workout, type ExerciseType, type Intensity } from '../lib/supabase'
import { Card, Button, Input, Select, Modal, EmptyState } from '../components/ui'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const exerciseTypeLabels: Record<ExerciseType, string> = {
  'cardio': 'Cardio',
  'força': 'Musculação',
  'flexibilidade': 'Flexibilidade',
  'esporte': 'Esporte',
}

const exerciseTypeIcons: Record<ExerciseType, typeof Heart> = {
  'cardio': Heart,
  'força': Dumbbell,
  'flexibilidade': StretchHorizontal,
  'esporte': Trophy,
}

const exerciseTypeColors: Record<ExerciseType, string> = {
  'cardio': 'bg-red-50 text-red-600',
  'força': 'bg-blue-50 text-blue-600',
  'flexibilidade': 'bg-green-50 text-green-600',
  'esporte': 'bg-amber-50 text-amber-600',
}

const intensityLabels: Record<Intensity, string> = {
  'leve': 'Leve',
  'moderado': 'Moderado',
  'intenso': 'Intenso',
}

const intensityColors: Record<Intensity, string> = {
  'leve': 'bg-green-100 text-green-700',
  'moderado': 'bg-amber-100 text-amber-700',
  'intenso': 'bg-red-100 text-red-700',
}

export default function Workouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')
  const [exerciseType, setExerciseType] = useState<ExerciseType>('cardio')
  const [duration, setDuration] = useState('')
  const [caloriesBurned, setCaloriesBurned] = useState('')
  const [intensity, setIntensity] = useState<Intensity>('moderado')
  const [saving, setSaving] = useState(false)

  const today = format(new Date(), 'yyyy-MM-dd')

  const fetchWorkouts = useCallback(async () => {
    const startOfDay = `${today}T00:00:00`
    const endOfDay = `${today}T23:59:59`
    const { data } = await supabase
      .from('workouts')
      .select('*')
      .gte('logged_at', startOfDay)
      .lte('logged_at', endOfDay)
      .order('logged_at', { ascending: false })
    setWorkouts(data || [])
    setLoading(false)
  }, [today])

  useEffect(() => {
    fetchWorkouts()
  }, [fetchWorkouts])

  const handleAdd = async () => {
    if (!name.trim() || !duration) return
    setSaving(true)
    await supabase.from('workouts').insert({
      name: name.trim(),
      exercise_type: exerciseType,
      duration_minutes: parseInt(duration),
      calories_burned: parseInt(caloriesBurned) || 0,
      intensity,
      logged_at: new Date().toISOString(),
    })
    setName('')
    setDuration('')
    setCaloriesBurned('')
    setExerciseType('cardio')
    setIntensity('moderado')
    setShowAdd(false)
    setSaving(false)
    fetchWorkouts()
  }

  const handleDelete = async (id: string) => {
    await supabase.from('workouts').delete().eq('id', id)
    setWorkouts(workouts.filter((w) => w.id !== id))
  }

  const totalCaloriesBurned = workouts.reduce((sum, w) => sum + w.calories_burned, 0)
  const totalMinutes = workouts.reduce((sum, w) => sum + w.duration_minutes, 0)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Treinos</h1>
          <p className="text-sm text-neutral-500">{format(new Date(), "d 'de' MMMM", { locale: ptBR })}</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Adicionar
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-700 border-0">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-blue-100" />
            <span className="text-xs text-blue-100 font-medium">Calorias queimadas</span>
          </div>
          <p className="text-3xl font-bold text-white">{totalCaloriesBurned}<span className="text-sm font-normal text-blue-200"> kcal</span></p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-primary-500 to-primary-700 border-0">
          <div className="flex items-center gap-2 mb-1">
            <Dumbbell className="w-4 h-4 text-primary-100" />
            <span className="text-xs text-primary-100 font-medium">Tempo total</span>
          </div>
          <p className="text-3xl font-bold text-white">{totalMinutes}<span className="text-sm font-normal text-primary-200"> min</span></p>
        </Card>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      ) : workouts.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            icon={<Dumbbell className="w-7 h-7" />}
            title="Nenhum treino registrado"
            subtitle="Toque em Adicionar para registrar seu treino"
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {workouts.map((workout) => {
            const Icon = exerciseTypeIcons[workout.exercise_type as ExerciseType] || Dumbbell
            return (
              <Card key={workout.id} className="p-4 group">
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${exerciseTypeColors[workout.exercise_type as ExerciseType] || 'bg-neutral-100'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-neutral-800">{workout.name}</h3>
                      <button
                        onClick={() => handleDelete(workout.id)}
                        className="w-7 h-7 rounded-lg text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 font-medium">
                        {exerciseTypeLabels[workout.exercise_type as ExerciseType] || workout.exercise_type}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${intensityColors[workout.intensity as Intensity] || intensityColors.moderado}`}>
                        {intensityLabels[workout.intensity as Intensity] || workout.intensity}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500">
                      <span>{workout.duration_minutes} min</span>
                      {workout.calories_burned > 0 && <span>· {workout.calories_burned} kcal</span>}
                      <span className="text-neutral-300">· {format(new Date(workout.logged_at), 'HH:mm')}</span>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Adicionar treino">
        <div className="space-y-4">
          <Input label="Nome do exercício" value={name} onChange={setName} placeholder="Ex: Corrida, Supino, Yoga" />
          <Select
            label="Tipo de exercício"
            value={exerciseType}
            onChange={(v) => setExerciseType(v as ExerciseType)}
            options={(Object.keys(exerciseTypeLabels) as ExerciseType[]).map((t) => ({ value: t, label: exerciseTypeLabels[t] }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Duração (min)" value={duration} onChange={setDuration} type="number" placeholder="30" />
            <Input label="Calorias" value={caloriesBurned} onChange={setCaloriesBurned} type="number" placeholder="250" />
          </div>
          <Select
            label="Intensidade"
            value={intensity}
            onChange={(v) => setIntensity(v as Intensity)}
            options={(Object.keys(intensityLabels) as Intensity[]).map((i) => ({ value: i, label: intensityLabels[i] }))}
          />
          <Button onClick={handleAdd} className="w-full">
            {saving ? 'Salvando...' : 'Salvar treino'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
