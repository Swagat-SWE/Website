// app/composables/useAvailability.ts
import { watch } from "vue";

type Status = "green" | "red"; // green=available (default), red=unavailable

const KEY = "einstein_availability_v1";

export function useAvailability() {
  // Store ONLY overrides (red items). If an item is missing, it's green by default.
  const redMap = useState<Record<string, true>>("availabilityRedMap", () => ({}));

  if (import.meta.client) {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          redMap.value = parsed;
        }
      } catch {
        // ignore bad JSON
      }
    } else {
      localStorage.setItem(KEY, JSON.stringify(redMap.value));
    }

    watch(
      redMap,
      (val) => {
        localStorage.setItem(KEY, JSON.stringify(val));
      },
      { deep: true, flush: "sync" }
    );

    window.addEventListener("storage", (e) => {
      if (e.key !== KEY) return;
      try {
        const parsed = JSON.parse(e.newValue || "{}");
        if (parsed && typeof parsed === "object") redMap.value = parsed;
      } catch {
        // ignore
      }
    });
  }

  function getStatus(id: string): Status {
    return redMap.value[id] ? "red" : "green";
  }

  // Toggle between available/unavailable
  function toggle(id: string) {
    if (redMap.value[id]) {
      delete redMap.value[id]; // back to default green
    } else {
      redMap.value[id] = true; // mark unavailable
    }
  }

  function resetAll() {
    redMap.value = {};
  }

  return { getStatus, toggle, resetAll };
}
