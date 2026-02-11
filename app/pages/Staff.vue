<!-- app/pages/staff.vue -->
<template>
  <div class="page">
    <!-- Left Sidebar (same vibe as your other pages) -->
    <aside class="sidebar">
      <div class="sidebarTop">
        <NuxtLink to="/" class="logoLink" aria-label="Main Page">
          <img src="/Logo.png" alt="Einstein Bros Logo" class="logoImg" />
        </NuxtLink>
      </div>

      <nav class="nav">
        <NuxtLink class="navItem" to="/">Main Page</NuxtLink>
        <NuxtLink class="navItem" to="/food">Food Menu</NuxtLink>
        <NuxtLink class="navItem" to="/drinks">Drinks Menu</NuxtLink>
        <NuxtLink class="navItem" to="/checkout">Checkout</NuxtLink>
        <NuxtLink class="navItem" to="/tracking">Tracking</NuxtLink>
      </nav>

      <div class="sideNote">
  <div class="sideTitle">STAFF</div>
  <div class="sideText">
    This page controls the live order status using
    <code>useOrderStatus()</code>.
    Updates sync instantly with the Tracking page.
  </div>
</div>
</aside>

    <!-- Main -->
    <main class="main">
      <header class="topbar">
        <div>
          <h1 class="title">STAFF DASHBOARD</h1>
          <div class="subtitle">Update the order status — Tracking page will react instantly.</div>
        </div>

        <div class="topActions">
          <button class="ghostBtn" type="button" @click="navigateTo('/tracking')">View Tracking →</button>
          <button class="dangerBtn" type="button" @click="resetStatus">Reset</button>
        </div>
      </header>

      <!-- Card -->
      <section class="card">
        <div class="cardHeader">
          <h2>Order Control</h2>
          <div class="meta">
            <span class="pill">
              <span class="dot" :class="currentKey" />
              <span>Current: {{ currentLabel }}</span>
            </span>
            <span class="muted">Shared state: <code>useOrderStatus()</code></span>
          </div>
        </div>

        <!-- Step buttons -->
        <div class="grid">
          <button
            v-for="(s, i) in steps"
            :key="s.key"
            class="stepBtn"
            :class="{
              active: i === statusIndex,
              done: i < statusIndex,
              oven: s.key === 'oven',
              ready: s.key === 'ready'
            }"
            type="button"
            @click="setStatus(i)"
          >
            <div class="stepTop">
              <div class="stepIndex">{{ i + 1 }}</div>
              <div class="stepName">{{ s.label }}</div>
            </div>
            <div class="stepDesc">{{ s.desc }}</div>

            <div class="stepBottom">
              <span class="badge" :class="s.key">{{ badgeText(i) }}</span>
              <span class="hint" v-if="i === statusIndex">Live now</span>
            </div>
          </button>
        </div>

        <!-- Quick actions -->
        <div class="controls">
          <div class="controlsLeft">
            <button class="smallBtn" type="button" @click="prevStep" :disabled="statusIndex === 0">
              ← Back one step
            </button>
            <button class="smallBtn" type="button" @click="nextStep" :disabled="statusIndex === steps.length - 1">
              Next step →
            </button>
          </div>

          <div class="controlsRight">
            <label class="toggle">
              <input type="checkbox" v-model="autoDemo" />
              <span class="toggleUi" />
              <span class="toggleText">Auto demo loop</span>
            </label>

            <button class="smallBtn" type="button" @click="pushPulse">
              Send “update pulse”
            </button>
          </div>
        </div>

        <!-- Log -->
        <div class="log">
          <div class="logTitle">Recent updates</div>
          <div v-if="logs.length === 0" class="logEmpty">No updates yet.</div>

          <div v-else class="logList">
            <div v-for="(l, idx) in logs" :key="idx" class="logRow">
              <span class="time">{{ l.time }}</span>
              <span class="msg">{{ l.msg }}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";

/**
 * ✅ Shared status across pages (Tracking reads this).
 * 0: ordered, 1: preparing, 2: oven, 3: ready
 */
const orderStatus = useOrderStatus();

/** Optional: “pulse” counter to force animations / effects if you want later */
const orderPulse = useState("orderPulse", () => 0);

const steps = [
  { key: "ordered", label: "Ordered", desc: "Order received and confirmed in the system." },
  { key: "preparing", label: "Preparing", desc: "Staff is assembling and prepping the items." },
  { key: "oven", label: "In the Oven", desc: "Toasting / heating step in progress." },
  { key: "ready", label: "Ready", desc: "Order finished and ready for pickup." },
];

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

const statusIndex = computed(() => clamp(orderStatus.value, 0, steps.length - 1));
const currentKey = computed(() => steps[statusIndex.value]?.key || "ordered");
const currentLabel = computed(() => steps[statusIndex.value]?.label || "Ordered");

/** Logging */
const logs = ref([]);

function nowTime() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function log(msg) {
  logs.value.unshift({ time: nowTime(), msg });
  logs.value = logs.value.slice(0, 10);
}

