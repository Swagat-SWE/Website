<!-- app/pages/checkout.vue -->
<template>
  <div class="page">
    <!-- Left Sidebar (matches home) -->
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
        <NuxtLink class="navItem" to="/contact">Contact</NuxtLink>
      </nav>
    </aside>

    <!-- Main -->
    <main class="main">
      <header class="topbar">
        <h1 class="title">CHECKOUT</h1>

        <button class="cartBtn" type="button" @click="navigateTo('/')">
          ← Back
        </button>
      </header>

      <!-- Ordering overlay -->
      <div v-if="isOrdering" class="verifyOverlay" role="status" aria-live="polite">
        <div class="verifyCard">
          <!-- while loading -->
          <div v-if="!orderDone" class="spinner" aria-hidden="true"></div>

          <!-- after done: tick -->
          <div v-else class="tickWrap" aria-hidden="true">
            <svg class="tickSvg" viewBox="0 0 52 52">
              <circle class="tickCircle" cx="26" cy="26" r="24" />
              <path class="tickMark" d="M14 27 L22 35 L38 18" />
            </svg>
          </div>

          <div class="verifyText">
            {{ orderDone ? "Order sent!" : orderStepText }}
          </div>
        </div>
      </div>

      <div class="layout">
        <!-- Cart Card -->
        <section class="card">
          <div class="cardHeader">
            <h2>Your Shopping Cart</h2>
            <span class="muted">{{ cartCount }} item(s)</span>
          </div>

          <div v-if="cart.length === 0" class="empty">
            Your cart is empty. Go back and add something 🙂
          </div>

          <div v-else class="cartList">
            <div v-for="(item, idx) in cart" :key="idx" class="cartRow">
              <div class="qtyCol">
                <button class="qtyBtn" @click="decQty(idx)">−</button>
                <div class="qtyNum">{{ item.qty }}</div>
                <button class="qtyBtn" @click="incQty(idx)">+</button>
              </div>

              <div class="imgCol">
                <div class="thumb">
                  <img v-if="item.img" :src="item.img" :alt="item.name" />
                  <div v-else class="thumbFallback">PIC</div>
                </div>
              </div>

              <div class="infoCol">
                <div class="rowTop">
                  <div class="name">{{ item.name }}</div>

                  <button class="linkBtn" type="button" @click="openEdit(idx)">
                    edit
                  </button>
                </div>

                <div class="subText">
                  <span v-if="item.category === 'drink'">
                    <span v-if="item.size"><b>Size:</b> {{ item.size }}</span>
                    <span v-if="item.custom?.milk"> • <b>Milk:</b> {{ item.custom.milk }}</span>
                    <span v-if="item.custom?.sweetener"> • <b>Sweetener:</b> {{ item.custom.sweetener }}</span>
                    <span v-if="item.custom?.ice"> • <b>Ice:</b> {{ item.custom.ice }}</span>
                    <span v-if="item.custom?.upgrades?.length">
                      • <b>Add-ons:</b> {{ item.custom.upgrades.join(", ") }}
                    </span>
                    <span v-if="item.custom?.notes"> • “{{ item.custom.notes }}”</span>

                    <span
                      v-if="
                        !item.size &&
                        !item.custom?.milk &&
                        !item.custom?.sweetener &&
                        !item.custom?.ice &&
                        !(item.custom?.upgrades?.length) &&
                        !item.custom?.notes
                      "
                    >
                      No customizations
                    </span>
                  </span>

                  <span v-else>
                    <span v-if="item.custom">
                      <span v-if="item.custom.bagel"><b>{{ item.custom.bagel }}</b></span>
                      <span v-if="item.custom.shmear"> • {{ item.custom.shmear }}</span>
                      <span v-if="item.custom.extras?.length"> • Extras: {{ item.custom.extras.join(", ") }}</span>
                      <span v-if="item.custom.notes"> • “{{ item.custom.notes }}”</span>
                    </span>
                    <span v-else>No customizations</span>
                  </span>
                </div>

                <button class="removeBtn" type="button" @click="removeItem(idx)">
                  Remove
                </button>
              </div>

              <div class="totalCol">
                <div class="priceEach">${{ (item.priceEach ?? 0).toFixed(2) }}</div>
                <div class="lineTotal">${{ lineTotal(item).toFixed(2) }}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Summary Card -->
        <aside class="card summary">
          <h2>Order Summary</h2>

          <div class="sumRow">
            <span>Subtotal</span>
            <b>${{ subtotal.toFixed(2) }}</b>
          </div>

          <div class="sumRow">
            <span>Tax (7%)</span>
            <b>${{ tax.toFixed(2) }}</b>
          </div>

          <div class="taxBreakdown">
            <small>Includes 6.0% Iowa state tax + 1.0% Dubuque local tax</small><br />
            <small>IA State (6.0%): ${{ stateTax.toFixed(2) }}</small><br />
            <small>Dubuque Local (1.0%): ${{ localTax.toFixed(2) }}</small>
          </div>

          <div class="sumRow total">
            <span>Total</span>
            <b>${{ total.toFixed(2) }}</b>
          </div>

          <label class="confirmRow">
            <input type="checkbox" v-model="confirmed" />
            <span>I confirm my order is correct</span>
          </label>

          <div v-if="hasPayment" class="paySummary">
            <div class="payTitle">Payment method</div>

            <div class="payRow" v-if="defaultCard">
              <!-- Mini Logo Box -->
              <div class="payLogoBox">
                <img
                  :src="`/brands/${defaultCard.brand}.png`"
                  :alt="defaultCard.brandLabel"
                  class="payLogo"
                />
              </div>

              <!-- Card Info -->
              <div class="payInfo">
                <div class="payBrand">{{ defaultCard.brandLabel }}</div>
                <div class="payNumber">
                  {{ defaultCard.masked }} • Exp {{ defaultCard.exp }}
                </div>
              </div>
            </div>

            <button class="linkBtn" type="button" @click="goToPayment">
              Change payment method
            </button>
          </div>

          <button v-else class="addPaymentBtn" type="button" @click="goToPayment">
            Add Payment Method
          </button>

          <button
            class="primaryBtn"
            :disabled="!confirmed || cart.length === 0 || !hasPayment"
            type="button"
            @click="placeOrder"
          >
            Order Now
          </button>
        </aside>
      </div>

      <div v-if="defaultCard">
        {{ defaultCard.brandLabel }} •••• {{ defaultCard.last4 }}
      </div>
      <div v-else>
        No default card selected
      </div>

      <!-- EDIT MODAL -->
      <div v-if="editOpen" class="modalOverlay" @click="closeEdit">
        <div class="modal" @click.stop>
          <div class="modalHeader">
            <h3>Edit item</h3>
            <button class="xBtn" type="button" @click="closeEdit">✕</button>
          </div>

          <div v-if="editingItem" class="modalBody">
            <div class="modalTitle">{{ editingItem.name }}</div>

            <!-- DRINK FIELDS -->
            <template v-if="editingCategory === 'drink'">
              <label class="fieldLabel">Milk</label>
              <select v-model="editDraft.milk" class="select">
                <option value="">No milk</option>
                <option v-for="m in editingOptions.milks || []" :key="m" :value="m">
                  {{ m }}
                </option>
              </select>

              <label class="fieldLabel">Sweetener</label>
              <select v-model="editDraft.sweetener" class="select">
                <option value="">No sweetener</option>
                <option v-for="s in editingOptions.sweeteners || []" :key="s" :value="s">
                  {{ s }}
                </option>
              </select>

              <label class="fieldLabel">Ice</label>
              <select v-model="editDraft.ice" class="select">
                <option value="">Regular</option>
                <option v-for="i in editingOptions.ice || []" :key="i" :value="i">
                  {{ i }}
                </option>
              </select>

              <label class="fieldLabel">Upgrades</label>
              <div class="extras">
                <label v-for="u in editingOptions.upgrades || []" :key="u.name" class="checkLine">
                  <input type="checkbox" :value="u.name" v-model="editDraft.upgrades" />
                  <span>{{ u.name }}</span>
                  <b>+${{ u.price.toFixed(2) }}</b>
                </label>
              </div>
            </template>

            <!-- SANDWICH / BAGEL / OTHER FIELDS -->
            <template v-else>
              <label v-if="editingOptions.bagels?.length" class="fieldLabel">Bagel</label>
              <select v-if="editingOptions.bagels?.length" v-model="editDraft.bagel" class="select">
                <option value="">Select a bagel…</option>
                <option v-for="b in editingOptions.bagels" :key="b" :value="b">
                  {{ b }}
                </option>
              </select>

              <label v-if="editingOptions.shmears?.length" class="fieldLabel">Shmear</label>
              <select v-if="editingOptions.shmears?.length" v-model="editDraft.shmear" class="select">
                <option value="">No shmear</option>
                <option v-for="s in editingOptions.shmears" :key="s" :value="s">
                  {{ s }}
                </option>
              </select>

              <label v-if="editingOptions.extras?.length" class="fieldLabel">Extras</label>
              <div v-if="editingOptions.extras?.length" class="extras">
                <label v-for="ex in editingOptions.extras" :key="ex.name" class="checkLine">
                  <input type="checkbox" :value="ex.name" v-model="editDraft.extras" />
                  <span>{{ ex.name }}</span>
                  <b>+${{ ex.price.toFixed(2) }}</b>
                </label>
              </div>
            </template>

            <label class="fieldLabel">Notes</label>
            <textarea v-model="editDraft.notes" class="textarea" rows="3" />

            <div class="modalFooter">
              <div class="modalTotal">
                Item total: <b>${{ editedPriceEach.toFixed(2) }}</b>
              </div>

              <button class="primaryBtn" type="button" @click="saveEdit">Save</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useApi } from "../composables/useApi"; // if path differs, adjust

