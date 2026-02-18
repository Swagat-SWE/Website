<!-- app/pages/Staff.vue -->
<template>
  <div class="page">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebarTop">
        <NuxtLink to="/" class="logoLink" aria-label="Main Page">
          <img src="/Logo.png" alt="Einstein Bros Logo" class="logoImg" />
        </NuxtLink>
      </div>

      <div class="staffTag">
        <div class="staffUser">User: {{ staffUser }}</div>
        <div class="staffMode">EMPLOYEE MODE</div>
      </div>

      <nav class="staffNav">
        <button class="staffNavBtn" :class="{ active: activeTab === 'availability' }" type="button" @click="activeTab = 'availability'">
          Availability
        </button>
        <button class="staffNavBtn" :class="{ active: activeTab === 'orders' }" type="button" @click="activeTab = 'orders'">
          Orders
        </button>
      </nav>

      <nav class="nav">
        <NuxtLink class="navItem" to="/">Main Page</NuxtLink>
        <NuxtLink class="navItem" to="/food">Food Menu</NuxtLink>
        <NuxtLink class="navItem" to="/drinks">Drinks Menu</NuxtLink>
        <NuxtLink class="navItem" to="/checkout">Checkout</NuxtLink>
        <NuxtLink class="navItem" to="/tracking">Tracking</NuxtLink>
      </nav>
    </aside>

    <!-- Main -->
    <main class="main">
      <header class="topbar">
        <h1 class="title">Einstein Bros</h1>
        <button class="ghostBtn" type="button" @click="navigateTo('/')">Back</button>
      </header>

      <!-- AVAILABILITY -->
      <section v-if="activeTab === 'availability'" class="card">
        <div class="sectionHeader">
          <h2>AVAILABILITY</h2>
          <div class="muted">Click an item to toggle Available ↔ Unavailable</div>
        </div>

        <div class="availGroups">
          <div v-for="groupKey in orderedGroupKeys" :key="groupKey" class="availGroup">
            <div class="availGroupTitle">{{ groupKey }}</div>

            <div class="availItems">
              <button
                v-for="it in availabilityGroups[groupKey]"
                :key="it.id"
                class="availItemBtn"
                :class="availability.getStatus(it.id)"
                type="button"
                @click="availability.toggle(it.id)"
              >
                <div class="availItemName">{{ it.name }}</div>
                <div class="availItemStatus">
                  {{ availability.getStatus(it.id) === "red" ? "Unavailable" : "Available" }}
                </div>
              </button>
            </div>
          </div>
        </div>

        <div class="legend">
          <span class="pill green">Green = Available (default)</span>
          <span class="pill red">Red = Unavailable</span>
          <button class="miniBtn" type="button" @click="availability.resetAll()">Reset all</button>
        </div>
      </section>

      <!-- ORDERS (same as your fake board) -->
      <section v-else class="card">
        <div class="sectionHeader">
          <h2>ORDERS</h2>
          <div class="muted">Layout only (fake orders)</div>
        </div>

        <div class="kanban">
          <div class="col" v-for="col in orderColumns" :key="col.key">
            <div class="colHeader">{{ col.label }}</div>

            <div v-if="ordersByStatus(col.key).length === 0" class="emptyCol">No orders</div>

            <div v-for="o in ordersByStatus(col.key)" :key="o.id" class="orderCard">
              <div class="orderTop">
                <b>Order {{ o.id }}</b>
                <span class="orderMeta">{{ o.time }} • {{ o.date }}</span>
              </div>

              <ul class="orderItems">
                <li v-for="(it, idx) in o.items" :key="idx">{{ it }}</li>
              </ul>

              <div class="orderBtns">
                <button class="miniBtn" type="button" @click="moveOrder(col.key, o.id)" :disabled="col.key === 'completed'">
                  Move →
                </button>
                <button class="miniBtn ghost" type="button" @click="openDetails(o)">Details</button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="detailsOpen" class="modalOverlay" @click="closeDetails">
          <div class="modal" @click.stop>
            <div class="modalHeader">
              <h3>Order {{ detailsOrder?.id }}</h3>
              <button class="xBtn" type="button" @click="closeDetails">✕</button>
            </div>

            <div class="modalBody" v-if="detailsOrder">
              <div class="muted">Placed: {{ detailsOrder.time }} • {{ detailsOrder.date }}</div>

              <div class="modalSectionTitle">Items</div>
              <ul class="modalList">
                <li v-for="(it, idx) in detailsOrder.items" :key="idx">{{ it }}</li>
              </ul>

              <div class="modalFooter">
                <button class="ghostBtn" type="button" @click="closeDetails">Close</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { MENU_ITEMS, type MenuItem } from "../data/menu";

const staffUser = "1234";
const activeTab = ref<"availability" | "orders">("availability");
const availability = useAvailability();

/** Group exactly like menu sections */
const availabilityGroups = computed<Record<string, MenuItem[]>>(() => {
  const groups: Record<string, MenuItem[]> = {};
  for (const item of MENU_ITEMS) {
    const cat = item.category || "Other";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(item);
  }
  return groups;
});

/** Order like your UI */
const GROUP_ORDER = [
  "Breakfast",
  "Lunch",
  "Bagels",
  "Smears",
  "Other",
  "Misc.",
  "Hot Drinks",
  "Cold Drinks",
  "Tea and Smoothies",
  "Bottled Drinks",
];

const orderedGroupKeys = computed(() => {
  const keys = Object.keys(availabilityGroups.value);
  return keys.sort((a, b) => {
    const ia = GROUP_ORDER.indexOf(a);
    const ib = GROUP_ORDER.indexOf(b);
    const ra = ia === -1 ? 999 : ia;
    const rb = ib === -1 ? 999 : ib;
    if (ra !== rb) return ra - rb;
    return a.localeCompare(b);
  });
});

