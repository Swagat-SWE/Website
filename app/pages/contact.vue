<!-- app/pages/contact.vue -->

<!--
[FR-100] The Contact page SHALL display the business’s physical address in a clearly visible section at the top of the page.
[FR-101] The Contact page SHALL provide fields for the user’s name and phone number when submitting an inquiry or message.
[FR-102] The Contact page SHALL include a section containing all applicable legal disclaimers related to communication and data use.
[FR-103] The Contact page SHALL include a link or embedded section describing the website’s privacy policy, including how user information is handled and stored.
[FR-104] The Contact page SHALL display the business’s phone number in a dedicated section, allowing users to call directly from mobile devices.
-->

<template>
  <div class="page">
    <!-- Left Sidebar -->
    <aside class="sidebar">
      <div class="sidebarTop">
        <NuxtLink to="/" class="logoLink" aria-label="Main Page">
          <img src="/Logo.png" alt="Einstein Bros Logo" class="logoImg" />
        </NuxtLink>
      </div>

      <nav class="nav">
        <NuxtLink class="navItem" to="/">Home</NuxtLink>
        <NuxtLink class="navItem" to="/food">Food Menu</NuxtLink>
        <NuxtLink class="navItem" to="/drinks">Drinks Menu</NuxtLink>
        <NuxtLink class="navItem" to="/contact">Contact</NuxtLink>

        <!-- Review + popout -->
        <button class="navItem reviewBtn" type="button" @click="toggleReview">
          Review
          <span class="chev" :class="{ open: showReview }">▾</span>
        </button>

        <div v-if="showReview" class="reviewPanel">
          <div class="starsRow" role="radiogroup" aria-label="Rate us">
            <button
              v-for="n in 5"
              :key="n"
              class="starBtn"
              type="button"
              :aria-label="`Rate ${n} out of 5`"
              :class="{ on: n <= (hoverRating || rating) }"
              @mouseenter="hoverRating = n"
              @mouseleave="hoverRating = 0"
              @click="rating = n"
            >
              ★
            </button>
          </div>

          <div class="ratingText">
            <span v-if="rating === 0">Tap a star to rate</span>
            <span v-else>You rated: <b>{{ rating }}/5</b></span>
          </div>

          <label class="commentLabel" for="comment">Comment</label>
          <textarea
            id="comment"
            v-model="comment"
            class="commentBox"
            placeholder="Tell us what you liked…"
            rows="4"
          />

          <button class="primaryBtn" type="button" @click="submitReview">
            Submit
          </button>
          <p v-if="submitted" class="submitted">Thanks! Review saved locally.</p>
        </div>
      </nav>
    </aside>

    <!-- Main content area -->
    <main class="main">
      <!-- Top bar: Location + Cart -->
      <header class="topbar">
        <div class="topbarLeft">
          <div class="locationWrap">
            <div class="locationPill">
              <span class="pin">📍</span>

              <input
                v-model="locationQuery"
                class="locationInput"
                type="text"
                placeholder="Search a state…"
                @focus="showLocationDropdown = true"
                @input="showLocationDropdown = true"
              />

              <span class="locationSelected">{{ location }}</span>
            </div>

            <div v-if="showLocationDropdown" class="locationDropdown">
              <div v-if="filteredLocations.length === 0" class="locationEmpty">
                No matches. Try “Iowa” or “Illinois”.
              </div>

              <button
                v-for="opt in filteredLocations"
                :key="opt"
                class="locationOption"
                type="button"
                @click="selectLocation(opt)"
              >
                {{ opt }}
              </button>
            </div>
          </div>
        </div>

        <div class="topbarRight">
          <button class="signInBtn" type="button">Sign In</button>

          <button class="cartBtn" type="button" @click="toggleCart" aria-label="Cart">
            <span class="cartIcon">🛒</span>
            <span class="cartCount">{{ cartCount }}</span>
          </button>
        </div>
      </header>

      <!-- Page Title -->
      <section class="hero">
        <h1 class="title">CONTACT</h1>
        <p class="subtitle">Loras College • Dubuque, Iowa</p>
      </section>

      <!-- Content grid -->
      <section class="contactGrid">
        <!-- Left column -->
        <div class="leftCol">
          <div class="card">
            <div class="cardHeader">
              <h2 class="cardTitle">Loras College</h2>
              <p class="statusLine">
                <span class="statusDot" :class="{ open: isOpenNow }"></span>
                <span v-if="isOpenNow"><b>Open now</b></span>
                <span v-else><b>Closed</b> • Opens at <b>{{ todayOpenText }}</b></span>
              </p>
            </div>

            <div class="infoBlock">
              <div class="infoRow">
                <div class="infoLabel">Address</div>
                <div class="infoValue">
                  1450 Alta Vista<br />
                  Dubuque, IA 52001
                </div>
              </div>

              <div class="infoRow">
                <div class="infoLabel">Phone</div>
                <div class="infoValue">(563) 588-7067</div>
              </div>
            </div>
          </div>

          <div class="card">
            <h2 class="cardTitle">About Loras College Einstein Bros. Bagels</h2>
            <p class="aboutText">
              Located on the campus of Loras College in Dubuque, Iowa, Einstein Bros. Bagels offers
              fresh bagels, breakfast sandwiches, and coffee for students, faculty, and visitors.
              Open weekdays from 7:30 AM to 1:30 PM, this convenient location is perfect for a quick
              breakfast, lunch, or study break.
            </p>
            <p class="aboutText">
              Whether you’re grabbing an All-Nighter before class or meeting friends for coffee,
              Einstein Bros. at Loras provides quality food and friendly service in a comfortable
              campus setting.
            </p>
          </div>

          <div class="card">
            <h2 class="cardTitle">FAQ’s</h2>

            <button class="faqItem" type="button" @click="toggleFaq(0)">
              <span>1) Ordered a wrong bagel?</span>
              <span class="faqChev" :class="{ open: openFaq === 0 }">▾</span>
            </button>
            <div v-if="openFaq === 0" class="faqBody">
              If your order is incorrect, call the store right away and we’ll help fix it. Keep your
              receipt/order details ready.
            </div>

            <button class="faqItem" type="button" @click="toggleFaq(1)">
              <span>2) How do I place an order?</span>
              <span class="faqChev" :class="{ open: openFaq === 1 }">▾</span>
            </button>
            <div v-if="openFaq === 1" class="faqBody">
              Use the Food/Drinks menu to add items to your cart, then go to Checkout to place the
              order.
            </div>

            <button class="faqItem" type="button" @click="toggleFaq(2)">
              <span>3) Where do I pick up a mobile order?</span>
              <span class="faqChev" :class="{ open: openFaq === 2 }">▾</span>
            </button>
            <div v-if="openFaq === 2" class="faqBody">
              Pick up at the counter inside the Loras College location. Ask a team member if you
              don’t see your order.
            </div>

            <button class="faqItem" type="button" @click="toggleFaq(3)">
              <span>4) What are your holiday hours?</span>
              <span class="faqChev" :class="{ open: openFaq === 3 }">▾</span>
            </button>
            <div v-if="openFaq === 3" class="faqBody">
              Holiday hours can change. Check announcements or call the store for the most accurate
              hours.
            </div>

            <button class="faqItem" type="button" @click="toggleFaq(4)">
              <span>5) How do I delete my account?</span>
              <span class="faqChev" :class="{ open: openFaq === 4 }">▾</span>
            </button>
            <div v-if="openFaq === 4" class="faqBody">
              For account help, contact support. We can guide you through deleting or updating your
              info.
            </div>

            <div class="privacyBar">
              Privacy and Disclaimer Information…
            </div>
          </div>
        </div>

        <!-- Right column -->
        <div class="rightCol">
          <div class="card">
            <h2 class="cardTitle">Hours</h2>

            <div class="hoursTable">
              <div class="hoursRow" v-for="h in hours" :key="h.day">
                <div class="hoursDay" :class="{ today: h.isToday }">{{ h.day }}</div>
                <div class="hoursTime">{{ h.time }}</div>
              </div>
            </div>
          </div>

          <div class="card">
            <h2 class="cardTitle">Map</h2>

            <!-- No API key needed (OpenStreetMap embed).
                 You can replace this with Mapbox/Google later if you want. -->
            <div class="mapWrap">
              <iframe
                title="Map"
                class="mapFrame"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-90.740%2C42.498%2C-90.646%2C42.560&layer=mapnik"
                loading="lazy"
              />
            </div>

            <button class="secondaryBtn" type="button" @click="openMaps">
              Open in Maps
            </button>
          </div>
        </div>
      </section>

      <!-- Slide-out cart panel -->
      <div class="overlay" v-if="showCart" @click="showCart = false" />
      <aside class="cartPanel" :class="{ open: showCart }" aria-label="Cart panel">
        <div class="cartHeader">
          <h3>Your Cart</h3>
          <button class="xBtn" type="button" @click="showCart = false">✕</button>
        </div>

        <div v-if="cart.length === 0" class="emptyCart">
          No items yet. Use the <b>+</b> button to add items.
        </div>

        <ul v-else class="cartList">
          <li v-for="(item, idx) in cart" :key="idx" class="cartItem">
            <span class="cartItemName">{{ item.name }} (x{{ item.qty }})</span>
            <button class="removeBtn" type="button" @click="removeFromCart(idx)">Remove</button>
          </li>
        </ul>

        <button class="checkoutBtn" type="button" @click="goToCheckout">
          Checkout
        </button>
      </aside>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

