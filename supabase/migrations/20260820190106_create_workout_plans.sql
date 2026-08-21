/*
# VivaBem - Rotina de Treinos Semanal

## Resumo
Cria a tabela workout_plans para armazenar a rotina semanal de treinos do usuário,
com dias específicos, horários e marcação de dias de descanso.

## Nova Tabela

### workout_plans (plano de treino semanal)
- id (uuid, PK)
- day_of_week (text) - dia da semana: segunda, terca, quarta, quinta, sexta, sabado, domingo
- title (text) - nome do treino (ex: "Treino A - Peito e Tríceps") ou "Descanso"
- exercise_type (text) - tipo: cardio, forca, flexibilidade, esporte, descanso
- description (text) - descrição/opcional
- scheduled_time (time) - horário planejado (opcional)
- is_rest_day (boolean) - se é dia de descanso
- created_at (timestamptz)

## Segurança
- App single-tenant (sem login). Políticas com `TO anon, authenticated` e `USING (true)`.
- RLS habilitado.
*/

CREATE TABLE IF NOT EXISTS workout_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week text NOT NULL,
  title text NOT NULL,
  exercise_type text NOT NULL DEFAULT 'forca',
  description text,
  scheduled_time time,
  is_rest_day boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_workout_plans" ON workout_plans;
CREATE POLICY "anon_select_workout_plans" ON workout_plans FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_workout_plans" ON workout_plans;
CREATE POLICY "anon_insert_workout_plans" ON workout_plans FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_workout_plans" ON workout_plans;
CREATE POLICY "anon_update_workout_plans" ON workout_plans FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_workout_plans" ON workout_plans;
CREATE POLICY "anon_delete_workout_plans" ON workout_plans FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_workout_plans_day ON workout_plans (day_of_week);
