<!-- app/pages/Staff.vue -->
<template>
  <!-- ================= LOGIN SCREEN ================= -->
    <div v-if="!staffLoggedIn" class="loginPage">
      <!-- Mobile-only mini brand strip -->
      <div class="brandStrip" aria-hidden="true">
        <img class="brandStripLogo" src="/Logo.png" alt="Einstein Bros Logo" />
      </div>
      <div class="card staffLoginCard">
      <div class="staffLoginHeader">
      <h2 class="staffLoginTitle">Staff Login</h2>    

      <img
        src="/Logo.png"
        alt="Einstein Bros Logo"
        class="staffLoginLogo"
      />
    </div>

      <label>Username</label>
      <input v-model="staffUsername" class="input" placeholder="Staff username" />

      <label>Password</label>
      <input v-model="staffPassword" type="password" class="input" placeholder="Password" />

     <button
      class="primaryBtn"
      :disabled="isStaffLoggingIn"
      @click="handleStaffLogin"
    >
      {{ isStaffLoggingIn ? "Logging in..." : "Log In" }}
    </button>

      <p v-if="staffError" class="errorText">{{ staffError }}</p>
      <p class="muted">
        Forgot your password?
        <button
          type="button"
          class="linkBtn"
          @click="
            showStaffReset = !showStaffReset;
            staffResetMsg = '';
            staffResetLoading = false;
            staffResetChecked = false;
            staffResetUsername = '';
            staffNewPassword = '';
            staffConfirmPassword = '';
          "
        >
          Reset it here
        </button>
      </p>
      
    <div v-if="showStaffReset" class="resetBox">
      <label>Username</label>
      <input
        v-model="staffResetUsername"
        class="input"
        placeholder="Staff username"
        maxlength="10"
      />
    
      <button
        class="primaryBtn"
        :disabled="!staffResetUsername.trim() || staffResetLoading"
        @click="checkStaffUsername"
      >
        {{ staffResetLoading ? "Checking..." : "Check" }}
      </button>
    
      <p v-if="staffResetMsg" class="errorText">{{ staffResetMsg }}</p>
      <!-- ✅ Step B: only show after username is verified -->
      <div v-if="staffResetChecked" class="resetInner">
        <label>New Password</label>
        <input
          v-model="staffNewPassword"
          class="input"
          type="password"
          placeholder="New password"
          maxlength="12"
        />
      
        <label>Confirm New Password</label>
        <input
          v-model="staffConfirmPassword"
          class="input"
          type="password"
          placeholder="Confirm new password"
          maxlength="12"
        />
      
        <button
          class="primaryBtn"
          :disabled="!staffNewPassword || !staffConfirmPassword || staffResetLoading"
          @click="resetStaffPassword"
        >
          {{ staffResetLoading ? "Resetting..." : "Reset Password" }}
        </button>
      </div>
    </div>
    </div>
  </div>

  <!-- ================= REAL STAFF PAGE ================= -->
  <div v-else class="page">
    <!-- ✅ Mobile dark overlay (tap to close) -->
    <div
      v-if="staffMobileNavOpen"
      class="mobileOverlay"
      @click="closeStaffMobileNav"
      aria-hidden="true"
    />
  <!-- ✅ Logging out overlay -->
  <div v-if="isStaffLoggingOut" class="verifyOverlay" role="status" aria-live="polite">
    <div class="verifyCard">
      <div v-if="!staffLogoutDone" class="spinner" aria-hidden="true"></div>
  
      <div v-else class="tickWrap" aria-hidden="true">
        <svg class="tickSvg" viewBox="0 0 52 52">
          <circle class="tickCircle" cx="26" cy="26" r="24" />
          <path class="tickMark" d="M14 27 L22 35 L38 18" />
        </svg>
      </div>
  
      <div class="verifyText">
        {{ staffLogoutDone ? "Success!" : "Logging Out" }}
      </div>
    </div>
  </div>
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ open: staffMobileNavOpen }" aria-label="Staff sidebar">
      <div class="sidebarTop">
        <NuxtLink to="/" class="logoLink">
          <img src="/Logo.png" alt="Einstein Bros Logo" class="logoImg" />
        </NuxtLink>
      </div>

      <div class="staffTag">
        <div class="staffUser">User: {{ staffUser }}</div>
        <div class="staffMode">EMPLOYEE MODE</div>
      </div>

      <nav class="staffNav">
        <button
          class="staffNavBtn"
          :class="{ active: activeTab === 'availability' }"
          @click="activeTab = 'availability'"
        >
          Availability
        </button>

        <button
          class="staffNavBtn"
          :class="{ active: activeTab === 'orders' }"
          @click="activeTab = 'orders'"
        >
          Orders
        </button>

        <button
          class="staffNavBtn"
          :class="{ active: activeTab === 'performance' }"
          @click="activeTab = 'performance'"
        >
          Performance
        </button>
      </nav>
    </aside>

    <!-- Main -->
    <main class="main">    

      <!-- ✅ Mobile-only yellow Einstein strip -->
      <div class="staffBrandStrip" aria-hidden="true">
        <img class="staffBrandStripLogo" src="/Logo.png" alt="Einstein Bros Logo" />
      </div>    

      <header class="topbar">
      <!-- ✅ Mobile hamburger (shows only on phone) -->
      <button
        class="hamburgerBtn"
        type="button"
        @click="openStaffMobileNav"
        aria-label="Open staff menu"
      >
        <span class="hamburgerIcon" aria-hidden="true">☰</span>
      </button>    

      <h1 class="title">Einstein Bros</h1>    

      <div class="staffAccountWrap">
    
        <button
          class="ghostBtn"
          @click="showStaffMenu = !showStaffMenu"
        >
          Hello Staff, {{ staffUser }}
        </button>
    
        <div v-if="showStaffMenu" class="staffAccountMenu">
    
          <div class="menuDivider"></div>
    
          <button
          class="menuItem danger"
          :disabled="isStaffLoggingOut"
          @click="staffLogout"
        >
          {{ isStaffLoggingOut ? "Logging out…" : "Logout" }}
        </button>
        </div>
      </div>
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
                :class="availability.getStatus(it.name)"
                @click="availability.toggle(it.name)"
              >
                <div>{{ it.name }}</div>
                <div class="availItemStatus">
                  {{ availability.getStatus(it.name) === "red" ? "Unavailable" : "Available" }}
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

