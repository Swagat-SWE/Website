<!-- app/pages/checkout.vue -->
<template>
  <div class="page">
    <!-- Left Sidebar (matches home) -->
    <aside class="sidebar">
      <div class="sidebarTop">
        <img src="/Logo.png" alt="Einstein Bros Logo" class="logoImg" />
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
                  <span v-if="item.custom">
                    <span v-if="item.custom.bagel"><b>{{ item.custom.bagel }}</b></span>
                    <span v-if="item.custom.shmear"> • {{ item.custom.shmear }}</span>
                    <span v-if="item.custom.extras?.length"> • Extras: {{ item.custom.extras.join(', ') }}</span>
                    <span v-if="item.custom.notes"> • “{{ item.custom.notes }}”</span>
                  </span>
                  <span v-else>No customizations</span>
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
            <span>Tax (8%)</span>
            <b>${{ tax.toFixed(2) }}</b>
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
             <div class="payLine">
              <b>{{ cards[0].brandLabel }}</b> • {{ cards[0].masked }} • Exp {{ cards[0].exp }}
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
            @click="navigateTo('/tracking')"
          >
            Order Now
          </button>
          </aside>
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

            <label class="fieldLabel">Bagel</label>
            <select v-model="editDraft.bagel" class="select">
              <option value="">Select a bagel…</option>
              <option v-for="b in getOptions(editingItem.name).bagels" :key="b" :value="b">
                {{ b }}
              </option>
            </select>

            <label class="fieldLabel">Shmear</label>
            <select v-model="editDraft.shmear" class="select">
              <option value="">No shmear</option>
              <option v-for="s in getOptions(editingItem.name).shmears" :key="s" :value="s">
                {{ s }}
              </option>
            </select>

            <label class="fieldLabel">Extras</label>
            <div class="extras">
              <label v-for="ex in getOptions(editingItem.name).extras" :key="ex.name" class="checkLine">
                <input type="checkbox" :value="ex.name" v-model="editDraft.extras" />
                <span>{{ ex.name }}</span>
                <b>+${{ ex.price.toFixed(2) }}</b>
              </label>
            </div>

            <label class="fieldLabel">Notes</label>
            <textarea v-model="editDraft.notes" class="textarea" rows="3" />

            <div class="modalFooter">
              <div class="modalTotal">
                Item total: <b>${{ editedPriceEach.toFixed(2) }}</b>
              </div>

              <button class="primaryBtn" type="button" @click="saveEdit">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

/** CART STATE (shared with index.vue) */
const cart = useState("cart", () => []);

/** ORDER TOTALS */
const cartCount = computed(() =>
  cart.value.reduce((sum, i) => sum + (i.qty || 1), 0)
);

const cards = useState("cards", () => []);
const hasPayment = computed(() => cards.value.length > 0);

function lineTotal(item) {
  return (item.priceEach ?? 0) * (item.qty || 1);
}

const subtotal = computed(() =>
  cart.value.reduce((sum, i) => sum + lineTotal(i), 0)
);

const taxRate = 0.08;
const tax = computed(() => subtotal.value * taxRate);
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
const OPTIONS_BY_NAME = {
  "Farm House Egg Sandwich": {
    bagels: ["Cheesy Hash", "Everything", "Plain", "Sesame", "Asiago"],
    shmears: ["Plain Shmear", "Country Pepper Shmear", "Roasted Tomato Spread", "Jalapeno salsa shmear"],
    extras: [
      { name: "Extra Cheese", price: 1.0 },
      { name: "Bacon", price: 1.5 },
      { name: "Avocado", price: 1.5 },
    ],
  },
  "All Nighter Egg Sandwich": {
    bagels: ["Cheesy Hash", "Everything", "Plain", "Sesame", "Asiago"],
    shmears: ["Plain Shmear", "Country Pepper Shmear", "Roasted Tomato Spread"],
    extras: [
      { name: "Extra Cheese", price: 1.0 },
      { name: "Bacon", price: 1.5 },
    ],
  },
  "Garden Avocado Egg Sandwich": {
    bagels: ["Everything", "Plain", "Sesame", "Asiago"],
    shmears: ["Plain Shmear", "Roasted Tomato Spread"],
    extras: [
      { name: "Avocado", price: 1.5 },
      { name: "Extra Cheese", price: 1.0 },
    ],
  },
};