const isOrdering = ref(false);
const orderDone = ref(false);
const orderStepText = ref("Creating an order number…");

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function toCents(n) {
  return Math.round(Number(n || 0) * 100);
}

  // minimal helper: ensure a guestId exists for non-logged-in users
 async function ensureGuestId(api) {
  if (!process.client) return null;

  // If backend session already knows this guest, use it
  try {
    const me = await api.get("/api/me");
    if (me?.ok && me?.type === "guest" && me?.user?.id) {
      localStorage.setItem("guestId", me.user.id);
      return me.user.id;
    }
  } catch {
    // ignore and continue
  }

  // If we already stored one before, try to use it
  const existing = localStorage.getItem("guestId");
  if (existing) return existing;

  // Create a REAL guest in backend DB
  const guestName =
    localStorage.getItem("guestName") ||
    "Guest";

  const res = await api.post("/api/guest", { name: guestName });

  if (!res?.ok || !res?.guest?.id) {
    throw new Error(res?.error || "Could not create guest session.");
  }

  const id = String(res.guest.id);
  localStorage.setItem("guestId", id);
  return id;
}

async function placeOrder() {
  if (!confirmed.value || cart.value.length === 0 || !hasPayment.value) return;

  isOrdering.value = true;
  orderDone.value = false;

  try {
    const api = useApi();

    // Step 1
    orderStepText.value = "Creating an order number…";
    await sleep(900);

    // Build items for backend (cents + quantity)
    const items = cart.value.map((it) => ({
      name: String(it.name || "Item"),
      quantity: Number.isInteger(it.qty) ? it.qty : Number(it.qty || 1),
      unitPrice: toCents(it.priceEach ?? 0),
    
      // NEW: send customizations to backend -> Prisma
      customizations: (!it.custom || Array.isArray(it.custom) || Object.keys(it.custom).length === 0) ? null : it.custom,
    }));

    // Step 2
    orderStepText.value = "Sending the info to the staff…";
    await sleep(600);

    // figure out user vs guest
    const me = await api.get("/api/me");

    const payload = { items };

  if (me?.ok && me.type === "user" && me.user?.id) {
    payload.userId = me.user.id;
  } else {
    const guestId = await ensureGuestId(api);
    if (!guestId) {
      throw new Error("Could not create guest session.");
    }
    payload.guestId = guestId;
  }

    // REAL create order in DB
    // (This must match what Staff.vue fetches. We'll keep it /api/orders here.)
    const created = await api.post("/api/orders", payload);
    if (!created?.ok) {
      throw new Error(created?.error || "Order failed");
    }

    // Step 3
    orderStepText.value = "Finalizing your order…";
    await sleep(700);

    // tick
    orderDone.value = true;
    await sleep(700);

    // clear cart now that it's placed
    cart.value = [];
    confirmed.value = false;

    // go to tracking with real orderNumber
    const orderNumber = created.order?.orderNumber || created.orderNumber;

    // save the order number for later tracking
    if (orderNumber) {
      localStorage.setItem("lastOrderNumber", orderNumber);
    }

    navigateTo(
      orderNumber
        ? { path: "/tracking", query: { orderNumber } }
        : "/tracking"
    );
  } catch (e) {
    orderDone.value = false;
    alert(e?.message || "Order failed");
  } finally {
    isOrdering.value = false;
  }
}

