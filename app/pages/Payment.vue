<template>
  <div class="page">
    <!-- Sidebar (kept, but “quiet” during payment) -->
    <aside class="sidebar">
      <div class="sidebarTop">
        <img src="/Logo.png" alt="Einstein Bros Logo" class="logoImg" />
      </div>

      <nav class="nav" aria-label="Primary">
        <NuxtLink class="navItem" to="/">Main Page</NuxtLink>
        <NuxtLink class="navItem" to="/food">Food Menu</NuxtLink>
        <NuxtLink class="navItem" to="/drinks">Drinks Menu</NuxtLink>
        <NuxtLink class="navItem" to="/contact">Contact</NuxtLink>
      </nav>

      <div class="sidebarHint">
        <div class="lockRow" aria-hidden="true">
          <span class="lockDot"></span>
          <span>Secure checkout</span>
        </div>
      </div>
    </aside>

    <!-- Main -->
    <main class="main">
      <header class="topbar">
        <div class="topbarLeft">
          <div class="kicker">Checkout</div>
          <h1 class="title">Payment</h1>
          <div class="subtle">Enter your payment details to complete your order.</div>
        </div>

        <button class="backBtn" type="button" @click="goBackToCheckout">
          <span class="backIcon">←</span>
          <span>Back to Checkout</span>
        </button>
      </header>

      <div class="shell">
        <!-- Left: form card -->
        <section class="panel" aria-labelledby="paymentHeading">
          <div class="panelTop">
            <div>
              <h2 id="paymentHeading" class="panelTitle">Card details</h2>
            </div>

            <div class="badgeRow" aria-hidden="true">
              <span class="chip">VISA</span>
              <span class="chip">Mastercard</span>
              <span class="chip">AMEX</span>
              <span class="chip">Discover</span>
              <span class="chip"> Pay</span>
            </div>
          </div>

          <!-- Saved payment (premium “wallet” card) -->
          <div v-if="cards.length" class="wallet">
            <div class="walletTop">
              <div class="walletTitle">Saved payment method</div>
              <div class="walletPill">{{ cards[0].brandLabel }}</div>
            </div>

            <div class="walletBody">
              <div class="walletNumber">{{ cards[0].masked }}</div>
              <div class="walletMeta">
                <span>Exp {{ cards[0].exp }}</span>
                <span class="sep">•</span>
                <span>{{ cards[0].nameOnCard }}</span>
              </div>
            </div>

            <div class="walletFine">This will show on Checkout.</div>
          </div>

          <form class="form" @submit.prevent="saveCard" novalidate>
            <!-- Card preview (Apple/Shopify vibe) -->
            <div class="cardPreview" :data-brand="detected.brand">
              <div class="cardPreviewTop">
                <div class="miniChip" aria-hidden="true"></div>
                <div class="brandMark">
                  <span class="brandText">{{ detected.brandLabel }}</span>
                </div>
              </div>

              <div class="cardPreviewNum">
                {{ previewNumber }}
              </div>

              <div class="cardPreviewBottom">
                <div class="pvCol">
                  <div class="pvLabel">Name</div>
                  <div class="pvValue">{{ previewName }}</div>
                </div>
                <div class="pvCol right">
                  <div class="pvLabel">Expiry</div>
                  <div class="pvValue">{{ previewExp }}</div>
                </div>
              </div>
            </div>

            <!-- Card number -->
            <div class="field">
              <label class="label" for="cc-number">Card number</label>
              <div class="control">
                <input
                  id="cc-number"
                  class="input"
                  inputmode="numeric"
                  autocomplete="cc-number"
                  placeholder="1234 5678 9012 3456"
                  v-model="cardNumber"
                  @input="onCardNumberInput"
                  :aria-invalid="!!errors.cardNumber"
                  :aria-describedby="errors.cardNumber ? 'err-number' : 'help-number'"
                />
                <div class="rightAffix" aria-hidden="true">
                  <span class="brandPill" :data-brand="detected.brand">{{ detected.brandLabel }}</span>
                </div>
              </div>

              <p v-if="errors.cardNumber" id="err-number" class="err">{{ errors.cardNumber }}</p>
              <p v-else id="help-number" class="help">{{ detected.note }}</p>
            </div>

            <!-- Expiry + CVV -->
            <div class="grid2">
              <div class="field">
                <label class="label" for="cc-exp">Expiration</label>
                <div class="control">
                  <input
                    id="cc-exp"
                    class="input"
                    inputmode="numeric"
                    autocomplete="cc-exp"
                    placeholder="MM/YY"
                    v-model="exp"
                    @input="onExpInput"
                    :aria-invalid="!!errors.exp"
                    :aria-describedby="errors.exp ? 'err-exp' : undefined"
                  />
                </div>
                <p v-if="errors.exp" id="err-exp" class="err">{{ errors.exp }}</p>
              </div>

              <div class="field">
                <label class="label" for="cc-cvv">
                  CVV
                  <button
                    class="hintBtn"
                    type="button"
                    @click="showCvvHelp = !showCvvHelp"
                    :aria-expanded="showCvvHelp ? 'true' : 'false'"
                    aria-controls="cvvHelp"
                  >
                    ?
                  </button>
                </label>

                <div class="control">
                  <input
                    id="cc-cvv"
                    class="input"
                    inputmode="numeric"
                    autocomplete="cc-csc"
                    :placeholder="detected.brand === 'amex' ? '4 digits' : '3 digits'"
                    v-model="cvv"
                    @input="onCvvInput"
                    :aria-invalid="!!errors.cvv"
                    :aria-describedby="errors.cvv ? 'err-cvv' : (showCvvHelp ? 'cvvHelp' : undefined)"
                  />
                </div>

                <p v-if="errors.cvv" id="err-cvv" class="err">{{ errors.cvv }}</p>
                <p v-else-if="showCvvHelp" id="cvvHelp" class="help">
                  CVV is the security code on your card (usually 3 digits, AMEX uses 4).
                </p>
              </div>
            </div>

            <!-- Name -->
            <div class="field">
              <label class="label" for="cc-name">Name on card</label>
              <div class="control">
                <input
                  id="cc-name"
                  class="input"
                  autocomplete="cc-name"
                  placeholder="Full name"
                  v-model="nameOnCard"
                  :aria-invalid="!!errors.nameOnCard"
                  :aria-describedby="errors.nameOnCard ? 'err-name' : undefined"
                />
              </div>
              <p v-if="errors.nameOnCard" id="err-name" class="err">{{ errors.nameOnCard }}</p>
            </div>

            <!-- Billing (Shopify-style collapsible) -->
            <div class="accordion">
              <button class="accordionHead" type="button" @click="billingOpen = !billingOpen" :aria-expanded="billingOpen ? 'true' : 'false'">
                <div class="accLeft">
                  <div class="accTitle">Billing address</div>
                  <div class="accSub">Used for verification and receipts.</div>
                </div>
                <div class="accRight">
                  <span class="accPill" v-if="useShipping">Using shipping address</span>
                  <span class="chev" :class="{ open: billingOpen }">⌄</span>
                </div>
              </button>

              <div class="accordionBody" v-show="billingOpen">
                <label class="checkLine">
                  <input type="checkbox" v-model="useShipping" />
                  <span>Use my shipping address (demo)</span>
                </label>

                <div class="field">
                  <label class="label" for="country">Country/Region</label>
                  <div class="control">
                    <select id="country" class="input" v-model="country">
                      <option>United States</option>
                      <option>Canada</option>
                      <option>Nepal</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div class="grid2">
                  <div class="field">
                    <label class="label" for="firstName">First name</label>
                    <div class="control">
                      <input id="firstName" class="input" placeholder="First name" v-model="firstName" />
                    </div>
                  </div>
                  <div class="field">
                    <label class="label" for="lastName">Last name</label>
                    <div class="control">
                      <input id="lastName" class="input" placeholder="Last name" v-model="lastName" />
                    </div>
                  </div>
                </div>

                <div class="field">
                  <label class="label" for="street">Street address</label>
                  <div class="control">
                    <input id="street" class="input" placeholder="Street address" v-model="street" />
                  </div>
                </div>

                <div class="field">
                  <label class="label" for="apt">Apartment / Suite (optional)</label>
                  <div class="control">
                    <input id="apt" class="input" placeholder="Apartment, suite, building" v-model="apt" />
                  </div>
                </div>

                <div class="grid2">
                  <div class="field">
                    <label class="label" for="zip">ZIP code</label>
                    <div class="control">
                      <input id="zip" class="input" inputmode="numeric" placeholder="ZIP" v-model="zip" />
                    </div>
                  </div>
                  <div class="field">
                    <label class="label" for="cityState">City / State</label>
                    <div class="control">
                      <input id="cityState" class="input" placeholder="City, State" v-model="cityState" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Status message -->
            <p
              v-if="formMsg"
              class="toast"
              :class="{ ok: formMsgType === 'ok', bad: formMsgType === 'bad' }"
              role="status"
              aria-live="polite"
            >
              {{ formMsg }}
            </p>

            <!-- Actions -->
            <div class="actions">
              <button class="primaryBtn" type="submit">
                <span>{{ cards.length ? "Add another card" : "Save card" }}</span>
                <span class="btnArrow" aria-hidden="true">→</span>
              </button>

              <button class="secondaryBtn" type="button" @click="goBackToCheckout">
                Continue to checkout
              </button>

              <div class="trustRow" aria-hidden="true">
                <span class="trustDot"></span>
                <span>Secure • Encrypted • Protected</span>
              </div>
            </div>
          </form>
        </section>

        <!-- Right: summary card (premium + sticky) -->
        <aside class="summary" aria-label="Order summary">
          <div class="summaryCard">
            <div class="sumTop">
              <div class="sumTitle">Order summary</div>
              <div class="sumSub">Quick preview</div>
            </div>

            <div class="sumRow">
              <span>Payment method</span>
              <span class="sumValue">
                {{ cards.length ? `${cards[0].brandLabel} •••• ${cards[0].last4}` : "Not saved yet" }}
              </span>
            </div>

            <div class="sumRow">
              <span>Billing</span>
              <span class="sumValue">
                {{ country }}
              </span>
            </div>

            <div class="sumDivider"></div>

            <div class="sumFine">
              You’ll confirm the final order on the checkout page.
            </div>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";