/** =========================
 *  Location prototype
 *  ========================= */
const location = ref("Dubuque, IA");
const locationQuery = ref("");
const showLocationDropdown = ref(false);

const locations = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia",
  "Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland",
  "Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey",
  "New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina",
  "South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming",
];

const filteredLocations = computed(() => {
  const q = locationQuery.value.trim().toLowerCase();
  if (!q) return locations.slice(0, 12);
  return locations.filter((x) => x.toLowerCase().includes(q)).slice(0, 8);
});

function selectLocation(opt) {
  location.value = opt;
  locationQuery.value = "";
  showLocationDropdown.value = false;
}

/** close dropdown if user clicks outside */
function handleDocClick(e) {
  const target = e.target;
  if (target?.closest?.(".locationWrap")) return;
  showLocationDropdown.value = false;
}

onMounted(() => document.addEventListener("click", handleDocClick));
onBeforeUnmount(() => document.removeEventListener("click", handleDocClick));

/** =========================
 *  Sidebar Review
 *  ========================= */
const showReview = ref(false);
const rating = ref(0);
const hoverRating = ref(0);
const comment = ref("");
const submitted = ref(false);

function toggleReview() {
  showReview.value = !showReview.value;
}

function submitReview() {
  submitted.value = true;
  rating.value = 0;
  hoverRating.value = 0;
  comment.value = "";
  setTimeout(() => (submitted.value = false), 2000);
}