const cards = useState("cards", () => []);
const defaultCardId = useState("defaultCardId", () => null);
// LOAD cards from localStorage on refresh
if (import.meta.client) {
  const savedCards = localStorage.getItem("cards");
  const savedDefault = localStorage.getItem("defaultCardId");

  if (savedCards) {
    cards.value = JSON.parse(savedCards);
  }

  if (savedDefault) {
    defaultCardId.value = savedDefault;
  }
}


const defaultCard = computed(() => {
  if (!cards.value.length) return null;
  return cards.value.find((c) => c.id === defaultCardId.value) || cards.value[0];
});

/** CART STATE (shared with index.vue) */
const cart = useState("cart", () => []);

if (import.meta.client) {
  const saved = localStorage.getItem("cart");
  if (saved) {
    cart.value = JSON.parse(saved);
  }
}

watch(
  () => cart.value,
  (newCart) => {
    if (!import.meta.client) return;
    localStorage.setItem("cart", JSON.stringify(newCart || []));
  },
  { deep: true, immediate: true }
);
// SAVE cards
watch(
  () => cards.value,
  (newCards) => {
    if (!import.meta.client) return;
    localStorage.setItem("cards", JSON.stringify(newCards || []));
  },
  { deep: true, immediate: true }
);

// SAVE default card
watch(defaultCardId, (newId) => {
  if (!import.meta.client) return;
  if (newId) {
    localStorage.setItem("defaultCardId", newId);
  }
});
function itemCategory(item) {
  return item.category || item.type || "other";
}