/**
 * Shared state:
 * - cards is saved payment method state (shared across pages)
 */
const cards = useState("cards", () => []);

/** UI state */
const billingOpen = ref(true);
const showCvvHelp = ref(false);

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
  // basic grouping: 4-4-4-4...
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
 */
function detectBrand(digits) {
  if (!digits) {
    return {
      brand: "unknown",
      brandLabel: "Card",
      validLengths: [16],
      cvvLen: [3],
      note: "We’ll detect the card type automatically.",
    };
  }

  const n = digits;

  if (n.startsWith("4")) {
    return { brand: "visa", brandLabel: "VISA", validLengths: [13, 16, 19], cvvLen: [3], note: "Visa starts with 4." };
  }

  if (n.startsWith("34") || n.startsWith("37")) {
    return { brand: "amex", brandLabel: "AMEX", validLengths: [15], cvvLen: [4], note: "AMEX uses 15 digits and a 4-digit CVV." };
  }

  const first2 = parseInt(n.slice(0, 2) || "0", 10);
  const first4 = parseInt(n.slice(0, 4) || "0", 10);

  if ((first2 >= 51 && first2 <= 55) || (first4 >= 2221 && first4 <= 2720)) {
    return { brand: "mastercard", brandLabel: "Mastercard", validLengths: [16], cvvLen: [3], note: "Mastercard is 51–55 or 2221–2720." };
  }

  const first3 = parseInt(n.slice(0, 3) || "0", 10);
  const first6 = parseInt(n.slice(0, 6) || "0", 10);

  if (
    n.startsWith("6011") ||
    n.startsWith("65") ||
    (first3 >= 644 && first3 <= 649) ||
    (first6 >= 622126 && first6 <= 622925)
  ) {
    return { brand: "discover", brandLabel: "Discover", validLengths: [16], cvvLen: [3], note: "Discover often starts 6011 / 65 / 644–649." };
  }

  if (first4 >= 3528 && first4 <= 3589) {
    return { brand: "jcb", brandLabel: "JCB", validLengths: [16], cvvLen: [3], note: "JCB commonly starts 3528–3589." };
  }

  if ((first3 >= 300 && first3 <= 305) || n.startsWith("36") || n.startsWith("38") || n.startsWith("39")) {
    return { brand: "diners", brandLabel: "Diners", validLengths: [14], cvvLen: [3], note: "Diners Club often has 14 digits." };
  }

  if (n.startsWith("62")) {
    return { brand: "unionpay", brandLabel: "UnionPay", validLengths: [16, 17, 18, 19], cvvLen: [3], note: "UnionPay can vary in length." };
  }

  return { brand: "unknown", brandLabel: "Card", validLengths: [16], cvvLen: [3], note: "We’ll validate format before saving." };
}

