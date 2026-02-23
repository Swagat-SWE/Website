// app/composables/useAvailability.ts
type Status = "green" | "red";

type AvailabilityState = Record<string, Status>;

export function useAvailability() {
  const state = useState<AvailabilityState>("availability", () => ({}));

  // Load once (client only)
  if (process.client) {
    const raw = localStorage.getItem("availability");
    if (raw) {
      try {
        state.value = JSON.parse(raw);
      } catch {
        // ignore bad storage
      }
    }
  }

  function save() {
    if (!process.client) return;
    localStorage.setItem("availability", JSON.stringify(state.value));
  }

  function getStatus(id: string): Status {
    // default: available
    return state.value[id] ?? "green";
  }

  function isAvailable(id: string) {
    return getStatus(id) !== "red";
  }

  function setStatus(id: string, status: Status) {
    state.value[id] = status;
    save();
  }

  function toggle(id: string) {
    setStatus(id, getStatus(id) === "red" ? "green" : "red");
  }

  function resetAll() {
    state.value = {};
    save();
  }

  return { getStatus, isAvailable, setStatus, toggle, resetAll };
}