/** ORDER TOTALS */
const cartCount = computed(() => cart.value.reduce((sum, i) => sum + (i.qty || 1), 0));

const hasPayment = computed(() => !!defaultCard.value);

function lineTotal(item) {
  return (item.priceEach ?? 0) * (item.qty || 1);
}

const subtotal = computed(() => cart.value.reduce((sum, i) => sum + lineTotal(i), 0));

const stateTaxRate = 0.06; //Iowa state
const localTaxRate = 0.01; // Dubuque local tax
const taxRate = stateTaxRate + localTaxRate;

const stateTax = computed(() => subtotal.value * stateTaxRate);
const localTax = computed(() => subtotal.value * localTaxRate);
const tax = computed(() => stateTax.value + localTax.value);

const total = computed(() => subtotal.value + tax.value);

/** QTY + REMOVE */
function incQty(idx) {
  cart.value[idx].qty = (cart.value[idx].qty || 1) + 1;
}

function decQty(idx) {
  const cur = cart.value[idx].qty || 1;
  if (cur <= 1) return;
  cart.value[idx].qty = cur - 1;
}

function removeItem(idx) {
  cart.value.splice(idx, 1);
}

/** CONFIRM */
const confirmed = ref(false);

/** OPTIONS FOR CUSTOMIZATION (you can expand later) */
const OPTIONS_BY_CATEGORY = {
  sandwich: {
    bagels: ["Cheesy Hash", "Everything", "Plain", "Sesame", "Asiago"],
    shmears: ["No shmear", "Plain Shmear", "Country Pepper Shmear", "Roasted Tomato Spread"],
    extras: [
      { name: "Extra Cheese", price: 1.0 },
      { name: "Bacon", price: 1.5 },
      { name: "Avocado", price: 1.5 },
      { name: "Extra Egg", price: 1.5 },
    ],
    remove: ["Cheese", "Egg", "Bacon", "Onion", "Tomato", "Spinach", "Sauce"],
    toasts: ["Not toasted", "Light toast", "Toasted"],
    cuts: ["Not cut", "Cut in half"],
  },

  bagel: {
    toasts: ["Not toasted", "Light toast", "Toasted"],
    slices: ["Not sliced", "Sliced"],
    shmears: ["No shmear", "Plain", "Strawberry", "Almond", "Country Pepper", "Garden Veggie", "Onion Chive"],
    extras: [
      { name: "Butter", price: 0.5 },
      { name: "Jam", price: 0.75 },
      { name: "Extra shmear", price: 0.75 },
    ],
  },

  shmear: {
    amounts: ["Regular", "Light", "Extra"],
    serveAs: ["On the side", "On bagel"],
    extras: [{ name: "Extra cup", price: 0.5 }],
  },

  other: {
    warm: ["No", "Yes (warmed)"],
    extras: [
      { name: "Butter", price: 0.5 },
      { name: "Jam", price: 0.75 },
    ],
  },

  drink: {
    // you can tweak these
    sizes: ["Small", "Medium", "Large"],
    milks: ["No milk", "2% milk", "Whole milk", "Oat milk", "Almond milk"],
    sweeteners: ["No sweetener", "Sugar", "Splenda", "Stevia", "Vanilla syrup", "Caramel syrup"],
    ice: ["No ice", "Light ice", "Regular ice", "Extra ice"],
    upgrades: [
      { name: "Extra espresso shot", price: 1.25 },
      { name: "Whipped cream", price: 0.75 },
    ],
  },
};