const detected = computed(() => detectBrand(onlyDigits(cardNumber.value)));

/** Premium preview helpers */
const previewNumber = computed(() => {
  const digits = onlyDigits(cardNumber.value);
  if (!digits) return "•••• •••• •••• ••••";
  const grouped = formatCardGroups(digits).trim();
  // pad the preview a bit so it doesn’t “shrink” while typing
  return (grouped + " •••• •••• ••••").slice(0, 19);
});
const previewExp = computed(() => (exp.value?.trim() ? exp.value.trim() : "MM/YY"));
const previewName = computed(() => (nameOnCard.value?.trim() ? nameOnCard.value.trim() : "FULL NAME"));

/**
 * Validation rules:
 * - Fake card allowed, but MUST match brand length + CVV length + expiry format.
 * - We do NOT run Luhn check (demo behavior).
 */
function validate() {
  errors.cardNumber = "";
  errors.exp = "";
  errors.cvv = "";
  errors.nameOnCard = "";

  const digits = onlyDigits(cardNumber.value);
  const expRaw = exp.value.trim();
  const cvvDigits = onlyDigits(cvv.value);

  const brand = detectBrand(digits);

  if (!digits.length) {
    errors.cardNumber = "Card number is required.";
  } else if (!brand.validLengths.includes(digits.length)) {
    const allow = brand.validLengths.join(", ");
    errors.cardNumber = `${brand.brandLabel} card number must be ${allow} digits. You entered ${digits.length}.`;
  }

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

  if (!cvvDigits) {
    errors.cvv = "CVV is required.";
  } else if (!brand.cvvLen.includes(cvvDigits.length)) {
    const allow = brand.cvvLen.join(" or ");
    errors.cvv = `${brand.brandLabel} CVV must be ${allow} digits. You entered ${cvvDigits.length}.`;
  }

  if (!nameOnCard.value.trim()) {
    errors.nameOnCard = "Name on card is required.";
  }

  return !errors.cardNumber && !errors.exp && !errors.cvv && !errors.nameOnCard;
}