function getOptions(name) {
  return OPTIONS_BY_NAME[name] || { bagels: ["Plain"], shmears: ["Plain Shmear"], extras: [] };
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

const editDraft = ref({
  bagel: "",
  shmear: "",
  extras: [],
  notes: "",
});

/** When opening edit, copy current custom values into the draft */
function openEdit(idx) {
  editingIndex.value = idx;

  const item = cart.value[idx];
  const current = item.custom || {};

  editDraft.value = {
    bagel: current.bagel || "",
    shmear: current.shmear || "",
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
  const opts = getOptions(item.name);

  const extrasTotal = opts.extras
    .filter((e) => editDraft.value.extras.includes(e.name))
    .reduce((sum, e) => sum + e.price, 0);

  return base + extrasTotal;
});

/** Save changes back into the cart item */
function saveEdit() {
  const idx = editingIndex.value;
  if (idx < 0) return;

  const item = cart.value[idx];

  item.custom = {
    bagel: editDraft.value.bagel,
    shmear: editDraft.value.shmear,
    extras: [...editDraft.value.extras],
    notes: editDraft.value.notes,
  };

  // keep base price stored once; update priceEach to include extras
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
  border-bottom: 1px solid rgba(75,52,41,0.12);
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.muted { opacity: 0.7; font-weight: 800; }
.empty { padding: 12px 2px; opacity: 0.85; font-weight: 800; }

.cartList { display: grid; gap: 12px; }

.cartRow {
  display: grid;
  grid-template-columns: 90px 90px 1fr 140px;
  gap: 12px;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid rgba(75,52,41,0.12);
  background: rgba(75,52,41,0.03);
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
  border: 1px solid rgba(75,52,41,0.14);
  background: #fff;
  cursor: pointer;
  font-weight: 1000;
}
.qtyNum { font-weight: 1000; width: 18px; text-align: center; }

.paySummary {
  margin-top: 12px;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid rgba(75, 52, 41, 0.12);
  background: rgba(75, 52, 41, 0.03);
}

.payTitle {
  font-weight: 1000;
  margin-bottom: 6px;
}

.payLine {
  font-weight: 900;
  opacity: 0.9;
  margin-bottom: 6px;
}

.thumb {
  width: 72px;
  height: 72px;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(75,52,41,0.14);
  background: #fff;
  display: grid;
  place-items: center;
}
.thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.thumbFallback { font-weight: 1000; opacity: 0.6; }

.rowTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.name { font-weight: 1000; font-size: 18px; }
.subText { opacity: 0.8; font-weight: 800; margin-top: 4px; }

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
.priceEach { opacity: 0.75; font-weight: 900; }
.lineTotal { font-weight: 1000; font-size: 18px; margin-top: 6px; }

.summary h2 { margin-top: 0; }
.sumRow {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(75,52,41,0.12);
  font-weight: 900;
}
.sumRow.total { border-bottom: none; padding-top: 14px; font-size: 18px; }

.confirmRow {
  display: flex;
  gap: 10px;
  align-items: center;
  font-weight: 900;
  margin: 14px 0;
}

.primaryBtn {
  width: 100%;
  margin-top: 12px;            /* makes it match Add Payment spacing */
  padding: 14px;               /* same size as Add Payment Method */
  border-radius: 14px;
  border: none;

  /* Einstein-style "order" vibe (gold/yellow) */
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
  background: rgba(0,0,0,0.35);
  z-index: 60;
  display: grid;
  place-items: center;
  padding: 18px;
}
.modal {
  width: min(520px, 96vw);
  background: #fff;
  border-radius: 18px;
  border: 1px solid rgba(75,52,41,0.14);
  box-shadow: 0 20px 60px rgba(0,0,0,0.18);
  overflow: hidden;
}
.modalHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(75,52,41,0.12);
}
.xBtn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  opacity: 0.8;
}
.modalBody { padding: 14px; }
.modalTitle { font-weight: 1000; font-size: 18px; margin-bottom: 10px; }

.fieldLabel { display: block; font-weight: 900; margin: 10px 0 6px; }
.select, .textarea {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(75,52,41,0.18);
  padding: 10px;
  font: inherit;
  outline: none;
}
.extras { display: grid; gap: 8px; margin-top: 6px; }
.checkLine {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(75,52,41,0.12);
  background: rgba(75,52,41,0.03);
  font-weight: 900;
}
.modalFooter {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.modalTotal { font-weight: 1000; }

@media (max-width: 980px) {
  .layout { grid-template-columns: 1fr; }
}
@media (max-width: 720px) {
  .page { grid-template-columns: 1fr; }
  .sidebar { border-right: none; border-bottom: 1px solid rgba(75,52,41,0.12); }
  .cartRow { grid-template-columns: 1fr; text-align: left; }
  .totalCol { text-align: left; }
}
</style>
