import { useState, useEffect, useCallback } from 'react'
import { ListChecks, Plus, Trash2, Check, Clock } from 'lucide-react'
import { supabase, type RoutineTask, type TaskCategory } from '../lib/supabase'
import { Card, Button, Input, Select, Modal, EmptyState } from '../components/ui'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const categoryLabels: Record<TaskCategory, string> = {
  'saúde': 'Saúde',
  'fitness': 'Fitness',
  'bem-estar': 'Bem-estar',
  'produtividade': 'Produtividade',
}

const categoryColors: Record<TaskCategory, string> = {
  'saúde': 'bg-red-50 text-red-600 border-red-100',
  'fitness': 'bg-blue-50 text-blue-600 border-blue-100',
  'bem-estar': 'bg-green-50 text-green-600 border-green-100',
  'produtividade': 'bg-amber-50 text-amber-600 border-amber-100',
}

const categoryDot: Record<TaskCategory, string> = {
  'saúde': 'bg-red-400',
  'fitness': 'bg-blue-400',
  'bem-estar': 'bg-green-400',
  'produtividade': 'bg-amber-400',
}

export default function Routine() {
  const [tasks, setTasks] = useState<RoutineTask[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<TaskCategory>('bem-estar')
  const [scheduledTime, setScheduledTime] = useState('')
  const [saving, setSaving] = useState(false)

  const today = format(new Date(), 'yyyy-MM-dd')

  const fetchTasks = useCallback(async () => {
    const { data } = await supabase
      .from('routine_tasks')
      .select('*')
      .eq('due_date', today)
      .order('completed', { ascending: true })
      .order('scheduled_time', { nullsFirst: false })
    setTasks(data || [])
    setLoading(false)
  }, [today])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleAdd = async () => {
    if (!title.trim()) return
    setSaving(true)
    await supabase.from('routine_tasks').insert({
      title: title.trim(),
      category,
      scheduled_time: scheduledTime || null,
      due_date: today,
    })
    setTitle('')
    setCategory('bem-estar')
    setScheduledTime('')
    setShowAdd(false)
    setSaving(false)
    fetchTasks()
  }

  const handleToggle = async (task: RoutineTask) => {
    const completed = !task.completed
    await supabase
      .from('routine_tasks')
      .update({ completed, completed_at: completed ? new Date().toISOString() : null })
      .eq('id', task.id)
    setTasks(tasks.map((t) => (t.id === task.id ? { ...t, completed, completed_at: completed ? new Date().toISOString() : null } : t)))
  }

  const handleDelete = async (id: string) => {
    await supabase.from('routine_tasks').delete().eq('id', id)
    setTasks(tasks.filter((t) => t.id !== id))
  }

  const completedCount = tasks.filter((t) => t.completed).length
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Rotina</h1>
          <p className="text-sm text-neutral-500">{format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Adicionar
        </Button>
      </div>

      {tasks.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-600">Progresso do dia</span>
            <span className="text-sm font-bold text-primary-600">{completedCount}/{tasks.length}</span>
          </div>
          <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      ) : tasks.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            icon={<ListChecks className="w-7 h-7" />}
            title="Sua rotina está vazia"
            subtitle="Adicione tarefas para organizar seu dia"
          />
        </Card>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <Card key={task.id} className={`p-3.5 transition-all ${task.completed ? 'opacity-60' : ''}`}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggle(task)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                    task.completed
                      ? 'bg-primary-500 border-primary-500'
                      : 'border-neutral-300 hover:border-primary-400'
                  }`}
                >
                  {task.completed && <Check className="w-4 h-4 text-white" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${task.completed ? 'line-through text-neutral-400' : 'text-neutral-800'}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-md border font-medium ${categoryColors[task.category as TaskCategory] || categoryColors['bem-estar']}`}>
                      {categoryLabels[task.category as TaskCategory] || task.category}
                    </span>
                    {task.scheduled_time && (
                      <span className="flex items-center gap-1 text-xs text-neutral-400">
                        <Clock className="w-3 h-3" />
                        {task.scheduled_time.slice(0, 5)}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="w-7 h-7 rounded-lg text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center flex-shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Adicionar tarefa">
        <div className="space-y-4">
          <Input label="Tarefa" value={title} onChange={setTitle} placeholder="Ex: Beber 2L de água" />
          <Select
            label="Categoria"
            value={category}
            onChange={(v) => setCategory(v as TaskCategory)}
            options={(Object.keys(categoryLabels) as TaskCategory[]).map((c) => ({ value: c, label: categoryLabels[c] }))}
          />
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-1.5">Horário (opcional)</label>
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
            />
          </div>
          <Button onClick={handleAdd} className="w-full">
            {saving ? 'Salvando...' : 'Salvar tarefa'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