/** =========================
 *  FAQ
 *  ========================= */
const openFaq = ref(null);
function toggleFaq(i) {
  openFaq.value = openFaq.value === i ? null : i;
}

/** =========================
 *  Hours + Open/Closed
 *  ========================= */
const schedule = [
  { day: "Monday", open: "07:30", close: "13:30" },
  { day: "Tuesday", open: "07:30", close: "13:30" },
  { day: "Wednesday", open: "07:30", close: "13:30" },
  { day: "Thursday", open: "07:30", close: "13:30" },
  { day: "Friday", open: "07:30", close: "13:30" },
  { day: "Saturday", open: "07:30", close: "13:30" },
  { day: "Sunday", open: null, close: null }, // closed
];

function fmtTime(t) {
  if (!t) return "Closed";
  const [hh, mm] = t.split(":").map(Number);
  const ampm = hh >= 12 ? "PM" : "AM";
  const hour12 = ((hh + 11) % 12) + 1;
  return `${hour12}:${String(mm).padStart(2, "0")} ${ampm}`;
}

const now = ref(new Date());
let timer;

onMounted(() => {
  timer = setInterval(() => (now.value = new Date()), 15000);
});
onBeforeUnmount(() => clearInterval(timer));

const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const todayName = computed(() => dayNames[now.value.getDay()]);