<!-- ===================== ORDERS TAB ===================== -->
<section v-else-if="activeTab === 'orders'" class="card">
  <div class="sectionHeader">
    <h2>ORDERS</h2>
    <div class="muted">Live orders from database</div>
  </div>

  <!-- Kanban -->
  <div class="kanban">
    <div class="col" v-for="col in orderColumns" :key="col.key">
      <div class="colHeader">{{ col.label }}</div>

      <div v-if="ordersByStatus(col.key).length === 0" class="emptyCol">
        No orders
      </div>

      <article v-for="o in ordersByStatus(col.key)" :key="o.id" class="orderCard">
        <div class="orderTop">
          <div class="orderTitle">
          <div class="orderMeta">Customer: {{ o.customerName }}</div>
            <b>Order {{ (o as any).orderNumber || o.id }}</b>
            <span class="orderMeta">
              {{ formatDateTime(o.createdAt).time }} • {{ formatDateTime(o.createdAt).date }}
            </span>
          </div>
        </div>

        <ul class="orderItems">
        <li v-for="it in o.items" :key="it.id">
          {{ it.quantity }} × {{ it.name }}
        
          <div v-if="it.customizations" class="orderMeta">
            {{ formatCustomizations(it.customizations) }}
          </div>
        </li>
        </ul>

        <div class="orderBtns">
        <button
          class="miniBtn"
          type="button"
          @click="moveOrder(o)"
          :disabled="o.status === 'COMPLETED' || o.status === 'CANCELED'"
        >
          Move →
        </button>
          <button class="miniBtn ghost" type="button" @click="openDetails(o)">
            Details
          </button>
        </div>
      </article>
    </div>
  </div>

  <!-- DETAILS MODAL -->
  <div v-if="detailsOpen" class="modalOverlay" @click="closeDetails">
    <div class="modal" @click.stop>
      <div class="modalHeader">
        <h3>Order {{ (detailsOrder as any)?.orderNumber || detailsOrder?.id }}</h3>
        <button class="xBtn" type="button" @click="closeDetails">✕</button>
      </div>

      <div class="modalBody" v-if="detailsOrder">
      <div class="muted">
        Placed: {{ formatDateTime(detailsOrder.createdAt).time }} • {{ formatDateTime(detailsOrder.createdAt).date }}
      </div>

        <div class="modalSectionTitle">Items</div>
        <ul class="modalList">
        <li v-for="it in detailsOrder.items" :key="it.id">
          {{ it.quantity }} × {{ it.name }}
        </li>
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

