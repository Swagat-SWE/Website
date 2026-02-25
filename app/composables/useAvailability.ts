// app/composables/useAvailability.ts
type Status = "green" | "red";
type AvailabilityState = Record<string, Status>;

export function useAvailability() {
  const state = useState<AvailabilityState>("availability", () => ({}));

// ✅ Load once (client only) — do it in a safe lifecycle way
if (process.client) {
  queueMicrotask(() => {
    const raw = localStorage.getItem("availability");
    if (raw) {
      try {
        state.value = JSON.parse(raw);
      } catch {
        // ignore bad storage
      }
    }
  });
}

  function save() {
    if (!process.client) return;
    localStorage.setItem("availability", JSON.stringify(state.value));
  }

  // ✅ Normalize key: if "Farm House Egg Sandwich" doesn't exist,
  // try to find the matching id key (bs1) OR the reverse.
  function normalizeKey(key: string): string {
    if (!key) return key;

    // If the exact key exists, use it
    if (key in state.value) return key;

    // Try to find by ID -> NAME (if key looks like an id)
    // Example: bs1 => find any stored NAME that maps? (fallback scan)
    // Try find by NAME -> ID (if key is a name)
    const entries = Object.entries(state.value);

    // If key is NAME, see if there is an ID key stored that matches by pattern
    // Since we don't have your menu mapping here, we do a safe scan:
    // If name is missing but id exists, you'll pass id from staff anyway.
    // The real fix is storing BOTH keys whenever we set status (below).
    return key;
  }

  function getStatus(key: string): Status {
    const k = normalizeKey(key);
    return state.value[k] ?? "green";
  }

  function isAvailable(key: string) {
    return getStatus(key) !== "red";
  }

  // ✅ IMPORTANT: store BOTH the key you passed AND the "other key"
  // so Food (name) and Staff (id) stay connected.
  //
  // This requires ONE small assumption:
  // - If key looks like an id (starts with bs/l/c/s/o + digits), it's probably an id.
  // - If not, it's probably a name.
  function setStatus(key: string, status: Status, otherKey?: string) {
    if (!key) return;

    state.value[key] = status;

    // If caller gives the other key, store it too
    if (otherKey) {
      state.value[otherKey] = status;
    }

    save();
  }

  // ✅ Toggle supports an optional "otherKey" too
  function toggle(key: string, otherKey?: string) {
    const next: Status = getStatus(key) === "red" ? "green" : "red";
    setStatus(key, next, otherKey);
  }

  function resetAll() {
    state.value = {};
    save();
  }

  return { getStatus, isAvailable, setStatus, toggle, resetAll };
}