/**
 * Save behavior:
 * - Saves card into shared `cards` state.
 * - Stores masked number for display, but also keeps full digits (demo).
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

  cards.value = [
    {
      brand: brand.brand,
      brandLabel: brand.brandLabel,
      masked,
      last4,
      fullDigits: digits, // demo only (do not store in real systems)
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

  // Clear for “Add another card”
  cardNumber.value = "";
  exp.value = "";
  cvv.value = "";
  nameOnCard.value = "";
}
</script>

<style scoped>
/* =========================
   Premium Apple/Shopify vibe
   ========================= */

.page {
  /* ---- scoped-safe variables ---- */
  --bg0: #f6f7fb;
  --bg1: #eef2ff;
  --ink: #0f172a;
  --muted: rgba(15, 23, 42, 0.65);
  --line: rgba(15, 23, 42, 0.10);
  --card: rgba(255, 255, 255, 0.78);
  --shadow: 0 22px 70px rgba(2, 6, 23, 0.10);
  --shadow2: 0 10px 26px rgba(2, 6, 23, 0.08);
  --radius: 18px;

  --focus: rgba(10, 132, 255, 0.30);
  --appleBlue: #0a84ff;
  --appleBlueHover: #0071e3;

  --checkoutBg: #111827;
  --checkoutHover: #0b1220;

  /* ---- IMPORTANT: restore layout ---- */
  min-height: 100vh;
  width: 100%;
  display: grid;
  grid-template-columns: 260px 1fr;

  background:
    radial-gradient(1200px 800px at 20% -10%, rgba(99, 102, 241, 0.22), transparent 60%),
    radial-gradient(900px 700px at 90% 10%, rgba(16, 185, 129, 0.12), transparent 55%),
    linear-gradient(180deg, var(--bg1), var(--bg0));

  color: var(--ink);
}