import { computed, ref, onMounted, onBeforeUnmount, watch } from "vue"
import { MENU_ITEMS, type MenuItem } from "../data/menu"

const staffLoggedIn = ref(false)
const staffUsername = ref("")
const staffPassword = ref("")
const staffError = ref("")

const staffUser = ref("")
const activeTab = ref<"availability" | "orders" | "performance">("availability")
const showStaffMenu = ref(false)
const isStaffLoggingOut = ref(false)
const isStaffLoggingIn = ref(false)
const staffLogoutDone = ref(false)
const showStaffReset = ref(false)
const staffNewPassword = ref("")
const staffResetLoading = ref(false)
const staffResetMsg = ref("")
const staffResetChecked = ref(false)       // did we already verify username?
const staffConfirmPassword = ref("")       // confirm password box (later step)
const staffResetUsername = ref("")         // separate input just for reset username

// ✅ Mobile staff drawer
const staffMobileNavOpen = ref(false)
function openStaffMobileNav() {
  staffMobileNavOpen.value = true
}
function closeStaffMobileNav() {
  staffMobileNavOpen.value = false
}


function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

function toggleStaffMenu() {
  showStaffMenu.value = !showStaffMenu.value
}

function closeStaffMenu() {
  showStaffMenu.value = false
}

const availability = useAvailability()

// When Staff page loads, check session + role
onMounted(async () => {
  try {
    const api = useApi()
    const me = await api.get("/api/me")

    // if not logged in, just stop
    if (!me.ok) return

    // only allow STAFF
    if (me.user?.role === "STAFF") {
      staffLoggedIn.value = true
      staffUser.value = me.user.username
      staffError.value = ""
    }
  } catch (e) {
    // silently fail
  }
})

// Close dropdown when clicking outside
function handleStaffDocClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (target?.closest(".staffAccountWrap")) return
  showStaffMenu.value = false
}

// Register + cleanup document click listener
onMounted(() => {
  document.addEventListener("click", handleStaffDocClick)
})

onBeforeUnmount(() => {
  document.removeEventListener("click", handleStaffDocClick)
})

function formatCustomizations(c: Record<string, any> | null) {
  if (!c) return ""

  return Object.entries(c)
    .map(([k, v]) => {
      if (Array.isArray(v)) return `${k}: ${v.join(", ")}`
      return `${k}: ${String(v)}`
    })
    .join(" • ")
}

// When staff clicks login button, use backend staff login
async function handleStaffLogin() {
  if (isStaffLoggingIn.value) return

  staffError.value = ""
  isStaffLoggingIn.value = true

  try {
    const api = useApi()
    const data = await api.post("/api/staff/login", {
      username: staffUsername.value,
      password: staffPassword.value,
    })

    if (!data.ok) {
      staffError.value = data.error || "Login failed"
      return
    }

    staffLoggedIn.value = true
    staffUser.value = (data as any)?.user?.username || staffUsername.value
    staffError.value = ""
    if (activeTab.value === "orders") {
      await fetchOrders()
    }
  } catch (e) {
    staffError.value = "Backend not running"
  } finally {
    isStaffLoggingIn.value = false
  }
}