function getOptionsFor(item) {
  const cat = item?.category || item?.type || "other";
  return OPTIONS_BY_CATEGORY[cat] || OPTIONS_BY_CATEGORY.other;
}

function goToPayment() {
  navigateTo("/Payment");
}

/** EDIT MODAL STATE */
const editOpen = ref(false);
const editingIndex = ref(-1);

const editingItem = computed(() => {
  if (editingIndex.value < 0) return null;
  return cart.value[editingIndex.value];
});

const editingCategory = computed(() => {
  const item = editingItem.value;
  return item?.category || item?.type || "other";
});

const editingOptions = computed(() => {
  return getOptionsFor(editingItem.value);
});

const editDraft = ref({
  // sandwich / bagel
  bagel: "",
  shmear: "",
  toasted: "",
  sliced: "",

  // drink
  milk: "",
  sweetener: "",
  ice: "",
  upgrades: [],

  // shared
  extras: [],
  notes: "",
});

/** When opening edit, copy current custom values into the draft */
function openEdit(idx) {
  editingIndex.value = idx;

  const item = cart.value[idx];
  const current = item.custom || {};

  editDraft.value = {
    // sandwich/bagel
    bagel: current.bagel || "",
    shmear: current.shmear || "",
    toasted: current.toasted || "",
    sliced: current.sliced || "",

    // drink
    milk: current.milk || "",
    sweetener: current.sweetener || "",
    ice: current.ice || "",
    upgrades: Array.isArray(current.upgrades) ? [...current.upgrades] : [],

    // shared
    extras: Array.isArray(current.extras) ? [...current.extras] : [],
    notes: current.notes || "",
  };

  editOpen.value = true;
}

function closeEdit() {
  editOpen.value = false;
  editingIndex.value = -1;
}

/** Calculate new priceEach based on base + extras (keeps qty separate) */
const editedPriceEach = computed(() => {
  const item = editingItem.value;
  if (!item) return 0;

  const base = item.basePrice ?? item.priceEach ?? 0;
  const opts = getOptionsFor(item);

  const extrasTotal = (opts.extras || [])
    .filter((e) => editDraft.value.extras.includes(e.name))
    .reduce((sum, e) => sum + e.price, 0);

  const upgradesTotal = (opts.upgrades || [])
    .filter((u) => editDraft.value.upgrades.includes(u.name))
    .reduce((sum, u) => sum + u.price, 0);

  return base + extrasTotal + upgradesTotal;
});

