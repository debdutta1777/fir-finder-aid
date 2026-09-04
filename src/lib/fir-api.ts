export type FirRecord = {
  id: number;
  fir_number: string;
  police_station: string;
  district: string;
  fir_date: string;
  fir_time: string;
  incident_date: string;
  incident_time: string;
  legal_sections: string;
  complainant: string;
  complainant_father: string;
  address: string;
  accused: string;
  property: string;
  total_value: string;
  summary: string;
  ocr_text: string;
  created_at: string;
};

export type HealthResponse = { status: string; model_loaded: boolean; records: number | null };
export type SummaryResponse = {
  original_text: string;
  narrative: string;
  summary: string;
  translated_summary: string | null;
  translation_status: "ok" | "partial" | "failed" | "skipped" | string;
  translation_note: string | null;
  target_language: string | null;
  metadata: Record<string, string>;
};
export type RecordsResponse = { results: FirRecord[]; count: number; total?: number };
export type ApiMode = "live" | "demo";

export class FirApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.name = "FirApiError";
    this.status = status;
    this.detail = detail;
  }
}

export const DEFAULT_BACKEND_URL = import.meta.env["VITE_BACKEND_URL"] || "http://localhost:8000";
const BACKEND_STORAGE_KEY = "fir.backendUrl";

export function getBackendUrl(): string {
  if (typeof window === "undefined") return DEFAULT_BACKEND_URL;
  try {
    return window.localStorage.getItem(BACKEND_STORAGE_KEY)?.replace(/\/+$/, "") || DEFAULT_BACKEND_URL;
  } catch {
    return DEFAULT_BACKEND_URL;
  }
}

export function setBackendUrl(url: string): string {
  const cleaned = url.trim().replace(/\/+$/, "") || DEFAULT_BACKEND_URL;
  try {
    window.localStorage.setItem(BACKEND_STORAGE_KEY, cleaned);
  } catch {
    /* storage unavailable — keep session value only */
  }
  return cleaned;
}

async function request<T>(path: string, init?: RequestInit, timeout = 30000): Promise<T> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(`${getBackendUrl()}${path}`, {
      ...init,
      signal: controller.signal,
      headers: { Accept: "application/json", ...(init?.headers || {}) },
    });
    const payload = (await response.json().catch(() => ({}))) as { detail?: string };
    if (!response.ok) throw new FirApiError(response.status, payload.detail || "The backend returned an error.");
    return payload as T;
  } finally {
    window.clearTimeout(timer);
  }
}

export async function getHealth(): Promise<{ data: HealthResponse; mode: ApiMode }> {
  try {
    return { data: await request<HealthResponse>("/health", undefined, 5000), mode: "live" };
  } catch {
    return { data: { status: "offline", model_loaded: false, records: 0 }, mode: "demo" };
  }
}

export async function getRecords(limit = 25, offset = 0): Promise<{ data: RecordsResponse; mode: ApiMode }> {
  try {
    return { data: await request<RecordsResponse>(`/records?limit=${limit}&offset=${offset}`), mode: "live" };
  } catch {
    return { data: { results: [], count: 0, total: 0 }, mode: "demo" };
  }
}

export async function searchRecords(term: string): Promise<{ data: RecordsResponse; mode: ApiMode }> {
  try {
    return { data: await request<RecordsResponse>(`/search?name=${encodeURIComponent(term)}&q=${encodeURIComponent(term)}`), mode: "live" };
  } catch (error) {
    if (error instanceof FirApiError) throw error;
    return { data: { results: [], count: 0, total: 0 }, mode: "demo" };
  }
}

export async function searchByFirNumber(term: string): Promise<{ data: RecordsResponse; mode: ApiMode }> {
  try {
    const payload = await request<{ firs: FirRecord[]; count: number }>(`/fir/${encodeURIComponent(term)}`);
    return { data: { results: payload.firs, count: payload.count, total: payload.count }, mode: "live" };
  } catch (error) {
    if (error instanceof FirApiError) throw error;
    return { data: { results: [], count: 0, total: 0 }, mode: "demo" };
  }
}

export async function askRecords(query: string): Promise<{ data: RecordsResponse; mode: ApiMode }> {
  try {
    return { data: await request<RecordsResponse>(`/ask?q=${encodeURIComponent(query)}`), mode: "live" };
  } catch {
    return { data: { results: [], count: 0, total: 0 }, mode: "demo" };
  }
}

export async function summarizeFile(file: File, language: string): Promise<{ data: SummaryResponse; mode: ApiMode }> {
  try {
    const body = new FormData();
    body.append("file", file);
    body.append("translate_to", language);
    return { data: await request<SummaryResponse>("/summarize", { method: "POST", body }, 300000), mode: "live" };
  } catch (error) {
    if (error instanceof FirApiError) throw error;
    throw new FirApiError(503, "The local processing service is unavailable.");
  }
}