async function checkStaffUsername() {
  staffResetMsg.value = ""
  staffResetChecked.value = false
  staffResetLoading.value = true

  try {
    // fake delay so user sees "Checking..."
    await sleep(2000)

    const api = useApi()
    const check = await api.post("/api/auth/reset/check", {
      username: staffResetUsername.value.trim(),
    })

    if (!check.ok) {
      staffResetMsg.value = check.error || "Could not check username"
      return
    }

    if ((check as any).exists === false) {
      staffResetMsg.value = "No account found with that username"
      return
    }

    // ✅ username exists
    staffResetChecked.value = true
    staffResetMsg.value = "" // clear errors
  } catch (e) {
    staffResetMsg.value = "Check failed"
  } finally {
    staffResetLoading.value = false
  }
}


async function resetStaffPassword() {
  staffResetMsg.value = ""

  // 1) must match
  if (staffNewPassword.value !== staffConfirmPassword.value) {
    staffResetMsg.value = "Passwords do not match"
    return
  }

  staffResetLoading.value = true

  try {
    const api = useApi()

    // optional: small delay so they see "Resetting..."
    await sleep(1200)

    const reset = await api.post("/api/auth/reset", {
      username: staffResetUsername.value.trim(),
      newPassword: staffNewPassword.value,
    })

    if (!reset.ok) {
      staffResetMsg.value = reset.error || "Reset failed"
      return
    }

    // ✅ success message
    staffResetMsg.value = "Password reset! Now log in."

    // clear fields + return to Step A
    staffNewPassword.value = ""
    staffConfirmPassword.value = ""
    staffResetChecked.value = false
  } catch (e) {
    staffResetMsg.value = "Reset failed"
  } finally {
    staffResetLoading.value = false
  }
}

const availabilityGroups = computed<Record<string, MenuItem[]>>(() => {
  const groups: Record<string, MenuItem[]> = {}
  for (const item of MENU_ITEMS) {
    const cat = item.category || "Other"
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(item)
  }
  return groups
})

async function staffLogout() {
  if (isStaffLoggingOut.value) return

  showStaffMenu.value = false
  staffLogoutDone.value = false
  isStaffLoggingOut.value = true

  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    })

    // show spinner a bit
    await sleep(1200)

    // switch to tick
    staffLogoutDone.value = true
    await sleep(600)

    // now fully reset staff state
    staffLoggedIn.value = false
    staffUser.value = ""
    staffUsername.value = ""
    staffPassword.value = ""
  } catch (e) {
    // if logout fails, hide overlay
  } finally {
    isStaffLoggingOut.value = false
    staffLogoutDone.value = false
  }
}
/** ----------------- REAL Orders (from DB) ----------------- */

// These columns stay exactly like your UI
const orderColumns = [
  { key: "new", label: "New" },
  { key: "progress", label: "In Progress" },
  { key: "ready", label: "Ready" },
  { key: "completed", label: "Completed" },
] as const

type ColumnKey = (typeof orderColumns)[number]["key"]

// This matches Prisma enums you made (OrderStatus)
type DbStatus = "PENDING" | "PAID" | "MAKING" | "READY" | "COMPLETED" | "CANCELED"

type DbOrderItem = {
  id: string
  name: string
  quantity: number
  unitPrice: number
  lineTotal: number
  customizations?: Record<string, any> | null
}

type DbOrder = {
  id: string
  customerName: string
  status: DbStatus
  createdAt: string
  total: number
  items: DbOrderItem[]
}

// store all orders from db
const dbOrders = ref<DbOrder[]>([])

function mapDbStatusToColumn(status: DbStatus): ColumnKey {
  if (status === "READY") return "ready"
  if (status === "COMPLETED") return "completed"
  if (status === "MAKING" || status === "PAID") return "progress"
  return "new" // PENDING (and anything else)
}

function formatDateTime(iso: string) {
  const d = new Date(iso)
  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
  const date = d.toLocaleDateString()
  return { time, date }
}