const hours = computed(() => {
  return schedule.map((s) => ({
    day: s.day,
    time: s.open ? `${fmtTime(s.open)} - ${fmtTime(s.close)}` : "Closed",
    isToday: s.day === todayName.value,
  }));
});

function toMinutes(t) {
  const [hh, mm] = t.split(":").map(Number);
  return hh * 60 + mm;
}

const isOpenNow = computed(() => {
  const s = schedule.find((x) => x.day === todayName.value);
  if (!s || !s.open) return false;
  const mins = now.value.getHours() * 60 + now.value.getMinutes();
  return mins >= toMinutes(s.open) && mins <= toMinutes(s.close);
});

const todayOpenText = computed(() => {
  const s = schedule.find((x) => x.day === todayName.value);
  if (s?.open) return fmtTime(s.open);

  // if today is closed, find next open day
  for (let i = 1; i <= 7; i++) {
    const d = new Date(now.value);
    d.setDate(d.getDate() + i);
    const name = dayNames[d.getDay()];
    const next = schedule.find((x) => x.day === name);
    if (next?.open) return `${fmtTime(next.open)} ${name}`;
  }
  return "soon";
});

function openMaps() {
  // Opens Google Maps search (works without API key)
  window.open("https://www.google.com/maps/search/?api=1&query=1450+Alta+Vista+Dubuque+IA+52001", "_blank");
}

/** =========================
 *  Cart (shared)
 *  ========================= */
const showCart = ref(false);
const cart = useState("cart", () => []);
const cartCount = computed(() => cart.value.reduce((sum, item) => sum + (item.qty || 1), 0));

function toggleCart() {
  showCart.value = !showCart.value;
}

function goToCheckout() {
  showCart.value = false;
  navigateTo("/checkout");
}

function removeFromCart(index) {
  cart.value.splice(index, 1);
}
</script>

<style scoped>
/* Einstein-ish warm palette */
:root {
  --cream: #f6f0e8;
  --cream2: #fbf8f3;
  --brown: #4b3429;
  --brown2: #6a4a3a;
  --orange: #f4a51c;
  --orangeHover: #ffb42f;
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
  overflow: hidden;
}
.logoImg {
  width: 100%;
  max-width: 160px;
  height: auto;
  display: block;
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
.reviewBtn { text-align: left; cursor: pointer; }
.chev { float: right; opacity: 0.7; transition: transform 0.15s ease; }
.chev.open { transform: rotate(180deg); }

.reviewPanel {
  margin-top: -4px;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: #fff;
  box-shadow: var(--cardShadow);
}
.starsRow { display: flex; gap: 6px; margin-bottom: 8px; }
.starBtn {
  font-size: 22px;
  line-height: 1;
  border: none;
  background: transparent;
  cursor: pointer;
  opacity: 0.35;
  transition: opacity 0.08s ease, transform 0.08s ease;
}
.starBtn.on { opacity: 1; color: var(--yellow); text-shadow: 0 2px 8px rgba(244, 179, 22, 0.25); }
.starBtn:hover { transform: translateY(-1px); }
.ratingText { font-size: 0.9rem; opacity: 0.85; margin-bottom: 10px; }
.commentLabel { font-size: 0.85rem; font-weight: 800; display: block; margin-bottom: 6px; }
.commentBox {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(75, 52, 41, 0.18);
  padding: 10px;
  outline: none;
  resize: vertical;
  font-family: inherit;
  margin-bottom: 10px;
}
.primaryBtn {
  width: 100%;
  background: var(--yellow);
  border: none;
  color: #2c1b12;
  font-weight: 900;
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
}
.primaryBtn:hover { background: #ffbe21; }
.submitted { margin-top: 8px; font-size: 0.85rem; opacity: 0.85; }

/* Main */
.main { position: relative; padding: 20px 26px 50px; }
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}
.topbarRight { display: flex; align-items: center; gap: 12px; }

.signInBtn {
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: #fff;
  border-radius: 14px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 900;
  color: var(--brown);
  box-shadow: var(--cardShadow);
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}
.signInBtn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 26px rgba(0,0,0,0.12);
  border-color: rgba(244, 179, 22, 0.5);
}