/** Actions */
function setStatus(i) {
  const next = clamp(i, 0, steps.length - 1);

  if (next === orderStatus.value) {
    log(`Re-sent: ${steps[next].label}`);
    pushPulse();
    return;
  }

  orderStatus.value = next;
  log(`Set status → ${steps[next].label}`);
  pushPulse();
}

function nextStep() {
  setStatus(orderStatus.value + 1);
}
function prevStep() {
  setStatus(orderStatus.value - 1);
}
function resetStatus() {
  orderStatus.value = 0;
  log("Reset status → Ordered");
  pushPulse();
}

function pushPulse() {
  orderPulse.value += 1;
}

/** Badge helper */
function badgeText(i) {
  if (i < statusIndex.value) return "Done";
  if (i === statusIndex.value) return "Active";
  return "Pending";
}

/** Auto demo loop */
const autoDemo = ref(false);
let timer = null;

watch(
  autoDemo,
  (on) => {
    if (!on) {
      if (timer) clearInterval(timer);
      timer = null;
      return;
    }

    log("Auto demo started");
    timer = setInterval(() => {
      if (orderStatus.value >= steps.length - 1) {
        orderStatus.value = 0;
        log("Loop → Ordered");
        pushPulse();
      } else {
        orderStatus.value += 1;
        log(`Auto → ${steps[orderStatus.value].label}`);
        pushPulse();
      }
    }, 1800);
  },
  { immediate: false }
);

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
:root {
  --cream: #f6f0e8;
  --cream2: #fbf8f3;
  --brown: #4b3429;
  --brown2: #6a4a3a;
  --yellow: #f4b316;
  --orange: #f4a51c;
  --green: rgba(0, 140, 70, 0.75);
  --blue: rgba(26, 115, 232, 0.75);

  --cardShadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr;
  background: linear-gradient(180deg, var(--cream2), var(--cream));
  color: var(--brown);
}

/* Sidebar */
.sidebar {
  border-right: 1px solid rgba(75, 52, 41, 0.12);
  padding: 18px 14px;
  background: #fff8ee;
}
.sidebarTop {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
}
.logoImg {
  width: 100%;
  max-width: 160px;
  height: auto;
  object-fit: contain;
}
.nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.navItem {
  display: block;
  text-decoration: none;
  color: var(--brown);
  font-size: 16px;
  font-weight: 800;
  border-radius: 14px;
  padding: 12px 12px;
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: #fff;
  transition: transform 0.08s ease, box-shadow 0.08s ease, border 0.08s ease;
}
.navItem:hover {
  transform: translateY(-1px);
  box-shadow: var(--cardShadow);
  border-color: rgba(244, 179, 22, 0.55);
}
.sideNote {
  margin-top: 14px;
  border: 1px solid rgba(75, 52, 41, 0.12);
  border-radius: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.7);
}
.sideTitle {
  font-weight: 1000;
  letter-spacing: 1px;
  opacity: 0.85;
}
.sideText {
  margin-top: 6px;
  font-weight: 850;
  opacity: 0.75;
  line-height: 1.35;
}
.sideText code {
  background: rgba(75, 52, 41, 0.07);
  padding: 1px 6px;
  border-radius: 8px;
}

/* Main */
.main {
  padding: 20px 26px 50px;
}

.topbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
}
.title {
  margin: 0;
  font-size: 42px;
  letter-spacing: 1px;
  font-weight: 1000;
}
.subtitle {
  margin-top: 6px;
  font-weight: 900;
  opacity: 0.75;
}

.topActions {
  display: flex;
  gap: 10px;
  align-items: center;
}
.ghostBtn {
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: rgba(255, 255, 255, 0.75);
  border-radius: 14px;
  padding: 10px 14px;
  cursor: pointer;
  box-shadow: var(--cardShadow);
  font-weight: 900;
}
.dangerBtn {
  border: 1px solid rgba(255, 80, 80, 0.35);
  background: rgba(255, 80, 80, 0.12);
  border-radius: 14px;
  padding: 10px 14px;
  cursor: pointer;
  box-shadow: var(--cardShadow);
  font-weight: 1000;
}

/* Card */
.card {
  background: #fff;
  border-radius: 18px;
  border: 1px solid rgba(75, 52, 41, 0.14);
  box-shadow: var(--cardShadow);
  padding: 14px;
}
.cardHeader {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  border-bottom: 1px solid rgba(75, 52, 41, 0.12);
  padding-bottom: 10px;
  margin-bottom: 14px;
}
.cardHeader h2 {
  margin: 0;
}
.meta {
  display: grid;
  gap: 8px;
  justify-items: end;
}
.muted {
  opacity: 0.7;
  font-weight: 900;
}
.muted code {
  background: rgba(75, 52, 41, 0.07);
  padding: 1px 6px;
  border-radius: 8px;
}