function ordersByStatus(col: ColumnKey) {
  return dbOrders.value.filter((o) => mapDbStatusToColumn(o.status) === col)
}

async function fetchOrders() {
  try {
    const api = useApi()

    // ✅ change this path if your backend is different:
    // if you mounted it as app.use("/api/orders", router) => "/api/orders"
    // if you mounted it as app.use("/orders", router) => "/orders"
    const res = await api.get("/api/orders")

    if (!res?.ok) return
    dbOrders.value = (res as any).orders || []
  } catch (e) {
    // fail silently (or show message if you want)
  }
}
const statusFlow: DbStatus[] = ["PENDING", "MAKING", "READY", "COMPLETED"]

function nextStatus(curr: DbStatus): DbStatus {
  // treat PAID like MAKING for the kanban flow
  if (curr === "PAID") return "MAKING"
  if (curr === "CANCELED") return "CANCELED"

  const i = statusFlow.indexOf(curr)
  if (i === -1) return "PENDING"
  const next = statusFlow[i + 1]
  return next ?? curr // if already last, stay
}

async function moveOrder(order: DbOrder) {
  const next = nextStatus(order.status)
  if (next === order.status) return

  try {
    const api = useApi()

    const res = await api.patch(`/api/orders/${order.id}/status`, {
      status: next,
    })

    if (!res.ok) return

    // refresh the board so it jumps columns
    await fetchOrders()

    // if details modal is open for this order, refresh it
    if (detailsOrder.value?.id === order.id) {
      const updated =
        dbOrders.value.find((x) => x.id === order.id) || null
      detailsOrder.value = updated
    }
  } catch (e) {
    // optional: console.error(e)
  }
}

// ✅ Fetch when staff opens Orders tab
watch(activeTab, async (tab) => {
  if (tab === "orders") {
    await fetchOrders()
  }
})

// ✅ optional: also fetch once if page loads already on orders
onMounted(async () => {
  if (activeTab.value === "orders") {
    await fetchOrders()
  }
})

/** Details modal */
const detailsOpen = ref(false)
const detailsOrder = ref<DbOrder | null>(null)

function openDetails(order: DbOrder) {
  detailsOrder.value = order
  detailsOpen.value = true
}

function closeDetails() {
  detailsOpen.value = false
  detailsOrder.value = null
}

const orderedGroupKeys = computed(() => Object.keys(availabilityGroups.value))
</script>

<style scoped>
.muted {
  opacity: 0.7;
  font-weight: 900;
  margin-top: 6px;
}
.resetInner {
  display: grid;
  gap: 10px;
  margin-top: 8px;
}
.linkBtn {
  border: none;
  background: transparent;
  padding: 0;
  margin-left: 6px;
  font-weight: 1000;
  text-decoration: underline;
  color: #4b3429;
  cursor: pointer;
}

.resetBox {
  margin-top: 10px;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: #fff;
  display: grid;
  gap: 10px;
}
.staffLoginHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.staffLoginTitle {
  margin: 0;
  font-weight: 1100;
}

