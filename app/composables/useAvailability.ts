import { MENU_ITEMS } from "../data/menu";

type Status = "green" | "red";
type AvailabilityState = Record<string, Status>;

const idToName = Object.fromEntries(MENU_ITEMS.map((item) => [item.id, item.name]));
const nameToId = Object.fromEntries(MENU_ITEMS.map((item) => [item.name, item.id]));

function getMenuKeys(key: string) {
  if (!key) return { id: undefined, name: undefined };

  if (idToName[key]) {
    return { id: key, name: idToName[key] };
  }

  if (nameToId[key]) {
    return { id: nameToId[key], name: key };
  }

  return { id: undefined, name: key };
}

export function useAvailability() {
  const state = useState<AvailabilityState>("availability", () => ({}));

  // ✅ Load once (client only) — do it in a safe lifecycle way
  if (process.client) {
    queueMicrotask(() => {
      const raw = localStorage.getItem("availability");
      if (raw) {
        try {
          const persisted = JSON.parse(raw) as AvailabilityState;
          const normalized: AvailabilityState = {};

          for (const [k, status] of Object.entries(persisted)) {
            const { id, name } = getMenuKeys(k);

            if (name) normalized[name] = status;
            if (id) normalized[id] = status;
            if (!name && !id) normalized[k] = status;
          }

          state.value = normalized;
        } catch {
          // ignore bad storage
        }
      }
    });

    window.addEventListener("storage", (event) => {
      if (event.key !== "availability" || !event.newValue) return;

      try {
        const persisted = JSON.parse(event.newValue) as AvailabilityState;
        const normalized: AvailabilityState = {};

        for (const [k, status] of Object.entries(persisted)) {
          const { id, name } = getMenuKeys(k);

          if (name) normalized[name] = status;
          if (id) normalized[id] = status;
          if (!name && !id) normalized[k] = status;
        }

        state.value = normalized;
      } catch {
        // ignore bad storage event
      }
    });
  }

  function save() {
    if (!process.client) return;
    localStorage.setItem("availability", JSON.stringify(state.value));
  }

  function getStatus(key: string): Status {
    const { id, name } = getMenuKeys(key);

    if (name && state.value[name]) {
      return state.value[name];
    }

    if (id && state.value[id]) {
      return state.value[id];
    }

    if (state.value[key]) {
      return state.value[key];
    }

    return "green";
  }

  function isAvailable(key: string) {
    return getStatus(key) !== "red";
  }

  function setStatus(key: string, status: Status) {
    if (!key) return;

    const { id, name } = getMenuKeys(key);

    if (name) state.value[name] = status;
    if (id) state.value[id] = status;

    if (!name && !id) state.value[key] = status;

    save();
  }

  function toggle(key: string) {
    const next: Status = getStatus(key) === "red" ? "green" : "red";
    setStatus(key, next);
  }

  function resetAll() {
    state.value = {};
    save();
  }

  return { getStatus, isAvailable, setStatus, toggle, resetAll };
}