<template>
  <div class="page">
    <!-- Left Sidebar -->
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
        <h1 class="title">PAYMENT</h1>

        <button class="cartBtn" type="button" @click="goBackToCheckout">
          ← Back to Checkout
        </button>
      </header>

      <div class="layout">
        <section class="card">
          <div class="cardHeader">
            <h2>Enter your card information</h2>
            <span class="muted">Fake cards are allowed — format rules still apply</span>
          </div>

          <!-- Saved card preview -->
          <div v-if="cards.length" class="savedBox">
            <div class="savedTitle">Saved payment method</div>

            <div class="savedCard">
              <div class="brandPill">{{ cards[0].brandLabel }}</div>
              <div class="savedLine">
                <b>{{ cards[0].masked }}</b>
                <span class="dot">•</span>
                <span>Exp {{ cards[0].exp }}</span>
                <span class="dot">•</span>
                <span>{{ cards[0].nameOnCard }}</span>
              </div>
              <div class="savedSub">This will show on Checkout.</div>
            </div>
          </div>

          <form class="form" @submit.prevent="saveCard">
            <!-- Card Number -->
            <label class="fieldLabel">Credit/Debit Card Number</label>
            <div class="inputWrap">
              <input
                class="input"
                inputmode="numeric"
                autocomplete="cc-number"
                placeholder="Card number"
                v-model="cardNumber"
                @input="onCardNumberInput"
                :aria-invalid="!!errors.cardNumber"
              />

              <!-- watermark logos inside the box -->
              <div class="watermarks" aria-hidden="true">
                <span class="wm visa">VISA</span>
                <span class="wm mc">mastercard</span>
                <span class="wm amex">AMEX</span>
                <span class="wm disc">DISCOVER</span>
                <span class="wm apple"> Pay</span>
              </div>
            </div>
            <p v-if="errors.cardNumber" class="err">{{ errors.cardNumber }}</p>

            <!-- Exp + CVV -->
            <div class="row2">
              <div>
                <label class="fieldLabel">Expiration (MM/YY)</label>
                <input
                  class="input"
                  inputmode="numeric"
                  autocomplete="cc-exp"
                  placeholder="MM/YY"
                  v-model="exp"
                  @input="onExpInput"
                  :aria-invalid="!!errors.exp"
                />
                <p v-if="errors.exp" class="err">{{ errors.exp }}</p>
              </div>

              <div>
                <label class="fieldLabel">CVV</label>
                <div class="cvvWrap">
                  <input
                    class="input"
                    inputmode="numeric"
                    autocomplete="cc-csc"
                    placeholder="CVV"
                    v-model="cvv"
                    @input="onCvvInput"
                    :aria-invalid="!!errors.cvv"
                  />
                  <span class="hint">?</span>
                </div>
                <p v-if="errors.cvv" class="err">{{ errors.cvv }}</p>
              </div>
            </div>

            <!-- Name -->
            <label class="fieldLabel">Name on card</label>
            <input
              class="input"
              autocomplete="cc-name"
              placeholder="Full name"
              v-model="nameOnCard"
              :aria-invalid="!!errors.nameOnCard"
            />
            <p v-if="errors.nameOnCard" class="err">{{ errors.nameOnCard }}</p>

            <hr class="divider" />

            <div class="sectionTitle">Billing Address</div>

            <label class="checkLine">
              <input type="checkbox" v-model="useShipping" />
              <span>Use my shipping address (demo)</span>
            </label>

            <label class="fieldLabel">Country/Region</label>
            <select class="input" v-model="country">
              <option>United States</option>
              <option>Canada</option>
              <option>Nepal</option>
              <option>Other</option>
            </select>

            <div class="row2">
              <div>
                <label class="fieldLabel">First Name</label>
                <input class="input" placeholder="First Name" v-model="firstName" />
              </div>
              <div>
                <label class="fieldLabel">Last Name</label>
                <input class="input" placeholder="Last Name" v-model="lastName" />
              </div>
            </div>

            <label class="fieldLabel">Street Address</label>
            <input class="input" placeholder="Street Address" v-model="street" />

            <label class="fieldLabel">Apartment, Suite, Building (Optional)</label>
            <input class="input" placeholder="Apartment, Suite, Building (Optional)" v-model="apt" />

            <div class="row2">
              <div>
                <label class="fieldLabel">Zip Code</label>
                <input
                  class="input"
                  inputmode="numeric"
                  placeholder="Zip Code"
                  v-model="zip"
                />
              </div>
              <div>
                <label class="fieldLabel">City, State</label>
                <input class="input" placeholder="City, State" v-model="cityState" />
              </div>
            </div>

            <p v-if="formMsg" class="formMsg" :class="{ ok: formMsgType === 'ok', bad: formMsgType === 'bad' }">
              {{ formMsg }}
            </p>

            <!-- Buttons -->
            <div class="btnStack">
              <button class="blueBtn" type="submit">
                {{ cards.length ? "Add another card" : "Save the card" }}
              </button>

              <button class="ghostBtn" type="button" @click="goBackToCheckout">
                Continue to checkout
              </button>
            </div>
          </form>
        </section>

      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";

