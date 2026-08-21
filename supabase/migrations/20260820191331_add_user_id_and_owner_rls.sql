/*
# VivaBem - Adicionar login e isolamento de dados por usuário

## Resumo
Adiciona a coluna `user_id` nas tabelas meals, workouts, routine_tasks, daily_goals e workout_plans,
com valor padrão `auth.uid()`. Substitui as políticas de acesso compartilhado (anon) por
políticas de propriedade (authenticated only), garantindo que cada usuário só veja e modifique
seus próprios dados.

## Mudanças

### 1. Coluna user_id adicionada em:
- meals: user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE
- workouts: idem
- routine_tasks: idem
- daily_goals: idem (a restrição UNIQUE de date passa a ser UNIQUE(date, user_id))
- workout_plans: idem

### 2. Políticas RLS substituídas
- Removidas as políticas "anon_*" que permitiam acesso público.
- Criadas 4 políticas por tabela (SELECT, INSERT, UPDATE, DELETE) com `TO authenticated`
  e verificação `auth.uid() = user_id`.

### 3. Índices
- Adicionados índices em user_id para todas as tabelas.

## Notas
- A coluna user_id tem DEFAULT auth.uid(), então inserts do frontend que omitem user_id
  funcionam corretamente.
- daily_goals tinha UNIQUE(date); agora é UNIQUE(date, user_id) para que cada usuário
  tenha suas próprias metas por dia.
*/

-- meals
ALTER TABLE meals ADD COLUMN IF NOT EXISTS user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;

DROP POLICY IF EXISTS "anon_select_meals" ON meals;
DROP POLICY IF EXISTS "anon_insert_meals" ON meals;
DROP POLICY IF EXISTS "anon_update_meals" ON meals;
DROP POLICY IF EXISTS "anon_delete_meals" ON meals;

CREATE POLICY "select_own_meals" ON meals FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_meals" ON meals FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_meals" ON meals FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_meals" ON meals FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_meals_user_id ON meals (user_id);

-- workouts
ALTER TABLE workouts ADD COLUMN IF NOT EXISTS user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;

DROP POLICY IF EXISTS "anon_select_workouts" ON workouts;
DROP POLICY IF EXISTS "anon_insert_workouts" ON workouts;
DROP POLICY IF EXISTS "anon_update_workouts" ON workouts;
DROP POLICY IF EXISTS "anon_delete_workouts" ON workouts;

CREATE POLICY "select_own_workouts" ON workouts FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_workouts" ON workouts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_workouts" ON workouts FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_workouts" ON workouts FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts (user_id);

-- routine_tasks
ALTER TABLE routine_tasks ADD COLUMN IF NOT EXISTS user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;

DROP POLICY IF EXISTS "anon_select_routine_tasks" ON routine_tasks;
DROP POLICY IF EXISTS "anon_insert_routine_tasks" ON routine_tasks;
DROP POLICY IF EXISTS "anon_update_routine_tasks" ON routine_tasks;
DROP POLICY IF EXISTS "anon_delete_routine_tasks" ON routine_tasks;

CREATE POLICY "select_own_routine_tasks" ON routine_tasks FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_routine_tasks" ON routine_tasks FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_routine_tasks" ON routine_tasks FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_routine_tasks" ON routine_tasks FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_routine_tasks_user_id ON routine_tasks (user_id);

-- daily_goals
ALTER TABLE daily_goals ADD COLUMN IF NOT EXISTS user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE daily_goals DROP CONSTRAINT IF EXISTS daily_goals_date_key;
DROP POLICY IF EXISTS "anon_select_daily_goals" ON daily_goals;
DROP POLICY IF EXISTS "anon_insert_daily_goals" ON daily_goals;
DROP POLICY IF EXISTS "anon_update_daily_goals" ON daily_goals;
DROP POLICY IF EXISTS "anon_delete_daily_goals" ON daily_goals;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'daily_goals_user_id_date_key'
  ) THEN
    ALTER TABLE daily_goals ADD CONSTRAINT daily_goals_user_id_date_key UNIQUE (date, user_id);
  END IF;
END $$;

CREATE POLICY "select_own_daily_goals" ON daily_goals FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_daily_goals" ON daily_goals FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_daily_goals" ON daily_goals FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_daily_goals" ON daily_goals FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_daily_goals_user_id ON daily_goals (user_id);

-- workout_plans
ALTER TABLE workout_plans ADD COLUMN IF NOT EXISTS user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;

DROP POLICY IF EXISTS "anon_select_workout_plans" ON workout_plans;
DROP POLICY IF EXISTS "anon_insert_workout_plans" ON workout_plans;
DROP POLICY IF EXISTS "anon_update_workout_plans" ON workout_plans;
DROP POLICY IF EXISTS "anon_delete_workout_plans" ON workout_plans;

CREATE POLICY "select_own_workout_plans" ON workout_plans FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_workout_plans" ON workout_plans FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_workout_plans" ON workout_plans FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_workout_plans" ON workout_plans FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_workout_plans_user_id ON workout_plans (user_id);