/* Sidebar */
.sidebar {
  border-right: 1px solid var(--line);
  padding: 18px 14px;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(12px);
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
  filter: drop-shadow(0 10px 18px rgba(2, 6, 23, 0.10));
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.navItem {
  text-decoration: none;
  color: var(--ink);
  font-size: 14px;
  font-weight: 800;
  border-radius: 14px;
  padding: 12px 12px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  box-shadow: 0 1px 0 rgba(2, 6, 23, 0.04);
  transition: transform 0.10s ease, box-shadow 0.10s ease, border 0.10s ease;
}

.navItem:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow2);
  border-color: rgba(99, 102, 241, 0.25);
}

.sidebarHint {
  margin-top: 14px;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.55);
}

.lockRow {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 900;
  font-size: 13px;
}

.lockDot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(135deg, #22c55e, #60a5fa);
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.12);
}

.sidebarFine {
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 1.4;
  color: var(--muted);
  font-weight: 700;
}

/* Main */
.main {
  padding: 22px 26px 60px;
}

.topbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.kicker {
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(79, 70, 229, 0.9);
}

.title {
  margin: 4px 0 2px;
  font-size: clamp(28px, 3vw, 42px);
  letter-spacing: -0.02em;
  font-weight: 950;
}

.subtle {
  color: var(--muted);
  font-weight: 700;
  font-size: 14px;
}

.backBtn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  border-radius: 14px;
  padding: 10px 12px;
  cursor: pointer;
  font-weight: 900;
  box-shadow: 0 1px 0 rgba(2, 6, 23, 0.04);
  transition: transform 0.10s ease, box-shadow 0.10s ease, border 0.10s ease;
}

.backBtn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow2);
  border-color: rgba(99, 102, 241, 0.25);
}

.backIcon {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(99, 102, 241, 0.12);
}

.shell {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 18px;
  align-items: start;
}

/* Panel (glass card) */
.panel {
  border-radius: var(--radius);
  border: 1px solid var(--line);
  background: var(--card);
  backdrop-filter: blur(16px);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.panelTop {
  padding: 16px 16px 12px;
  display: flex;
  justify-content: space-between;
  gap: 14px;
  border-bottom: 1px solid var(--line);
}

.panelTitle {
  margin: 0;
  font-size: 18px;
  font-weight: 950;
  letter-spacing: -0.01em;
}

.panelSub {
  margin: 6px 0 0;
  color: var(--muted);
  font-weight: 700;
  font-size: 13px;
}

.badgeRow {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-content: flex-start;
  padding-top: 2px;
}

.chip {
  font-size: 11px;
  font-weight: 950;
  border-radius: 999px;
  padding: 6px 10px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.55);
}

/* Wallet (saved) */
.wallet {
  margin: 14px 16px 0;
  border-radius: 16px;
  border: 1px solid var(--line);
  background:
    radial-gradient(800px 300px at 20% 0%, rgba(99, 102, 241, 0.18), transparent 60%),
    radial-gradient(700px 300px at 90% 20%, rgba(16, 185, 129, 0.10), transparent 55%),
    rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(12px);
  padding: 14px;
  box-shadow: 0 12px 30px rgba(2, 6, 23, 0.08);
}

.walletTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.walletTitle {
  font-weight: 950;
  font-size: 13px;
}

.walletPill {
  font-weight: 950;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.55);
}

.walletBody {
  margin-top: 10px;
}

.walletNumber {
  font-weight: 950;
  letter-spacing: 0.06em;
}

.walletMeta {
  margin-top: 8px;
  color: var(--muted);
  font-weight: 800;
  font-size: 12px;
}

