// app/composables/useAvailability.ts
export type AvailabilityStatus = "green" | "red";

const STORAGE_KEY = "einsteins_unavailable_items";

export function useAvailability() {
  // store ONLY the unavailable ids
  const unavailable = useState<Record<string, boolean>>("unavailable-items", () => {
    if (process.client) {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      } catch {
        return {};
      }
    }
    return {};
  });

  function isUnavailable(id: string) {
    return !!unavailable.value[id];
  }

  // ✅ default is green (available) unless marked otherwise
  function getStatus(id: string): AvailabilityStatus {
    return isUnavailable(id) ? "red" : "green";
  }

  function toggle(id: string) {
    if (unavailable.value[id]) delete unavailable.value[id];
    else unavailable.value[id] = true;

    if (process.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(unavailable.value));
    }
  }

  function resetAll() {
    unavailable.value = {};
    if (process.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({}));
    }
  }

  return { getStatus, toggle, resetAll, isUnavailable };
}
