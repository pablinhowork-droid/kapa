import { useState, useEffect, useCallback } from 'react'
import { Flame, Plus, Trash2, Coffee, Sun, Cookie, Moon, Zap, Sparkles, Edit3 } from 'lucide-react'
import { supabase, type Meal, type MealType } from '../lib/supabase'
import { estimateCalories } from '../lib/foodDatabase'
import { Card, Button, Input, Select, Modal, EmptyState } from '../components/ui'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const mealTypeLabels: Record<MealType, string> = {
  'café': 'Café da manhã',
  'almoço': 'Almoço',
  'lanche': 'Lanche',
  'jantar': 'Jantar',
  'suplemento': 'Suplemento',
}

const mealTypeIcons: Record<MealType, typeof Coffee> = {
  'café': Coffee,
  'almoço': Sun,
  'lanche': Cookie,
  'jantar': Moon,
  'suplemento': Zap,
}

const mealTypeColors: Record<MealType, string> = {
  'café': 'bg-amber-50 text-amber-600',
  'almoço': 'bg-orange-50 text-orange-600',
  'lanche': 'bg-blue-50 text-blue-600',
  'jantar': 'bg-indigo-50 text-indigo-600',
  'suplemento': 'bg-purple-50 text-purple-600',
}

export default function Calories() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')
  const [calories, setCalories] = useState('')
  const [calorieSource, setCalorieSource] = useState<'auto' | 'manual'>('auto')
  const [estimatedInfo, setEstimatedInfo] = useState<{ calories: number; serving?: string; confidence: 'high' | 'low' } | null>(null)
  const [mealType, setMealType] = useState<MealType>('lanche')
  const [saving, setSaving] = useState(false)

  const today = format(new Date(), 'yyyy-MM-dd')

  const fetchMeals = useCallback(async () => {
    const startOfDay = `${today}T00:00:00`
    const endOfDay = `${today}T23:59:59`
    const { data } = await supabase
      .from('meals')
      .select('*')
      .gte('logged_at', startOfDay)
      .lte('logged_at', endOfDay)
      .order('logged_at', { ascending: false })
    setMeals(data || [])
    setLoading(false)
  }, [today])

  useEffect(() => {
    fetchMeals()
  }, [fetchMeals])

  // Estima calorias automaticamente quando o usuário digita o nome do alimento
  useEffect(() => {
    if (calorieSource === 'auto' && name.trim().length > 2) {
      const result = estimateCalories(name)
      setCalories(String(result.calories))
      setEstimatedInfo({
        calories: result.calories,
        serving: result.matchedFood?.servingDescription,
        confidence: result.confidence,
      })
    } else if (calorieSource === 'auto' && name.trim().length <= 2) {
      setCalories('')
      setEstimatedInfo(null)
    }
  }, [name, calorieSource])

  const handleAdd = async () => {
    if (!name.trim() || !calories) return
    setSaving(true)
    await supabase.from('meals').insert({
      name: name.trim(),
      calories: parseInt(calories),
      meal_type: mealType,
      logged_at: new Date().toISOString(),
    })
    setName('')
    setCalories('')
    setMealType('lanche')
    setEstimatedInfo(null)
    setCalorieSource('auto')
    setShowAdd(false)
    setSaving(false)
    fetchMeals()
  }

  const handleDelete = async (id: string) => {
    await supabase.from('meals').delete().eq('id', id)
    setMeals(meals.filter((m) => m.id !== id))
  }

  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0)

  const mealsByType = (Object.keys(mealTypeLabels) as MealType[]).map((type) => ({
    type,
    items: meals.filter((m) => m.meal_type === type),
  }))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Calorias</h1>
          <p className="text-sm text-neutral-500">{format(new Date(), "d 'de' MMMM", { locale: ptBR })}</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Adicionar
        </Button>
      </div>

      <Card className="p-5 bg-gradient-to-br from-accent-500 to-accent-700 border-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-accent-100 text-sm font-medium">Total consumido hoje</p>
            <p className="text-4xl font-bold text-white mt-1">{totalCalories}<span className="text-lg font-normal text-accent-200"> kcal</span></p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center">
            <Flame className="w-8 h-8 text-white" />
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      ) : meals.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            icon={<Flame className="w-7 h-7" />}
            title="Nenhuma refeição registrada"
            subtitle="Toque em Adicionar e digite o que você comeu - as calorias são calculadas automaticamente"
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {mealsByType.map(({ type, items }) => {
            if (items.length === 0) return null
            const Icon = mealTypeIcons[type]
            const subtotal = items.reduce((s, m) => s + m.calories, 0)
            return (
              <div key={type}>
                <div className="flex items-center gap-2 mb-2 px-1">
                  <Icon className={`w-4 h-4 p-0.5 rounded ${mealTypeColors[type]}`} />
                  <h3 className="text-sm font-semibold text-neutral-600">{mealTypeLabels[type]}</h3>
                  <span className="text-xs text-neutral-400">· {subtotal} kcal</span>
                </div>
                <Card className="divide-y divide-neutral-100 overflow-hidden">
                  {items.map((meal) => (
                    <div key={meal.id} className="flex items-center justify-between p-3.5 group">
                      <div className="flex-1">
                        <p className="font-medium text-neutral-800">{meal.name}</p>
                        <p className="text-xs text-neutral-400">{format(new Date(meal.logged_at), 'HH:mm')}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-neutral-700">{meal.calories} kcal</span>
                        <button
                          onClick={() => handleDelete(meal.id)}
                          className="w-7 h-7 rounded-lg text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Adicionar refeição">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-neutral-600">O que você comeu?</label>
              <button
                onClick={() => {
                  setCalorieSource(calorieSource === 'auto' ? 'manual' : 'auto')
                  setEstimatedInfo(null)
                }}
                className="flex items-center gap-1 text-xs text-primary-600 font-medium hover:underline"
              >
                {calorieSource === 'auto' ? (
                  <><Edit3 className="w-3 h-3" /> Inserir calorias manualmente</>
                ) : (
                  <><Sparkles className="w-3 h-3" /> Calcular automaticamente</>
                )}
              </button>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Arroz com feijão e frango grelhado"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Estimativa automática de calorias */}
          {calorieSource === 'auto' && estimatedInfo && name.trim().length > 2 && (
            <div className={`p-3 rounded-xl flex items-start gap-2 ${
              estimatedInfo.confidence === 'high'
                ? 'bg-green-50 border border-green-200'
                : 'bg-amber-50 border border-amber-200'
            }`}>
              <Sparkles className={`w-4 h-4 mt-0.5 flex-shrink-0 ${estimatedInfo.confidence === 'high' ? 'text-green-600' : 'text-amber-600'}`} />
              <div className="flex-1 text-sm">
                <p className="font-medium text-neutral-700">
                  {estimatedInfo.calories} kcal estimadas
                  {estimatedInfo.serving && <span className="text-neutral-500 font-normal"> · {estimatedInfo.serving}</span>}
                </p>
                <p className={`text-xs mt-0.5 ${estimatedInfo.confidence === 'high' ? 'text-green-600' : 'text-amber-600'}`}>
                  {estimatedInfo.confidence === 'high'
                    ? 'Alimento identificado no banco de dados'
                    : 'Estimativa aproximada - ajuste se necessário'}
                </p>
              </div>
            </div>
          )}

          <Input
            label={calorieSource === 'auto' ? 'Calorias (kcal) - calculado automaticamente' : 'Calorias (kcal)'}
            value={calories}
            onChange={setCalories}
            type="number"
            placeholder="Ex: 350"
          />
          <Select
            label="Tipo de refeição"
            value={mealType}
            onChange={(v) => setMealType(v as MealType)}
            options={(Object.keys(mealTypeLabels) as MealType[]).map((t) => ({ value: t, label: mealTypeLabels[t] }))}
          />
          <Button onClick={handleAdd} className="w-full">
            {saving ? 'Salvando...' : 'Salvar refeição'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
