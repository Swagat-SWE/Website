// app/composables/useApi.ts

type ApiOk<T = any> = { ok: true } & T;
type ApiErr = { ok: false; error: string };
export type ApiResponse<T = any> = ApiOk<T> | ApiErr;

export const useApi = () => {
  // dev: apiBase = "" -> calls /api/* (Nuxt proxy sends to localhost:3001)
  // prod: apiBase = "https://backend-xxxx.onrender.com" -> calls backend directly
  const config = useRuntimeConfig();
  const baseURL = (config.public.apiBase as string) || "";

  async function post<T = any>(
    path: string,
    body: Record<string, any> = {}
  ): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(baseURL + path, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        return { ok: false, error: data?.error || `Request failed (${res.status})` };
      }

      return data;
    } catch (e: any) {
      return { ok: false, error: e?.message || "Failed to fetch" };
    }
  }

  async function get<T = any>(path: string): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(baseURL + path, { credentials: "include" });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        return { ok: false, error: data?.error || `Request failed (${res.status})` };
      }

      return data;
    } catch (e: any) {
      return { ok: false, error: e?.message || "Failed to fetch" };
    }
  }

  async function del<T = any>(path: string): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(baseURL + path, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        return { ok: false, error: data?.error || `Request failed (${res.status})` };
      }

      return data;
    } catch (e: any) {
      return { ok: false, error: e?.message || "Failed to fetch" };
    }
  }

  return { post, get, del };
};