.staffLoginLogo {
  width: 84px;
  height: auto;
  object-fit: contain;
}
.loginPage {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, #fbf8f3, #f6f0e8);
}
.staffAccountWrap {
  position: relative;
}
/* ===== Mini Brand Strip (desktop hidden) ===== */
.brandStrip {
  display: none; /* hidden on desktop */
}
.brandStripLogo {
  display: block;
}
/* ===== Logout overlay (same as index.vue) ===== */
.verifyOverlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  z-index: 9999;
}
.verifyCard {
  width: min(420px, 92vw);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 24px 70px rgba(2, 6, 23, 0.18);
  padding: 18px 16px;
  display: grid;
  gap: 12px;
  justify-items: center;
  animation: popIn 180ms ease-out;
}
.verifyText {
  font-weight: 950;
  color: rgba(15, 23, 42, 0.88);
}
.spinner {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 4px solid rgba(15, 23, 42, 0.14);
  border-top-color: rgba(10, 132, 255, 0.95);
  animation: spin 0.9s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes popIn {
  from {
    transform: translateY(8px) scale(0.98);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

/* tick */
.tickWrap {
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
}
.tickSvg {
  width: 56px;
  height: 56px;
}
.tickCircle {
  fill: none;
  stroke: rgba(34, 197, 94, 0.25);
  stroke-width: 4;
  stroke-dasharray: 151;
  stroke-dashoffset: 151;
  animation: circleDraw 320ms ease-out forwards;
}
.tickMark {
  fill: none;
  stroke: #22c55e;
  stroke-width: 5;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: tickDraw 260ms 220ms ease-out forwards;
}
@keyframes circleDraw {
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes tickDraw {
  to {
    stroke-dashoffset: 0;
  }
}
.staffAccountMenu {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: 160px;
  background: #fff;
  border: 1px solid rgba(75, 52, 41, 0.14);
  border-radius: 14px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);
  padding: 8px;
  z-index: 50;
}
.staffLoginCard {
  max-width: 420px;
  width: 100%;
  display: grid;
  gap: 12px;
}

.input {
  border-radius: 12px;
  border: 1px solid rgba(75, 52, 41, 0.2);
  padding: 10px;
  font-weight: 900;
}

.primaryBtn {
  border-radius: 12px;
  border: none;
  padding: 10px;
  background: #4b3429;
  color: white;
  font-weight: 1000;
  cursor: pointer;
}
.primaryBtn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.errorText {
  color: red;
  font-weight: 900;
}

/* ===== ORIGINAL DESIGN BELOW (UNCHANGED) ===== */

.page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr;
  background: linear-gradient(180deg, #fbf8f3, #f6f0e8);
  color: #4b3429;
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
.staffUser {
  font-weight: 900;
  opacity: 0.8;
}
.staffMode {
  font-weight: 1000;
  letter-spacing: 1px;
  margin-top: 4px;
}

.staffNav {
  display: grid;
  gap: 8px;
  margin-bottom: 12px;
}
.staffNavBtn {
  text-align: left;
  border-radius: 14px;
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: #fff;
  padding: 10px 12px;
  font-weight: 1000;
  cursor: pointer;
  transition: transform 0.08s ease, box-shadow 0.08s ease;
}
.staffNavBtn:hover {
  transform: translateY(-1px);
  box-shadow: var(--cardShadow);
}
.staffNavBtn.active {
  border-color: rgba(244, 179, 22, 0.7);
  box-shadow: var(--cardShadow);
}

.nav {
  display: grid;
  gap: 8px;
}
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

/* Main */
.main {
  padding: 20px 26px 50px;
}
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.topbarRight {
  display: flex;
  align-items: center;
  gap: 12px;
}

.accountWrap {
  position: relative;
}

.signInBtn {
  display: inline-flex;
  align-items: center;
  border: 1px solid rgba(75, 52, 41, 0.12);
  background: #fff;
  border-radius: 16px;
  padding: 8px 14px;
  min-height: 44px;
  font-size: 15px;
  font-weight: 800;
  color: #4b3429;
  cursor: pointer;
  box-shadow: var(--cardShadow);
}

.accountMenu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 160px;
  background: #fff;
  border: 1px solid rgba(75, 52, 41, 0.14);
  border-radius: 14px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);
  padding: 8px;
  z-index: 999;
}

.menuItem {
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;
  padding: 10px 10px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 900;
  color: #4b3429;
}

.menuItem:hover {
  background: rgba(244, 179, 22, 0.18);
}

.title {
  margin: 0;
  font-size: 46px;
  font-weight: 1100;
}
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
.muted {
  opacity: 0.7;
  font-weight: 900;
}

/* Availability */
.availGroups {
  display: grid;
  gap: 16px;
}
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
  background: #fff;
  cursor: pointer;
  font-weight: 1000;
  display: grid;
  gap: 6px;
}
.availItemBtn.green {
  background: rgba(0, 140, 70, 0.12);
  border-color: rgba(0, 140, 70, 0.25);
}
.availItemBtn.red {
  background: rgba(255, 80, 80, 0.12);
  border-color: rgba(255, 80, 80, 0.25);
}
.availItemStatus {
  font-weight: 900;
  opacity: 0.75;
  font-size: 12px;
}

.legend {
  margin-top: 12px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.pill {
  border-radius: 999px;
  padding: 6px 10px;
  border: 1px solid rgba(75, 52, 41, 0.14);
  font-weight: 1000;
  background: #fff;
}
.pill.green {
  background: rgba(0, 140, 70, 0.14);
}
.pill.red {
  background: rgba(255, 80, 80, 0.14);
}
.miniBtn {
  border-radius: 12px;
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: #fff;
  padding: 8px 10px;
  font-weight: 1000;
  cursor: pointer;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.04);
}

/* Orders Kanban */
.kanban {
  display: grid;
  grid-template-columns: repeat(4, minmax(240px, 1fr));
  gap: 14px;
  margin-top: 8px;
}

.col {
  border: 1px solid rgba(75, 52, 41, 0.12);
  border-radius: 18px;
  background: rgba(75, 52, 41, 0.03);
  overflow: hidden;
  min-height: 540px;
  display: flex;
  flex-direction: column;
}

.colHeader {
  padding: 12px;
  font-weight: 1100;
  font-size: 18px;
  background: #fff;
  border-bottom: 1px solid rgba(75, 52, 41, 0.12);
}

.emptyCol {
  padding: 14px 12px;
  opacity: 0.65;
  font-weight: 900;
}

.orderCard {
  background: #fff;
  border: 1px solid rgba(75, 52, 41, 0.14);
  border-radius: 16px;
  padding: 12px;
  margin: 12px;
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.06);
}