/* Current pill */
.pill {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
  font-weight: 1000;
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: rgba(75, 52, 41, 0.25);
}
.dot.ordered {
  background: rgba(75, 52, 41, 0.35);
}
.dot.preparing {
  background: var(--blue);
  box-shadow: 0 0 0 6px rgba(26, 115, 232, 0.14);
}
.dot.oven {
  background: rgba(244, 165, 28, 0.95);
  box-shadow: 0 0 0 6px rgba(244, 165, 28, 0.14);
}
.dot.ready {
  background: var(--green);
  box-shadow: 0 0 0 6px rgba(0, 140, 70, 0.12);
}

/* Grid of big buttons */
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(240px, 1fr));
  gap: 14px;
}

.stepBtn {
  text-align: left;
  border-radius: 18px;
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.75));
  box-shadow: 0 14px 30px rgba(0,0,0,0.06);
  padding: 14px;
  cursor: pointer;
  transition: transform 0.08s ease, box-shadow 0.08s ease, border 0.08s ease;
}
.stepBtn:hover {
  transform: translateY(-1px);
  box-shadow: 0 18px 44px rgba(0,0,0,0.10);
  border-color: rgba(244, 179, 22, 0.45);
}
.stepBtn.active {
  border-color: rgba(244, 179, 22, 0.55);
  box-shadow: 0 18px 44px rgba(244, 179, 22, 0.10);
}
.stepBtn.done {
  border-color: rgba(0, 140, 70, 0.28);
}
.stepBtn.oven.active {
  border-color: rgba(244, 165, 28, 0.55);
  box-shadow: 0 18px 44px rgba(244, 165, 28, 0.12);
}
.stepBtn.ready.active {
  border-color: rgba(0, 140, 70, 0.35);
  box-shadow: 0 18px 44px rgba(0, 140, 70, 0.10);
}

.stepTop {
  display: flex;
  align-items: center;
  gap: 12px;
}
.stepIndex {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: rgba(75, 52, 41, 0.04);
  font-weight: 1000;
}
.stepName {
  font-weight: 1000;
  font-size: 18px;
}
.stepDesc {
  margin-top: 10px;
  font-weight: 900;
  opacity: 0.75;
  line-height: 1.35;
}

.stepBottom {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 1000;
  border: 1px solid rgba(75,52,41,0.14);
  background: rgba(75,52,41,0.03);
}
.badge.ordered { background: rgba(75,52,41,0.06); }
.badge.preparing { background: rgba(26,115,232,0.10); border-color: rgba(26,115,232,0.22); }
.badge.oven { background: rgba(244,165,28,0.16); border-color: rgba(244,165,28,0.30); }
.badge.ready { background: rgba(0,140,70,0.12); border-color: rgba(0,140,70,0.22); }

.hint {
  font-weight: 1000;
  opacity: 0.7;
}

/* Controls row */
.controls {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(75, 52, 41, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.controlsLeft,
.controlsRight {
  display: flex;
  align-items: center;
  gap: 10px;
}

.smallBtn {
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: #fff;
  border-radius: 14px;
  padding: 10px 12px;
  cursor: pointer;
  font-weight: 1000;
  box-shadow: 0 10px 24px rgba(0,0,0,0.06);
}
.smallBtn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* Toggle */
.toggle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  user-select: none;
  font-weight: 1000;
  opacity: 0.9;
}
.toggle input {
  display: none;
}
.toggleUi {
  width: 44px;
  height: 26px;
  border-radius: 999px;
  border: 1px solid rgba(75, 52, 41, 0.16);
  background: rgba(75, 52, 41, 0.08);
  position: relative;
  transition: background 0.18s ease;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.7);
}
.toggleUi::after {
  content: "";
  position: absolute;
  left: 4px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.10);
  box-shadow: 0 10px 18px rgba(0,0,0,0.10);
  transition: transform 0.18s ease;
}
.toggle input:checked + .toggleUi {
  background: rgba(0, 140, 70, 0.18);
  border-color: rgba(0, 140, 70, 0.28);
}
.toggle input:checked + .toggleUi::after {
  transform: translate(18px, -50%);
}
.toggleText {
  opacity: 0.85;
}

/* Log */
.log {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(75, 52, 41, 0.12);
}
.logTitle {
  font-weight: 1000;
  opacity: 0.8;
  margin-bottom: 10px;
}
.logEmpty {
  opacity: 0.65;
  font-weight: 900;
}
.logList {
  display: grid;
  gap: 8px;
}
.logRow {
  display: grid;
  grid-template-columns: 86px 1fr;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(75, 52, 41, 0.10);
  background: rgba(255,255,255,0.75);
}
.time {
  font-weight: 1000;
  opacity: 0.8;
}
.msg {
  font-weight: 900;
  opacity: 0.85;
}

/* Responsive */
@media (max-width: 980px) {
  .page {
    grid-template-columns: 1fr;
  }
  .sidebar {
    border-right: none;
    border-bottom: 1px solid rgba(75, 52, 41, 0.12);
  }
  .grid {
    grid-template-columns: 1fr;
  }
  .meta {
    justify-items: start;
  }
}
</style>