/** Save changes back into the cart item */
function saveEdit() {
  const idx = editingIndex.value;
  if (idx < 0) return;

  const item = cart.value[idx];

  item.custom = {
    // sandwich/bagel
    bagel: editDraft.value.bagel,
    shmear: editDraft.value.shmear,
    toasted: editDraft.value.toasted,
    sliced: editDraft.value.sliced,

    // drink
    milk: editDraft.value.milk,
    sweetener: editDraft.value.sweetener,
    ice: editDraft.value.ice,
    upgrades: [...editDraft.value.upgrades],

    // shared
    extras: [...editDraft.value.extras],
    notes: editDraft.value.notes,
  };

  item.basePrice = item.basePrice ?? item.priceEach ?? 0;
  item.priceEach = editedPriceEach.value;

  closeEdit();
}
</script>

<style scoped>
:root {
  --cream: #f6f0e8;
  --cream2: #fbf8f3;
  --brown: #4b3429;
  --brown2: #6a4a3a;
  --yellow: #f4b316;
  --cardShadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}
.addPaymentBtn {
  width: 100%;
  margin-top: 12px;
  padding: 14px;
  border-radius: 14px;
  border: none;

  background: #1a73e8; /* clean blue */
  color: #ffffff;

  font-weight: 900;
  font-size: 15px;
  cursor: pointer;

  box-shadow: 0 6px 16px rgba(26, 115, 232, 0.35);
  transition: transform 0.08s ease, box-shadow 0.08s ease, background 0.08s ease;
}

.addPaymentBtn:hover {
  background: #1558b0;
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(26, 115, 232, 0.45);
}

.addPaymentBtn:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(26, 115, 232, 0.35);
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

/* Main */
.main {
  padding: 20px 26px 50px;
}
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}
.title {
  margin: 0;
  font-size: 44px;
  letter-spacing: 2px;
  font-weight: 900;
}
.cartBtn {
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: #fff;
  border-radius: 14px;
  padding: 10px 14px;
  cursor: pointer;
  box-shadow: var(--cardShadow);
  font-weight: 900;
}

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
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.18);
  padding: 18px 16px;
  display: grid;
  gap: 12px;
  justify-items: center;
}

.verifyText {
  font-weight: 900;
  opacity: 0.9;
}

/* spinner */
.spinner {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 4px solid rgba(0, 0, 0, 0.12);
  border-top-color: rgba(26, 115, 232, 0.95);
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

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

.layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 18px;
  align-items: start;
}

.card {
  background: #fff;
  border-radius: 18px;
  border: 1px solid rgba(75, 52, 41, 0.14);
  box-shadow: var(--cardShadow);
  padding: 14px;
}

