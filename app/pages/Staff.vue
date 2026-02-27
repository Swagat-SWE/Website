<!-- app/pages/Staff.vue -->
<template>
  <!-- ================= LOGIN SCREEN ================= -->
  <div v-if="!staffLoggedIn" class="loginPage">
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

      <button class="primaryBtn" @click="handleStaffLogin">
        Log In
      </button>

      <p v-if="staffError" class="errorText">{{ staffError }}</p>
    </div>
  </div>

  <!-- ================= REAL STAFF PAGE ================= -->
  <div v-else class="page">
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
    <aside class="sidebar">
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
    <header class="topbar">
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

      <!-- ORDERS -->
      <section v-else class="card">
        <h2>ORDERS</h2>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">

import { MENU_ITEMS, type MenuItem } from "../data/menu"

const staffLoggedIn = ref(false)
const staffUsername = ref("")
const staffPassword = ref("")
const staffError = ref("")

const staffUser = ref("")
const activeTab = ref<"availability" | "orders" | "performance">("availability")
const showStaffMenu = ref(false)
const isStaffLoggingOut = ref(false)
const staffLogoutDone = ref(false)

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

import { computed, ref, onMounted, onBeforeUnmount } from "vue"
// When Staff page loads, check session + role
onMounted(async () => {
  try {
    const res = await fetch("/api/me", { credentials: "include" })
    if (!res.ok) return

    const data = await res.json()

    if (data?.user?.role === "STAFF") {
      staffLoggedIn.value = true
      staffUser.value = data.user.username
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


// When staff clicks login button, use backend staff login
async function handleStaffLogin() {
  staffError.value = ""

  try {
    const res = await fetch("/api/staff/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        username: staffUsername.value,
        password: staffPassword.value,
      }),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      staffError.value = data.error || "Login failed"
      return
    }

    staffLoggedIn.value = true
    staffUser.value = data?.user?.username || staffUsername.value
    staffError.value = ""
  } catch (e) {
    staffError.value = "Backend not running"
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

const orderedGroupKeys = computed(() => Object.keys(availabilityGroups.value))
</script>

<style scoped>

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
  .page {
    grid-template-columns: 1fr;
  }
  .sidebar {
    border-right: none;
    border-bottom: 1px solid rgba(75, 52, 41, 0.12);
  }
  .kanban {
    grid-template-columns: 1fr;
  }
  .availItems {
    grid-template-columns: 1fr;
  }
}
</style>