/**
 * Shared state:
 * - cart uses useState("cart") in your checkout/index already
 * - cards is our saved payment method state (shared across pages)
 */
const cards = useState("cards", () => []);

/** Form fields */
const cardNumber = ref("");
const exp = ref("");
const cvv = ref("");
const nameOnCard = ref("");

const useShipping = ref(false);
const country = ref("United States");
const firstName = ref("");
const lastName = ref("");
const street = ref("");
const apt = ref("");
const zip = ref("");
const cityState = ref("");

const errors = reactive({
  cardNumber: "",
  exp: "",
  cvv: "",
  nameOnCard: "",
});

const formMsg = ref("");
const formMsgType = ref("ok"); // ok | bad

function goBackToCheckout() {
  navigateTo("/checkout");
}

/**
 * Helpers: cleaning + formatting
 */
function onlyDigits(s) {
  return (s || "").replace(/\D/g, "");
}

function formatCardGroups(digits) {
  // simple grouping: 4-4-4-4... (Amex is 4-6-5 but we'll keep it simple)
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function onCardNumberInput() {
  const digits = onlyDigits(cardNumber.value);
  cardNumber.value = formatCardGroups(digits).trim();
  errors.cardNumber = "";
  formMsg.value = "";
}

function onExpInput() {
  const d = onlyDigits(exp.value).slice(0, 4); // MMYY
  if (d.length <= 2) exp.value = d;
  else exp.value = `${d.slice(0, 2)}/${d.slice(2)}`;
  errors.exp = "";
  formMsg.value = "";
}

function onCvvInput() {
  cvv.value = onlyDigits(cvv.value).slice(0, 4);
  errors.cvv = "";
  formMsg.value = "";
}

/**
 * Brand detection (prefix patterns)
 * This is format-based, not “real validation”.
 */
function detectBrand(digits) {
  if (!digits) return { brand: "unknown", brandLabel: "Unknown", validLengths: [16], cvvLen: [3], note: "Enter a card number to detect brand." };

  const n = digits;

  // Visa: starts 4, length 13/16/19
  if (n.startsWith("4")) {
    return { brand: "visa", brandLabel: "VISA", validLengths: [13, 16, 19], cvvLen: [3], note: "Visa starts with 4." };
  }

  // Amex: 34 or 37, length 15, CVV 4
  if (n.startsWith("34") || n.startsWith("37")) {
    return { brand: "amex", brandLabel: "AMEX", validLengths: [15], cvvLen: [4], note: "Amex usually has 15 digits and 4-digit CVV." };
  }

  // Mastercard: 51-55 or 2221-2720, length 16
  const first2 = parseInt(n.slice(0, 2) || "0", 10);
  const first4 = parseInt(n.slice(0, 4) || "0", 10);
  if ((first2 >= 51 && first2 <= 55) || (first4 >= 2221 && first4 <= 2720)) {
    return { brand: "mastercard", brandLabel: "Mastercard", validLengths: [16], cvvLen: [3], note: "Mastercard is 51–55 or 2221–2720." };
  }

  // Discover: 6011, 65, 644-649, 622126-622925, length 16
  const first3 = parseInt(n.slice(0, 3) || "0", 10);
  const first6 = parseInt(n.slice(0, 6) || "0", 10);
  if (
    n.startsWith("6011") ||
    n.startsWith("65") ||
    (first3 >= 644 && first3 <= 649) ||
    (first6 >= 622126 && first6 <= 622925)
  ) {
    return { brand: "discover", brandLabel: "Discover", validLengths: [16], cvvLen: [3], note: "Discover often starts 6011 / 65 / 644–649 / 622126–622925." };
  }

  // JCB: 3528-3589, length 16
  if (first4 >= 3528 && first4 <= 3589) {
    return { brand: "jcb", brandLabel: "JCB", validLengths: [16], cvvLen: [3], note: "JCB commonly starts 3528–3589." };
  }

  // Diners Club: 300-305, 36, 38-39, length 14
  if ((first3 >= 300 && first3 <= 305) || n.startsWith("36") || n.startsWith("38") || n.startsWith("39")) {
    return { brand: "diners", brandLabel: "Diners Club", validLengths: [14], cvvLen: [3], note: "Diners Club often has 14 digits." };
  }

  // UnionPay (simple): starts 62, length 16-19 (varies)
  if (n.startsWith("62")) {
    return { brand: "unionpay", brandLabel: "UnionPay", validLengths: [16, 17, 18, 19], cvvLen: [3], note: "UnionPay often starts 62 (length can vary)." };
  }

  return { brand: "unknown", brandLabel: "Unknown", validLengths: [16], cvvLen: [3], note: "Brand not recognized, using general rules." };
}

const detected = computed(() => {
  const digits = onlyDigits(cardNumber.value);
  return detectBrand(digits);
});

/**
 * Validation rules:
 * - Fake card allowed, but MUST match brand length + CVV length + expiry format.
 * - We do NOT run Luhn check (so any digits are ok if length/pattern ok).
 */
function validate() {
  // reset
  errors.cardNumber = "";
  errors.exp = "";
  errors.cvv = "";
  errors.nameOnCard = "";

  const digits = onlyDigits(cardNumber.value);
  const expRaw = exp.value.trim();
  const cvvDigits = onlyDigits(cvv.value);

  const brand = detectBrand(digits);

  // card number length checks
  if (!digits.length) {
    errors.cardNumber = "Card number is required.";
  } else if (!brand.validLengths.includes(digits.length)) {
    // special message for the user
    const allow = brand.validLengths.join(", ");
    errors.cardNumber = `${brand.brandLabel} card number must be ${allow} digits. You entered ${digits.length}.`;
  }

  // expiry MM/YY checks (format + reasonable month)
  if (!expRaw) {
    errors.exp = "Expiration is required.";
  } else {
    const m = expRaw.match(/^(\d{2})\/(\d{2})$/);
    if (!m) {
      errors.exp = "Expiration must be in MM/YY format.";
    } else {
      const mm = parseInt(m[1], 10);
      if (mm < 1 || mm > 12) errors.exp = "Month must be between 01 and 12.";
    }
  }

  // CVV checks
  if (!cvvDigits) {
    errors.cvv = "CVV is required.";
  } else if (!brand.cvvLen.includes(cvvDigits.length)) {
    const allow = brand.cvvLen.join(" or ");
    errors.cvv = `${brand.brandLabel} CVV must be ${allow} digits. You entered ${cvvDigits.length}.`;
  }

  // name checks
  if (!nameOnCard.value.trim()) {
    errors.nameOnCard = "Name on card is required.";
  }

  return !errors.cardNumber && !errors.exp && !errors.cvv && !errors.nameOnCard;
}

/**
 * Save behavior:
 * - Saves card into shared `cards` state.
 * - Stores masked number for display, but also keeps full digits (demo).
 * - After saving, button text becomes "Add another card" and we clear form.
 */
function saveCard() {
  formMsg.value = "";
  const ok = validate();

  if (!ok) {
    formMsgType.value = "bad";
    formMsg.value = "Fix the highlighted fields to save the card.";
    return;
  }

  const digits = onlyDigits(cardNumber.value);
  const brand = detectBrand(digits);

  const last4 = digits.slice(-4);
  const masked = `•••• •••• •••• ${last4}`;

  // Save as "primary" (index 0). You can expand to multi-card later.
  cards.value = [
    {
      brand: brand.brand,
      brandLabel: brand.brandLabel,
      masked,
      last4,
      fullDigits: digits, // demo only
      exp: exp.value.trim(),
      nameOnCard: nameOnCard.value.trim(),
      billing: {
        country: country.value,
        firstName: firstName.value,
        lastName: lastName.value,
        street: street.value,
        apt: apt.value,
        zip: zip.value,
        cityState: cityState.value,
        useShipping: useShipping.value,
      },
      savedAt: Date.now(),
    },
  ];

  formMsgType.value = "ok";
  formMsg.value = `Saved ${brand.brandLabel} ending in ${last4}.`;

  // Clear for "Add another card"
  cardNumber.value = "";
  exp.value = "";
  cvv.value = "";
  nameOnCard.value = "";
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
  grid-template-columns: 1fr 340px;
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
  display: grid;
  gap: 6px;
  border-bottom: 1px solid rgba(75, 52, 41, 0.12);
  padding-bottom: 10px;
  margin-bottom: 10px;
}
.cardHeader h2 {
  margin: 0;
}
.muted {
  opacity: 0.7;
  font-weight: 800;
}

.form {
  display: grid;
  gap: 10px;
}

.fieldLabel {
  display: block;
  font-weight: 900;
  margin-top: 6px;
}

.input {
  width: 100%;
  border-radius: 14px;
  border: 1px solid rgba(75, 52, 41, 0.18);
  padding: 14px;
  font: inherit;
  outline: none;
}

.input[aria-invalid="true"] {
  border-color: rgba(200, 30, 30, 0.55);
  box-shadow: 0 0 0 3px rgba(200, 30, 30, 0.12);
}

.err {
  margin: -4px 0 0;
  color: #b31b1b;
  font-weight: 900;
  font-size: 13px;
}

.row2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.divider {
  border: none;
  border-top: 1px solid rgba(75, 52, 41, 0.12);
  margin: 10px 0;
}

.sectionTitle {
  font-weight: 1000;
  margin-top: 2px;
}

.checkLine {
  display: flex;
  gap: 10px;
  align-items: center;
  font-weight: 900;
  opacity: 0.95;
}

.cvvWrap {
  position: relative;
}
.hint {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 1px solid rgba(75, 52, 41, 0.2);
  display: grid;
  place-items: center;
  font-weight: 1000;
  opacity: 0.6;
  pointer-events: none;
}

/* Watermark logos inside the card input */
.inputWrap {
  position: relative;
}
.watermarks {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 10px;
  align-items: center;
  opacity: 0.55; /* watermark vibe */
  pointer-events: none;
  user-select: none;
}
.wm {
  font-weight: 1000;
  font-size: 12px;
  letter-spacing: 0.4px;
  padding: 4px 6px;
  border-radius: 10px;
  border: 1px solid rgba(75, 52, 41, 0.12);
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(2px);
}
.wm.visa { color: #1a45b8; }
.wm.mc { color: #d35400; text-transform: lowercase; }
.wm.amex { color: #0b6b7a; }
.wm.disc { color: #b24b00; }
.wm.apple { color: #111; }

/* Saved box */
.savedBox {
  margin-bottom: 12px;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid rgba(75, 52, 41, 0.12);
  background: rgba(75, 52, 41, 0.03);
}
.savedTitle {
  font-weight: 1000;
  margin-bottom: 8px;
}
.savedCard {
  display: grid;
  gap: 6px;
}
.brandPill {
  width: fit-content;
  font-weight: 1000;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(75, 52, 41, 0.12);
  background: #fff;
}
.savedLine {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  font-weight: 900;
}
.dot { opacity: 0.5; }
.savedSub { opacity: 0.7; font-weight: 800; }

/* Messages */
.formMsg {
  margin: 6px 0 0;
  padding: 10px 12px;
  border-radius: 14px;
  font-weight: 900;
}
.formMsg.ok {
  background: rgba(0, 140, 70, 0.1);
  border: 1px solid rgba(0, 140, 70, 0.22);
  color: #0b5e32;
}
.formMsg.bad {
  background: rgba(200, 30, 30, 0.08);
  border: 1px solid rgba(200, 30, 30, 0.2);
  color: #8f1414;
}

/* Buttons */
.btnStack {
  margin-top: 10px;
  display: grid;
  gap: 10px;
}

.blueBtn {
  width: 100%;
  margin-top: 2px;
  padding: 14px;
  border-radius: 14px;
  border: none;
  background: #1a73e8;
  color: #fff;
  font-weight: 1000;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(26, 115, 232, 0.35);
  transition: transform 0.08s ease, box-shadow 0.08s ease, background 0.08s ease;
}
.blueBtn:hover {
  background: #1558b0;
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(26, 115, 232, 0.45);
}

.ghostBtn {
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: #fff;
  font-weight: 1000;
  cursor: pointer;
}

.tips h2 {
  margin-top: 0;
}
.bullets {
  margin: 0;
  padding-left: 18px;
  font-weight: 900;
  opacity: 0.85;
  display: grid;
  gap: 8px;
}

.miniCard {
  margin-top: 14px;
  border-radius: 16px;
  border: 1px solid rgba(75, 52, 41, 0.12);
  background: rgba(75, 52, 41, 0.03);
  padding: 12px;
}
.miniTitle { font-weight: 1000; }
.miniBrand { font-weight: 1000; font-size: 18px; margin-top: 6px; }
.miniSub { opacity: 0.75; font-weight: 800; margin-top: 4px; }

@media (max-width: 980px) {
  .layout { grid-template-columns: 1fr; }
}

@media (max-width: 720px) {
  .page { grid-template-columns: 1fr; }
  .sidebar { border-right: none; border-bottom: 1px solid rgba(75,52,41,0.12); }
  .row2 { grid-template-columns: 1fr; }
  .watermarks { display: none; } /* too tight on small screens */
}
</style>