.cardHeader {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  border-bottom: 1px solid rgba(75, 52, 41, 0.12);
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.muted {
  opacity: 0.7;
  font-weight: 800;
}
.empty {
  padding: 12px 2px;
  opacity: 0.85;
  font-weight: 800;
}

.cartList {
  display: grid;
  gap: 12px;
}

.cartRow {
  display: grid;
  grid-template-columns: 90px 90px 1fr 140px;
  gap: 12px;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid rgba(75, 52, 41, 0.12);
  background: rgba(75, 52, 41, 0.03);
  align-items: center;
}

.qtyCol {
  display: flex;
  align-items: center;
  gap: 10px;
}
.qtyBtn {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: #fff;
  cursor: pointer;
  font-weight: 1000;
}
.qtyNum {
  font-weight: 1000;
  width: 18px;
  text-align: center;
}

.paySummary {
  margin-top: 12px;
  padding: 14px;
  border-radius: 16px;
  border: 1px solid rgba(75, 52, 41, 0.12);
  background: rgba(75, 52, 41, 0.03);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
}

.payTitle {
  font-weight: 1000;
  font-size: 14px;
  margin-bottom: 8px;
}

.payLine {
  font-weight: 900;
  font-size: 13px;
  line-height: 1.35;
  opacity: 0.92;
  margin-bottom: 8px;
}

.thumb {
  width: 72px;
  height: 72px;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: #fff;
  display: grid;
  place-items: center;
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.thumbFallback {
  font-weight: 1000;
  opacity: 0.6;
}

.rowTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.name {
  font-weight: 1000;
  font-size: 18px;
}
.subText {
  opacity: 0.8;
  font-weight: 800;
  margin-top: 4px;
}

.linkBtn {
  border: none;
  background: transparent;
  cursor: pointer;
  text-decoration: underline;
  font-weight: 900;
  color: var(--brown2);
}

.removeBtn {
  margin-top: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 900;
  color: var(--brown2);
  opacity: 0.9;
}

.totalCol {
  text-align: right;
}
.priceEach {
  opacity: 0.75;
  font-weight: 900;
}
.lineTotal {
  font-weight: 1000;
  font-size: 18px;
  margin-top: 6px;
}

.summary h2 {
  margin-top: 0;
}
.sumRow {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(75, 52, 41, 0.12);
  font-weight: 900;
}
.sumRow.total {
  border-bottom: none;
  padding-top: 14px;
  font-size: 18px;
}

.taxBreakdown {
  margin-top: 6px;
  line-height: 1.3;
  opacity: 0.8;
  font-size: 0.85rem;
  padding-left: 2px;
}

.confirmRow {
  display: flex;
  gap: 10px;
  align-items: center;
  font-weight: 900;
  margin: 14px 0;
}

.primaryBtn {
  width: 100%;
  margin-top: 12px;
  padding: 14px;
  border-radius: 14px;
  border: none;

  background: linear-gradient(180deg, #f4b316, #e89f00);
  color: #2c1b12;

  font-weight: 1000;
  font-size: 15px;
  cursor: pointer;

  box-shadow: 0 6px 16px rgba(244, 179, 22, 0.35);
  transition: transform 0.08s ease, box-shadow 0.08s ease, filter 0.08s ease;
}

.primaryBtn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(244, 179, 22, 0.45);
  filter: brightness(0.98);
}

.primaryBtn:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(244, 179, 22, 0.35);
}

.primaryBtn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

/* Modal */
.modalOverlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 60;
  display: grid;
  place-items: center;
  padding: 18px;
}

.modal {
  width: min(520px, 96vw);
  background: #fff;
  border-radius: 18px;
  border: 1px solid rgba(75, 52, 41, 0.14);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
  overflow: hidden;
}
.modalHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(75, 52, 41, 0.12);
}
.xBtn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  opacity: 0.8;
}
.modalBody {
  padding: 14px;
}
.modalTitle {
  font-weight: 1000;
  font-size: 18px;
  margin-bottom: 10px;
}

.fieldLabel {
  display: block;
  font-weight: 900;
  margin: 10px 0 6px;
}
.select,
.textarea {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(75, 52, 41, 0.18);
  padding: 10px;
  font: inherit;
  outline: none;
}
.extras {
  display: grid;
  gap: 8px;
  margin-top: 6px;
}
.checkLine {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(75, 52, 41, 0.12);
  background: rgba(75, 52, 41, 0.03);
  font-weight: 900;
}
.payRow {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.payLogoBox {
  width: 48px;
  height: 34px;
  border-radius: 8px;
  background: #ffffff;
  display: grid;
  place-items: center;
  overflow: hidden;
}

.payLogo {
  max-width: 80%;
  max-height: 80%;
  object-fit: contain;
}

.payInfo {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.payBrand {
  font-weight: 1000;
  font-size: 14px;
}

.payNumber {
  font-weight: 900;
  font-size: 13px;
  opacity: 0.85;
}

/* your responsive styles kept */
@media (max-width: 980px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 720px) {
  .page {
    grid-template-columns: 1fr;
  }
  .main {
    padding: 14px 14px 44px;
  }
  .layout {
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .cartRow {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 14px;
    border-radius: 18px;
    background: rgba(75, 52, 41, 0.035);
  }
  .qtyBtn {
    width: 40px;
    height: 40px;
    border-radius: 14px;
    font-size: 18px;
  }
  .qtyNum {
    width: 22px;
    font-size: 16px;
  }
  .thumb {
    width: 86px;
    height: 86px;
    border-radius: 18px;
  }
  .lineTotal {
    font-size: 18px;
  }
  .priceEach {
    display: none;
  }
}
</style>