.sep { opacity: 0.6; margin: 0 6px; }

.walletFine {
  margin-top: 10px;
  color: var(--muted);
  font-weight: 700;
  font-size: 12px;
}

/* Form */
.form {
  padding: 16px;
  display: grid;
  gap: 14px;
}

/* Card preview */
.cardPreview {
  border-radius: 18px;
  border: 1px solid var(--line);
  padding: 14px;
  color: rgba(255, 255, 255, 0.95);
  background:
    radial-gradient(900px 320px at 20% 0%, rgba(255, 255, 255, 0.20), transparent 60%),
    linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(79, 70, 229, 0.80));
  box-shadow: 0 18px 46px rgba(2, 6, 23, 0.20);
  position: relative;
  overflow: hidden;
}

.cardPreview::after {
  content: "";
  position: absolute;
  inset: -40%;
  background: radial-gradient(circle, rgba(255,255,255,0.12), transparent 55%);
  transform: rotate(12deg);
}

.cardPreviewTop,
.cardPreviewBottom,
.cardPreviewNum {
  position: relative;
  z-index: 1;
}

.cardPreviewTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.miniChip {
  width: 34px;
  height: 26px;
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(255,255,255,0.28), rgba(255,255,255,0.10));
  border: 1px solid rgba(255,255,255,0.18);
}

.brandMark .brandText {
  font-weight: 950;
  letter-spacing: 0.08em;
  font-size: 12px;
  text-transform: uppercase;
  opacity: 0.95;
}

.cardPreviewNum {
  margin-top: 18px;
  font-weight: 950;
  letter-spacing: 0.14em;
  font-size: 14px;
}

.cardPreviewBottom {
  margin-top: 18px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 14px;
}

.pvLabel {
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.75;
  font-weight: 900;
}

.pvValue {
  margin-top: 4px;
  font-weight: 950;
  font-size: 12px;
  letter-spacing: 0.04em;
}

.pvCol.right { text-align: right; }

/* Fields */
.field { display: grid; gap: 8px; }

.label {
  font-weight: 900;
  font-size: 13px;
  letter-spacing: -0.01em;
  color: rgba(2, 6, 23, 0.88);
  display: flex;
  align-items: center;
  gap: 8px;
}

.control {
  position: relative;
  display: flex;
  align-items: center;
}

.input {
  width: 100%;
  border-radius: 14px;
  border: 1px solid var(--line);
  padding: 13px 14px;
  font: inherit;
  outline: none;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(10px);
  box-shadow: 0 1px 0 rgba(2, 6, 23, 0.03);
  transition: box-shadow 0.12s ease, border-color 0.12s ease, transform 0.12s ease;
}

.input:focus-visible {
  border-color: rgba(99, 102, 241, 0.55);
  box-shadow: 0 0 0 4px var(--focus);
}

.input[aria-invalid="true"] {
  border-color: rgba(239, 68, 68, 0.55);
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.18);
}

.rightAffix {
  position: absolute;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  pointer-events: none;
}

.brandPill {
  font-size: 11px;
  font-weight: 950;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(2, 6, 23, 0.10);
  background: rgba(255, 255, 255, 0.70);
  color: rgba(2, 6, 23, 0.88);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* Hint button */
.hintBtn {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.70);
  font-weight: 950;
  cursor: pointer;
  display: grid;
  place-items: center;
}

.help {
  margin: 0;
  font-size: 12px;
  color: var(--muted);
  font-weight: 700;
  line-height: 1.35;
}

.err {
  margin: 0;
  font-size: 12px;
  color: rgba(185, 28, 28, 0.92);
  font-weight: 800;
}

.grid2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* Accordion (billing) */
.accordion {
  border-radius: 16px;
  border: 1px solid var(--line);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.55);
}

.accordionHead {
  width: 100%;
  text-align: left;
  border: 0;
  background: transparent;
  padding: 12px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
}

.accTitle {
  font-weight: 950;
  font-size: 13px;
}

.accSub {
  margin-top: 4px;
  color: var(--muted);
  font-weight: 700;
  font-size: 12px;
}

.accRight {
  display: flex;
  align-items: center;
  gap: 10px;
}