/* Location */
.locationWrap { position: relative; }
.locationPill {
  display: inline-flex;
  gap: 12px;
  align-items: center;
  background: rgba(75, 52, 41, 0.06);
  border: 1px solid rgba(75, 52, 41, 0.12);
  padding: 10px 14px;
  border-radius: 999px;
  font-weight: 900;
}
.locationInput {
  width: 200px;
  border: none;
  outline: none;
  background: transparent;
  font: inherit;
  font-weight: 900;
  color: var(--brown);
}
.locationSelected {
  opacity: 0.75;
  font-weight: 900;
  border-left: 1px solid rgba(75, 52, 41, 0.18);
  padding-left: 12px;
}
.locationDropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 320px;
  max-height: 312px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid rgba(75, 52, 41, 0.14);
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  padding: 8px;
  z-index: 50;
}
.locationOption {
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  text-align: left;
  border: none;
  background: transparent;
  padding: 0 12px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 900;
  color: #4b3429;
}
.locationOption:hover { background: rgba(244, 179, 22, 0.18); }
.locationEmpty { padding: 10px; opacity: 0.75; font-weight: 800; }

.cartBtn {
  position: relative;
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: #fff;
  border-radius: 14px;
  padding: 10px 12px;
  cursor: pointer;
  box-shadow: var(--cardShadow);
}
.cartIcon { font-size: 18px; }
.cartCount {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: var(--yellow);
  color: #2c1b12;
  font-weight: 900;
  display: grid;
  place-items: center;
  border: 2px solid #fff;
  font-size: 12px;
}

/* Hero */
.hero { text-align: center; padding: 8px 0 16px; }
.title { margin: 0; font-size: 44px; letter-spacing: 2px; font-weight: 900; color: var(--brown); }
.subtitle { margin: 8px 0 0; opacity: 0.75; font-weight: 800; }

/* Contact Layout */
.contactGrid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 18px;
  align-items: start;
}
.leftCol, .rightCol { display: flex; flex-direction: column; gap: 18px; }

.card {
  background: #fff;
  border: 1px solid rgba(75, 52, 41, 0.14);
  border-radius: 18px;
  box-shadow: var(--cardShadow);
  padding: 14px;
}
.cardHeader { display: flex; justify-content: space-between; gap: 14px; align-items: baseline; }
.cardTitle { margin: 0; font-size: 18px; font-weight: 1000; color: var(--brown); }
.statusLine { margin: 0; display: inline-flex; align-items: center; gap: 8px; font-weight: 900; opacity: 0.9; }
.statusDot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #b34a3a; /* closed */
  box-shadow: 0 0 0 4px rgba(179, 74, 58, 0.15);
}
.statusDot.open {
  background: #2c8a4b;
  box-shadow: 0 0 0 4px rgba(44, 138, 75, 0.15);
}

.crumbs {
  margin: 10px 0 14px;
  font-weight: 900;
  opacity: 0.75;
}
.crumbLink { text-decoration: underline; cursor: default; }
.crumbSep { margin: 0 8px; opacity: 0.6; }

.infoRow {
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 10px;
  padding: 10px 0;
  border-top: 1px solid rgba(75, 52, 41, 0.10);
}
.infoLabel { font-weight: 1000; opacity: 0.8; }
.infoValue { font-weight: 900; }

