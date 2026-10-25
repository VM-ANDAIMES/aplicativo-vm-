const BASE = "https://mhoiaojjkwojqlkibwpk.supabase.co/functions/v1/make-server-892fa6af";

export async function cloudGet<T>(key: string): Promise<T | null> {
  const res = await fetch(`${BASE}/db/${key}`);
  if (!res.ok) {
    throw new Error(`Falha ao carregar "${key}" (${res.status})`);
  }
  const json = await res.json();
  return json.data as T ?? null;
}

export async function cloudSet<T>(key: string, value: T): Promise<void> {
  const res = await fetch(`${BASE}/db/${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: value }),
  });
  if (!res.ok) {
    throw new Error(`Falha ao salvar "${key}" (${res.status})`);
  }
}