/** Fake orders */
const orderColumns = [
  { key: "new", label: "New" },
  { key: "progress", label: "In Progress" },
  { key: "ready", label: "Ready" },
  { key: "completed", label: "Completed" },
] as const;

type OrderStatus = (typeof orderColumns)[number]["key"];

const orders = ref([
  { id: "1234", status: "new" as OrderStatus, time: "7:30am", date: "1/23/24", items: ["1 Bagel, toasted", "2 Cold brews, small"] },
  { id: "1235", status: "progress" as OrderStatus, time: "7:34am", date: "1/23/24", items: ["1 Farmhouse Egg Sandwich", "1 Latte, medium"] },
]);

function ordersByStatus(statusKey: OrderStatus) {
  return orders.value.filter((o) => o.status === statusKey);
}
const flow: OrderStatus[] = ["new", "progress", "ready", "completed"];
function moveOrder(fromKey: OrderStatus, orderId: string) {
  const idx = orders.value.findIndex((o) => o.id === orderId && o.status === fromKey);
  if (idx === -1) return;
  const nextKey = flow[flow.indexOf(fromKey) + 1];
  if (!nextKey) return;
  orders.value[idx].status = nextKey;
}

/** Details modal */
const detailsOpen = ref(false);
const detailsOrder = ref<any>(null);
function openDetails(order: any) {
  detailsOrder.value = order;
  detailsOpen.value = true;
}
function closeDetails() {
  detailsOpen.value = false;
  detailsOrder.value = null;
}
</script>

<style scoped>
/* you can keep your existing staff styles; this is the same look you already had */
:root {
  --cream: #f6f0e8;
  --cream2: #fbf8f3;
  --brown: #4b3429;
  --cardShadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}
.page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr;
  background: linear-gradient(180deg, var(--cream2), var(--cream));
  color: var(--brown);
}
.sidebar {
  border-right: 1px solid rgba(75, 52, 41, 0.12);
  padding: 18px 14px;
  background: #fff8ee;
}
.sidebarTop {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}
.logoImg {
  width: 100%;
  max-width: 160px;
  height: auto;
  object-fit: contain;
}
.staffTag {
  border: 1px solid rgba(75, 52, 41, 0.14);
  border-radius: 14px;
  padding: 10px 12px;
  background: #fff;
  margin-bottom: 10px;
}
.staffUser { font-weight: 900; opacity: 0.8; }
.staffMode { font-weight: 1000; letter-spacing: 1px; margin-top: 4px; }

.staffNav { display: grid; gap: 8px; margin-bottom: 12px; }
.staffNavBtn {
  text-align: left;
  border-radius: 14px;
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: #fff;
  padding: 10px 12px;
  font-weight: 1000;
  cursor: pointer;
}
.staffNavBtn.active {
  border-color: rgba(244, 179, 22, 0.7);
  box-shadow: var(--cardShadow);
}

.nav { display: grid; gap: 8px; }
.navItem {
  display: block;
  text-decoration: none;
  color: var(--brown);
  font-weight: 800;
  border-radius: 14px;
  padding: 10px 12px;
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: #fff;
}

.main { padding: 20px 26px 50px; }
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.title { margin: 0; font-size: 46px; font-weight: 1100; }
.ghostBtn {
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: #fff;
  border-radius: 14px;
  padding: 10px 14px;
  cursor: pointer;
  box-shadow: var(--cardShadow);
  font-weight: 900;
}

.card {
  background: #fff;
  border-radius: 18px;
  border: 1px solid rgba(75, 52, 41, 0.14);
  box-shadow: var(--cardShadow);
  padding: 14px;
}
.sectionHeader {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  border-bottom: 1px solid rgba(75, 52, 41, 0.12);
  padding-bottom: 10px;
  margin-bottom: 12px;
}
.muted { opacity: 0.7; font-weight: 900; }

.availGroups { display: grid; gap: 16px; }
.availGroup {
  border: 1px solid rgba(75, 52, 41, 0.12);
  border-radius: 16px;
  overflow: hidden;
  background: rgba(75, 52, 41, 0.02);
}
.availGroupTitle {
  padding: 10px 12px;
  font-weight: 1000;
  background: #fff;
  border-bottom: 1px solid rgba(75, 52, 41, 0.1);
}
.availItems {
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(3, minmax(180px, 1fr));
  gap: 10px;
}
.availItemBtn {
  text-align: left;
  border-radius: 14px;
  border: 1px solid rgba(75, 52, 41, 0.14);
  padding: 12px;
  cursor: pointer;
  font-weight: 1000;
  display: grid;
  gap: 6px;
}
.availItemBtn.green { background: rgba(0, 140, 70, 0.12); border-color: rgba(0, 140, 70, 0.25); }
.availItemBtn.red { background: rgba(255, 80, 80, 0.12); border-color: rgba(255, 80, 80, 0.25); }
.availItemStatus { font-weight: 900; opacity: 0.75; font-size: 12px; }

.legend { margin-top: 12px; display: flex; gap: 10px; flex-wrap: wrap; }
.pill {
  border-radius: 999px;
  padding: 6px 10px;
  border: 1px solid rgba(75, 52, 41, 0.14);
  font-weight: 1000;
  background: #fff;
}
.pill.green { background: rgba(0, 140, 70, 0.14); }
.pill.red { background: rgba(255, 80, 80, 0.14); }
.miniBtn {
  border-radius: 12px;
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: #fff;
  padding: 8px 10px;
  font-weight: 1000;
  cursor: pointer;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.04);
}

/* keep your orders styles if you want */
</style>