.aboutText { margin: 10px 0 0; line-height: 1.45; font-weight: 800; opacity: 0.9; }

.hoursTable { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }
.hoursRow {
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(75, 52, 41, 0.10);
}
.hoursDay { font-weight: 1000; }
.hoursDay.today { text-decoration: underline; }
.hoursTime { font-weight: 900; opacity: 0.9; }

.mapWrap {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: #fff;
  margin-top: 10px;
}
.mapFrame {
  width: 100%;
  height: 280px;
  border: 0;
  display: block;
}

.secondaryBtn {
  margin-top: 10px;
  width: 100%;
  background: rgba(75, 52, 41, 0.06);
  border: 1px solid rgba(75, 52, 41, 0.14);
  color: var(--brown);
  font-weight: 1000;
  border-radius: 14px;
  padding: 12px;
  cursor: pointer;
}
.secondaryBtn:hover { border-color: rgba(244, 179, 22, 0.55); box-shadow: var(--cardShadow); }

.faqItem {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding: 12px 12px;
  border-radius: 14px;
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: #fff;
  cursor: pointer;
  font-weight: 1000;
  color: var(--brown);
}
.faqItem:hover { border-color: rgba(244, 179, 22, 0.55); box-shadow: var(--cardShadow); }
.faqChev { opacity: 0.7; transition: transform 0.15s ease; }
.faqChev.open { transform: rotate(180deg); }

.faqBody {
  padding: 10px 12px;
  margin-top: 8px;
  border-radius: 14px;
  background: rgba(75, 52, 41, 0.04);
  border: 1px solid rgba(75, 52, 41, 0.10);
  font-weight: 900;
  opacity: 0.9;
}

.privacyBar {
  margin-top: 14px;
  padding: 12px 12px;
  border-radius: 14px;
  background: rgba(244, 179, 22, 0.18);
  border: 1px solid rgba(244, 179, 22, 0.35);
  font-weight: 1000;
}

/* Cart slide-over */
.overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.25); z-index: 20; }
.cartPanel {
  position: fixed;
  top: 0;
  right: -360px;
  width: 340px;
  height: 100vh;
  background: #fff;
  border-left: 1px solid rgba(75, 52, 41, 0.14);
  box-shadow: -20px 0 60px rgba(0, 0, 0, 0.12);
  z-index: 30;
  padding: 14px;
  transition: right 0.18s ease;
  display: flex;
  flex-direction: column;
}
.cartPanel.open { right: 0; }
.cartHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(75, 52, 41, 0.12);
}
.xBtn { border: none; background: transparent; cursor: pointer; font-size: 18px; opacity: 0.8; }
.emptyCart { padding: 14px 0; opacity: 0.8; }
.cartItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(75, 52, 41, 0.12);
  border-radius: 14px;
  padding: 10px 10px;
  background: rgba(75, 52, 41, 0.03);
}
.cartItemName { font-weight: 900; }
.removeBtn { border: none; background: transparent; cursor: pointer; font-weight: 900; color: var(--brown2); opacity: 0.9; }
.checkoutBtn {
  width: 100%;
  border: none;
  background: var(--yellow);
  color: #2c1b12;
  font-weight: 1000;
  border-radius: 14px;
  padding: 12px;
  cursor: pointer;
  position: sticky;
  bottom: 14px;
}
.checkoutBtn:hover { background: #ffbe21; }

/* Responsive */
@media (max-width: 980px) {
  .page { grid-template-columns: 220px 1fr; }
  .contactGrid { grid-template-columns: 1fr; }
}
@media (max-width: 720px) {
  .page { grid-template-columns: 1fr; }
  .sidebar {
    position: sticky;
    top: 0;
    z-index: 10;
    border-right: none;
    border-bottom: 1px solid rgba(75, 52, 41, 0.12);
  }
  .locationInput { width: 150px; }
  .locationDropdown { min-width: 260px; }
}
</style>
