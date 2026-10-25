import { supabase } from './supabase';

export async function cloudGet<T>(key: string): Promise<T | null> {
  const { data, error } = await supabase
    .from('vm_app_data')
    .select('data')
    .eq('key', key)
    .maybeSingle();

  if (error) {
    throw new Error(`Falha ao carregar "${key}": ${error.message}`);
  }

  return (data?.data as T | null) ?? null;
}

export async function cloudSet<T>(
  key: string,
  value: T
): Promise<void> {
  const { error } = await supabase
    .from('vm_app_data')
    .upsert(
      {
        key,
        data: value,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' }
    );

  if (error) {
    throw new Error(`Falha ao salvar "${key}": ${error.message}`);
  }
}