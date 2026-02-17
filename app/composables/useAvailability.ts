// app/composables/useAvailability.ts
import { watch } from "vue";

export type AvailabilityStatus = "gray" | "green" | "red";
// gray = not set, green = available, red = unavailable

const KEY = "einstein_availability_v1";

export function useAvailability() {
  // map: { [menuItemId]: "gray" | "green" | "red" }
  const state = useState<Record<string, AvailabilityStatus>>(
    "availability",
    () => ({})
  );

  // load + sync to localStorage (client only)
  if (import.meta.client) {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") state.value = parsed;
      } catch {
        // ignore bad JSON
      }
    } else {
      localStorage.setItem(KEY, JSON.stringify(state.value));
    }

    watch(
      state,
      (val) => {
        localStorage.setItem(KEY, JSON.stringify(val));
      },
      { deep: true, flush: "sync" }
    );

    // sync between tabs
    window.addEventListener("storage", (e) => {
      if (e.key !== KEY) return;
      try {
        const parsed = JSON.parse(e.newValue || "{}");
        if (parsed && typeof parsed === "object") state.value = parsed;
      } catch {
        // ignore
      }
    });
  }

  function getStatus(id: string): AvailabilityStatus {
    return state.value[id] || "gray";
  }

  function setStatus(id: string, status: AvailabilityStatus) {
    state.value[id] = status;
  }

  // Click cycle: gray -> green -> red -> gray
  function toggle(id: string) {
    const cur = getStatus(id);
    const next = cur === "gray" ? "green" : cur === "green" ? "red" : "gray";
    setStatus(id, next);
    return next;
  }

  function isUnavailable(id: string) {
    return getStatus(id) === "red";
  }

  function resetAll() {
    state.value = {};
  }

  return { state, getStatus, setStatus, toggle, isUnavailable, resetAll };
}
