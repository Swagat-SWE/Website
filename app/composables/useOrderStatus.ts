import { watch } from "vue";

const KEY = "einstein_order_status_v1";

export function useOrderStatus() {
  const s = useState<number>("orderStatus", () => 0);

  if (import.meta.client) {
    const raw = localStorage.getItem(KEY);
    if (raw !== null) {
      const n = Number(raw);
      if (!Number.isNaN(n)) s.value = n;
    } else {
      localStorage.setItem(KEY, String(s.value));
    }

    watch(
      s,
      (val) => {
        localStorage.setItem(KEY, String(val));
      },
      { flush: "sync" }
    );

    window.addEventListener("storage", (e) => {
      if (e.key !== KEY) return;
      const n = Number(e.newValue);
      if (!Number.isNaN(n)) s.value = n;
    });
  }

  return s;
}