.accPill {
  font-size: 11px;
  font-weight: 900;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.7);
}

.chev {
  font-weight: 950;
  opacity: 0.65;
  transform: translateY(-1px);
  transition: transform 0.12s ease;
}
.chev.open { transform: rotate(180deg) translateY(1px); }

.accordionBody {
  padding: 12px;
  border-top: 1px solid var(--line);
  display: grid;
  gap: 12px;
}

.checkLine {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  font-size: 13px;
  color: rgba(2, 6, 23, 0.82);
}

/* Toast */
.toast {
  margin: 0;
  padding: 10px 12px;
  border-radius: 14px;
  font-weight: 900;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.65);
}
.toast.ok {
  background: var(--good);
  border-color: rgba(16, 185, 129, 0.30);
  color: rgba(6, 95, 70, 0.98);
}
.toast.bad {
  background: var(--bad);
  border-color: rgba(239, 68, 68, 0.28);
  color: rgba(153, 27, 27, 0.95);
}

/* Actions */
.actions {
  display: grid;
  gap: 10px;
  margin-top: 2px;
}

.primaryBtn{
  width: 100%;
  border: 0;
  border-radius: 16px;
  padding: 14px 14px;
  cursor: pointer;
  font-weight: 950;
  color: #fff;

  background: var(--appleBlue);
  box-shadow: 0 14px 30px rgba(10, 132, 255, 0.25);

  transition: transform 0.10s ease, box-shadow 0.10s ease, background 0.10s ease;

  /* ✅ center content */
  position: relative;
  display: grid;
  place-items: center;
}

.primaryBtn:hover{
  background: var(--appleBlueHover);
  transform: translateY(-1px);
  box-shadow: 0 18px 40px rgba(10, 132, 255, 0.32);
}

/* ✅ keep arrow on the right */
.btnArrow{
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.9;
}


/* CHECKOUT BUTTON (colored) */
.secondaryBtn {
  width: 100%;
  border-radius: 16px;
  padding: 14px 14px;
  cursor: pointer;
  font-weight: 950;
  border: 0;

  color: #fff;
  background: var(--checkoutBg);
  box-shadow: 0 12px 26px rgba(17, 24, 39, 0.18);

  transition: transform 0.10s ease, box-shadow 0.10s ease, background 0.10s ease;
}

.secondaryBtn:hover {
  background: var(--checkoutHover);
  transform: translateY(-1px);
  box-shadow: 0 16px 34px rgba(17, 24, 39, 0.22);
}

.btnArrow { opacity: 0.9; }

.trustRow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 800;
  font-size: 12px;
  color: var(--muted);
  margin-top: 2px;
}

.trustDot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.12);
}

/* Summary */
.summary {
  position: sticky;
  top: 18px;
}

.summaryCard {
  border-radius: var(--radius);
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.70);
  backdrop-filter: blur(16px);
  box-shadow: var(--shadow2);
  padding: 14px;
}

.sumTop { margin-bottom: 10px; }
.sumTitle { font-weight: 950; }
.sumSub { margin-top: 6px; color: var(--muted); font-weight: 700; font-size: 12px; }

.sumRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-top: 1px solid rgba(2, 6, 23, 0.06);
  font-weight: 800;
  font-size: 13px;
  color: rgba(2, 6, 23, 0.82);
}

.sumRow:first-of-type { border-top: 0; }

.sumValue {
  font-weight: 950;
  color: rgba(2, 6, 23, 0.92);
  text-align: right;
}

.sumDivider {
  height: 1px;
  background: rgba(2, 6, 23, 0.08);
  margin: 10px 0;
}

.sumFine {
  color: var(--muted);
  font-weight: 700;
  font-size: 12px;
  line-height: 1.4;
}

/* Responsive */
@media (max-width: 1020px) {
  .shell { grid-template-columns: 1fr; }
  .summary { position: static; }
}

@media (max-width: 760px) {
  .page { grid-template-columns: 1fr; }
  .sidebar { border-right: 0; border-bottom: 1px solid var(--line); }
  .grid2 { grid-template-columns: 1fr; }
  .topbar { align-items: flex-start; }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; }
}
</style>