.orderTitle {
  display: grid;
  gap: 4px;
}

.orderMeta {
  font-weight: 900;
  opacity: 0.7;
  font-size: 12px;
}

.orderItems {
  margin: 10px 0 0;
  padding-left: 18px;
  font-weight: 900;
  opacity: 0.9;
}

.orderBtns {
  margin-top: 10px;
  display: flex;
  gap: 8px;
}

.miniBtn.ghost {
  background: rgba(255, 255, 255, 0.65);
}

.miniBtn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

/* Modal */
.modalOverlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.38);
  backdrop-filter: blur(6px);
  z-index: 60;
  display: grid;
  place-items: center;
  padding: 18px;
}
.modal {
  width: min(620px, 96vw);
  background: #fff;
  border-radius: 22px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.18);
  overflow: hidden;
}
.modalHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}
.xBtn {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  background: #fff;
  cursor: pointer;
  display: grid;
  place-items: center;
}
.modalBody {
  padding: 18px;
  display: grid;
  gap: 12px;
}
.modalSectionTitle {
  font-weight: 1100;
  margin-top: 6px;
}
.modalList {
  margin: 0;
  padding-left: 18px;
  font-weight: 900;
  opacity: 0.9;
}
.modalFooter {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
  border-top: 1px solid rgba(15, 23, 42, 0.08);
}
.hamburgerBtn {
  display: none;
}
.staffMobileBrand {
  display: none;
}
/* ✅ full-width yellow strip ONLY on mobile */
.staffBrandStrip {
  display: none; /* default off */
}
/* Responsive */
@media (max-width: 1100px) {
  .kanban {
    grid-template-columns: repeat(2, 1fr);
  }
  .availItems {
    grid-template-columns: repeat(2, minmax(180px, 1fr));
  }
}
@media (max-width: 720px) {
  /* ✅ make the login card feel like your other mobile cards */
  .staffLoginCard {
    margin: 0 auto;
    width: 100%;
    max-width: 520px;       /* a bit wider so it fills nicely */
    border-radius: 18px;
    padding: 14px;          /* tighter */
    gap: 10px;              /* tighter spacing between fields */
    box-sizing: border-box;
  }

  /* ✅ shrink header spacing */
  .staffLoginHeader {
    gap: 10px;
    margin-bottom: 4px;
  }

  .staffLoginTitle {
    font-size: 26px;
    line-height: 1.1;
  }

  .staffLoginLogo {
    width: 64px;            /* smaller logo on phone */
  }

  /* ✅ inputs look tighter like food/drinks */
  .input {
    padding: 11px 12px;
    border-radius: 14px;
    font-size: 15px;
  }

  label {
    font-size: 14px;
    margin-top: 2px;
  }

  /* ✅ button size matches mobile style */
  .primaryBtn {
    padding: 12px;
    border-radius: 14px;
    font-size: 15px;
  }

  /* ✅ forgot password row tighter */
  .muted {
    font-size: 13px;
    margin-top: 4px;
  }
  /* ✅ stop centering everything on mobile */
  .loginPage {
    display: block;
    place-items: unset;
    padding: 14px;
  }

  /* ✅ make the yellow strip full width like other pages */
  .brandStrip {
    width: calc(100% + 28px);
    margin: -14px -14px 14px; /* pull to edges, then add spacing below */
  }

  /* ✅ keep the card centered and not too wide */
  .staffLoginCard {
    margin: 0 auto;
    width: 100%;
    max-width: 420px;
  }
  .page {
    grid-template-columns: 1fr;
  }
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: min(320px, 88vw);
    z-index: 100;
    transform: translateX(-110%);
    transition: transform 0.2s ease;
    box-shadow: 20px 0 60px rgba(0, 0, 0, 0.18);

    /* keep your style */
    background: #fff8ee;
    border-right: 1px solid rgba(75, 52, 41, 0.12);
    border-bottom: none;
  }

  .sidebar.open {
    transform: translateX(0);
  }
   .hamburgerBtn {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    width: 42px;
    height: 42px;
    border-radius: 14px;

    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(75, 52, 41, 0.14);
    box-shadow: 0 12px 26px rgba(0, 0, 0, 0.08);

    cursor: pointer;
    padding: 0;
    transition: transform 0.08s ease, box-shadow 0.08s ease;
  }

  .hamburgerBtn:active {
    transform: scale(0.98);
  }

  .hamburgerIcon {
    font-size: 20px;
    line-height: 1;
    color: #4b3429;
    font-weight: 900;
  }

  .mobileOverlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    z-index: 90;
  }
  .kanban {
    grid-template-columns: 1fr;
  }
  .availItems {
    grid-template-columns: 1fr;
  }
  /* ===== Mini Brand Strip (mobile only) ===== */
  .brandStrip{
    display: flex;
    height: 58px;
    background: #f6e28a;
    border-bottom: 1px solid rgba(75, 52, 41, 0.12);
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 22px rgba(0,0,0,0.08);

    /* match your .main padding style on mobile */
    margin: -14px -14px 12px;
  }
.brandStripLogo{
  height: 38px;
  width: auto;
  object-fit: contain;
  display: block;
}
  .staffBrandStrip {
    display: flex;
    height: 58px;
    background: #f6e28a;
    border-bottom: 1px solid rgba(75, 52, 41, 0.12);
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 22px rgba(0,0,0,0.08);

    /* pull to edges inside main padding */
    margin: -20px -26px 12px;
    border-radius: 0;
  }

  .staffBrandStripLogo {
    height: 38px;
    width: auto;
    object-fit: contain;
    filter: drop-shadow(0 6px 10px rgba(0,0,0,0.12));
  }
.sectionHeader .muted {
    font-size: 12px;        /* smaller text */
    margin-left: 10px;     /* push slightly right */
    text-align: right;     /* aligns nicely under header */
    opacity: 0.65;         /* softer look */
  }
  .title {
    font-size: 23px;        /* smaller than desktop */
    line-height: 1.15;     /* tighter spacing */
    letter-spacing: 0.3px;
    margin-left: 6px;      /* slight breathing room from hamburger */
    margin-bottom: 6px;
    font-weight: 1100;     /* keep brand strong */
  }
}
</style>