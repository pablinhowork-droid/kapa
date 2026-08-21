/*
# VitaFit - Schema de Saúde e Fitness

## Resumo
Cria as tabelas para o app VitaFit, que ajuda o usuário a rastrear gastos calóricos (refeições),
treinos (exercícios) e manter uma rotina diária de tarefas.

## Novas Tabelas

### meals (refeições)
- id (uuid, PK)
- name (text) - nome da refeição (ex: "Almoço", "Whey protein")
- calories (integer) - calorias da refeição
- meal_type (text) - tipo: café, almoço, lanche, jantar, suplemento
- logged_at (timestamptz) - quando foi registrada
- created_at (timestamptz)

### workouts (treinos)
- id (uuid, PK)
- name (text) - nome do exercício (ex: "Corrida", "Supino")
- exercise_type (text) - tipo: cardio, força, flexibilidade, esporte
- duration_minutes (integer) - duração em minutos
- calories_burned (integer) - calorias queimadas estimadas
- intensity (text) - intensidade: leve, moderado, intenso
- logged_at (timestamptz)
- created_at (timestamptz)

### routine_tasks (tarefas da rotina)
- id (uuid, PK)
- title (text) - título da tarefa (ex: "Beber 2L de água", "Meditar 10min")
- category (text) - categoria: saúde, fitness, bem-estar, produtividade
- scheduled_time (time) - horário planejado (opcional)
- completed (boolean) - se foi concluída
- completed_at (timestamptz) - quando foi concluída
- due_date (date) - data de referência da tarefa
- created_at (timestamptz)

### daily_goals (metas diárias)
- id (uuid, PK)
- date (date) - data da meta
- calorie_goal (integer) - meta de consumo calórico (ex: 2000)
- calorie_burn_goal (integer) - meta de calorias queimadas (ex: 500)
- workout_goal (integer) - meta de minutos de treino (ex: 30)
- tasks_goal (integer) - meta de tarefas concluídas (ex: 5)
- created_at (timestamptz)

## Segurança
- App single-tenant (sem login). Todas as políticas usam `TO anon, authenticated` com `USING (true)`.
- RLS habilitado em todas as tabelas.
- Dados são intencionalmente compartilhados (app pessoal sem autenticação).
*/

-- Tabela de refeições
CREATE TABLE IF NOT EXISTS meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  calories integer NOT NULL DEFAULT 0,
  meal_type text NOT NULL DEFAULT 'lanche',
  logged_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_meals" ON meals;
CREATE POLICY "anon_select_meals" ON meals FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_meals" ON meals;
CREATE POLICY "anon_insert_meals" ON meals FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_meals" ON meals;
CREATE POLICY "anon_update_meals" ON meals FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_meals" ON meals;
CREATE POLICY "anon_delete_meals" ON meals FOR DELETE
  TO anon, authenticated USING (true);

-- Tabela de treinos
CREATE TABLE IF NOT EXISTS workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  exercise_type text NOT NULL DEFAULT 'cardio',
  duration_minutes integer NOT NULL DEFAULT 0,
  calories_burned integer NOT NULL DEFAULT 0,
  intensity text NOT NULL DEFAULT 'moderado',
  logged_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_workouts" ON workouts;
CREATE POLICY "anon_select_workouts" ON workouts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_workouts" ON workouts;
CREATE POLICY "anon_insert_workouts" ON workouts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_workouts" ON workouts;
CREATE POLICY "anon_update_workouts" ON workouts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_workouts" ON workouts;
CREATE POLICY "anon_delete_workouts" ON workouts FOR DELETE
  TO anon, authenticated USING (true);

-- Tabela de tarefas da rotina
CREATE TABLE IF NOT EXISTS routine_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'bem-estar',
  scheduled_time time,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  due_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE routine_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_routine_tasks" ON routine_tasks;
CREATE POLICY "anon_select_routine_tasks" ON routine_tasks FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_routine_tasks" ON routine_tasks;
CREATE POLICY "anon_insert_routine_tasks" ON routine_tasks FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_routine_tasks" ON routine_tasks;
CREATE POLICY "anon_update_routine_tasks" ON routine_tasks FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_routine_tasks" ON routine_tasks;
CREATE POLICY "anon_delete_routine_tasks" ON routine_tasks FOR DELETE
  TO anon, authenticated USING (true);

-- Tabela de metas diárias
CREATE TABLE IF NOT EXISTS daily_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL UNIQUE,
  calorie_goal integer NOT NULL DEFAULT 2000,
  calorie_burn_goal integer NOT NULL DEFAULT 500,
  workout_goal integer NOT NULL DEFAULT 30,
  tasks_goal integer NOT NULL DEFAULT 5,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE daily_goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_daily_goals" ON daily_goals;
CREATE POLICY "anon_select_daily_goals" ON daily_goals FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_daily_goals" ON daily_goals;
CREATE POLICY "anon_insert_daily_goals" ON daily_goals FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_daily_goals" ON daily_goals;
CREATE POLICY "anon_update_daily_goals" ON daily_goals FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_daily_goals" ON daily_goals;
CREATE POLICY "anon_delete_daily_goals" ON daily_goals FOR DELETE
  TO anon, authenticated USING (true);

-- Índices
CREATE INDEX IF NOT EXISTS idx_meals_logged_at ON meals (logged_at);
CREATE INDEX IF NOT EXISTS idx_workouts_logged_at ON workouts (logged_at);
CREATE INDEX IF NOT EXISTS idx_routine_tasks_due_date ON routine_tasks (due_date);
CREATE INDEX IF NOT EXISTS idx_daily_goals_date ON daily_goals (date);
