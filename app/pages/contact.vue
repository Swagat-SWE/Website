<!-- app/pages/contact.vue -->
<!-- Full working version: Sidebar logo hidden on desktop/laptop, visible on mobile (like other pages) -->

<template>
  <div class="page">
    <!-- ✅ Mobile overlay (tap to close drawer) -->
    <div
      v-if="mobileNavOpen"
      class="mobileOverlay"
      @click="closeMobileNav"
      aria-hidden="true"
    />

    <!-- ✅ Sidebar (desktop column, mobile drawer) -->
    <aside class="sidebar" :class="{ open: mobileNavOpen }">
      <div class="sidebarTop">
        <NuxtLink
          to="/"
          class="logoLink"
          aria-label="Main Page"
          @click="closeMobileNav"
        >
          <img src="/Logo.png" alt="Einstein Bros Logo" class="logoImg" />
        </NuxtLink>

        <!-- ✅ Mobile close button inside drawer -->
        <button
          class="drawerCloseBtn"
          type="button"
          @click="closeMobileNav"
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      <nav class="nav">
        <NuxtLink class="navItem" to="/" @click="closeMobileNav">Home</NuxtLink>
        <NuxtLink class="navItem" to="/food" @click="closeMobileNav"
          >Food Menu</NuxtLink
        >
        <NuxtLink class="navItem" to="/drinks" @click="closeMobileNav"
          >Drinks Menu</NuxtLink
        >
        <NuxtLink class="navItem" to="/contact" @click="closeMobileNav"
          >Contact</NuxtLink
        >

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
      <!-- ✅ Mobile-only mini brand strip (shows on phone only) -->
      <div class="brandStrip" aria-hidden="true">
        <img class="brandStripLogo" src="/Logo.png" alt="Einstein Bros Logo" />
      </div>

      <!-- ✅ Top bar -->
      <header class="topbar">
        <!-- ✅ Mobile hamburger (hidden on desktop) -->
        <button
          class="hamburgerBtn"
          type="button"
          @click="openMobileNav"
          aria-label="Open menu"
        >
          <span class="hamburgerIcon" aria-hidden="true">☰</span>
        </button>

        <div class="topbarLeft">
          <div class="locationWrap">
            <div class="locationPill" aria-label="Current location">
              <span class="locDot" aria-hidden="true"></span>
              <span class="locationSelected">{{ location }}</span>
            </div>
          </div>
        </div>

        <div class="topbarRight">
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
          <!-- Address + Phone -->
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
                <div class="infoValue">
                  <a class="phoneLink" href="tel:+15635887067">(563) 588-7067</a>
                </div>
              </div>
            </div>
          </div>

          <!-- About -->
          <div class="card aboutCard">
            <h2 class="cardTitle">About Einstein Bros. Bagels at Loras</h2>
            <p class="aboutText">
              Right on Loras College’s campus in Dubuque, Einstein Bros. Bagels serves fresh-baked
              bagels, breakfast sandwiches, and coffee
            </p>

            <p class="aboutText">Made for students, faculty, and visitors on the go.</p>

            <p class="aboutText">We’re open weekdays from <b>7:30 AM to 1:30 PM</b>.</p>

            <p class="aboutText">
              Whether you’re picking up bagel before class or meeting friends between lectures,
              expect fast service, quality food, and a warm, campus friendly vibe.
            </p>

            <div class="aboutHighlight">
              <div class="aboutHighlightTitle">Quick tip</div>
              <div class="aboutHighlightBody">
                <p>Order ahead for faster pickup and head straight to the counter.</p>
              </div>
            </div>
          </div>

          <!-- FAQ + Privacy + Message -->
          <div class="card">
            <h2 class="cardTitle">FAQ</h2>

            <button class="faqItem" type="button" @click="toggleFaq(0)">
              <span>1) Ordered the wrong item?</span>
              <span class="faqChev" :class="{ open: openFaq === 0 }">▾</span>
            </button>
            <div v-if="openFaq === 0" class="faqBody">
              Call the store as soon as you notice—share your receipt/order details and we’ll help
              make it right.
            </div>

            <button class="faqItem" type="button" @click="toggleFaq(1)">
              <span>2) How do I place an order?</span>
              <span class="faqChev" :class="{ open: openFaq === 1 }">▾</span>
            </button>
            <div v-if="openFaq === 1" class="faqBody">
              Use the Food/Drinks menu to add items, then go to Checkout to place your order.
            </div>

            <button class="faqItem" type="button" @click="toggleFaq(2)">
              <span>3) Where do I pick up a mobile order?</span>
              <span class="faqChev" :class="{ open: openFaq === 2 }">▾</span>
            </button>
            <div v-if="openFaq === 2" class="faqBody">
              Pick up at the counter inside the Loras College location. If you don’t see it, ask a
              team member.
            </div>

            <button class="faqItem" type="button" @click="toggleFaq(3)">
              <span>4) What are your holiday hours?</span>
              <span class="faqChev" :class="{ open: openFaq === 3 }">▾</span>
            </button>
            <div v-if="openFaq === 3" class="faqBody">
              Holiday hours can change—check announcements or call the store for the most accurate
              info.
            </div>

            <button class="faqItem" type="button" @click="toggleFaq(4)">
              <span>5) How do I delete my account?</span>
              <span class="faqChev" :class="{ open: openFaq === 4 }">▾</span>
            </button>
            <div v-if="openFaq === 4" class="faqBody">
              Contact support and we’ll guide you through deleting or updating your account
              information.
            </div>

            <!-- Privacy -->
            <button class="privacyBar" type="button" @click="showPrivacy = !showPrivacy">
              <span>Privacy & Disclaimers</span>
              <span class="privacyChev" :class="{ open: showPrivacy }">▾</span>
            </button>

            <div v-if="showPrivacy" class="privacyPanel">
              <div class="privacyCols">
                <div class="privacyText">
                  <p class="privacyP">
                    <b>Message us:</b> Use the form to send a question or request. Please avoid
                    sharing sensitive info (passwords, payment details, or private IDs).
                  </p>
                  <p class="privacyP">
                    <b>Data use:</b> Your name/phone are used only to respond to your inquiry. This
                    demo stores submissions locally in your browser for now (no server save).
                  </p>
                  <p class="privacyP">
                    <b>Privacy policy:</b>
                    <NuxtLink class="privacyLink" to="/privacy">View how we handle information</NuxtLink>
                    <span class="privacyHint">(you can create this page later)</span>
                  </p>
                </div>

                <form class="contactForm" @submit.prevent="submitMessage">
                  <label class="fieldLabel" for="name">Name</label>
                  <input
                    id="name"
                    v-model="msgName"
                    class="fieldInput"
                    type="text"
                    placeholder="Your name"
                    autocomplete="name"
                    required
                  />

                  <label class="fieldLabel" for="phone">Phone</label>
                  <input
                    id="phone"
                    v-model="msgPhone"
                    class="fieldInput"
                    type="tel"
                    placeholder="(555) 555-5555"
                    autocomplete="tel"
                    required
                  />

                  <label class="fieldLabel" for="message">Message</label>
                  <textarea
                    id="message"
                    v-model="msgBody"
                    class="fieldTextarea"
                    rows="4"
                    placeholder="How can we help?"
                    required
                  />

                  <button class="primaryBtn" type="submit">Send Message</button>
                  <p v-if="msgSent" class="submitted">Got it — we’ll get back to you soon.</p>
                </form>
              </div>
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
            <button class="removeBtn" type="button" @click="removeFromCart(idx)">
              Remove
            </button>
          </li>
        </ul>

        <button class="checkoutBtn" type="button" @click="goToCheckout">Checkout</button>
      </aside>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

/** ✅ Mobile nav drawer */
const mobileNavOpen = ref(false);
function openMobileNav() {
  mobileNavOpen.value = true;
}
function closeMobileNav() {
  mobileNavOpen.value = false;
}
function handleKeydown(e) {
  if (e.key === "Escape") closeMobileNav();
}
onMounted(() => document.addEventListener("keydown", handleKeydown));
onBeforeUnmount(() => document.removeEventListener("keydown", handleKeydown));

/** Simple location label */
const location = ref("Loras College • Dubuque, IA");

/** Sidebar Review */
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

/** FAQ */
const openFaq = ref(null);
function toggleFaq(i) {
  openFaq.value = openFaq.value === i ? null : i;
}

/** Privacy + Message form */
const showPrivacy = ref(false);
const msgName = ref("");
const msgPhone = ref("");
const msgBody = ref("");
const msgSent = ref(false);

function submitMessage() {
  const payload = {
    name: msgName.value.trim(),
    phone: msgPhone.value.trim(),
    message: msgBody.value.trim(),
    ts: new Date().toISOString(),
  };

  try {
    const key = "einstein_contact_messages";
    const prev = JSON.parse(localStorage.getItem(key) || "[]");
    prev.unshift(payload);
    localStorage.setItem(key, JSON.stringify(prev.slice(0, 25)));
  } catch {
    // ignore localStorage errors
  }

  msgSent.value = true;
  msgName.value = "";
  msgPhone.value = "";
  msgBody.value = "";
  setTimeout(() => (msgSent.value = false), 2200);
}

/** Hours + Open/Closed */
const schedule = [
  { day: "Monday", open: "07:30", close: "13:30" },
  { day: "Tuesday", open: "07:30", close: "13:30" },
  { day: "Wednesday", open: "07:30", close: "13:30" },
  { day: "Thursday", open: "07:30", close: "13:30" },
  { day: "Friday", open: "07:30", close: "13:30" },
  { day: "Saturday", open: "07:30", close: "13:30" },
  { day: "Sunday", open: null, close: null },
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

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const todayName = computed(() => dayNames[now.value.getDay()]);

const hours = computed(() =>
  schedule.map((s) => ({
    day: s.day,
    time: s.open ? `${fmtTime(s.open)} - ${fmtTime(s.close)}` : "Closed",
    isToday: s.day === todayName.value,
  }))
);

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
  window.open(
    "https://www.google.com/maps/search/?api=1&query=1450+Alta+Vista+Dubuque+IA+52001",
    "_blank"
  );
}

/** Cart */
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

/* ✅ Mobile overlay */
.mobileOverlay {
  display: none;
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
  position: relative;
}
.logoLink {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.logoImg {
  width: 100%;
  max-width: 160px;
  height: auto;
  display: block;
  object-fit: contain;
}

/* ✅ IMPORTANT: Hide sidebar logo on desktop/laptop ONLY */
@media (min-width: 721px) {
  .sidebarTop {
    display: none;
  }
}

/* ✅ drawer close (only mobile) */
.drawerCloseBtn {
  display: none;
  position: absolute;
  right: 6px;
  top: 6px;
  border: none;
  background: rgba(75, 52, 41, 0.06);
  border: 1px solid rgba(75, 52, 41, 0.12);
  border-radius: 12px;
  width: 38px;
  height: 38px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 900;
  color: var(--brown);
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
.reviewBtn {
  text-align: left;
  cursor: pointer;
}
.chev {
  float: right;
  opacity: 0.7;
  transition: transform 0.15s ease;
}
.chev.open {
  transform: rotate(180deg);
}

.reviewPanel {
  margin-top: -4px;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: #fff;
  box-shadow: var(--cardShadow);
}
.starsRow {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}
.starBtn {
  font-size: 22px;
  line-height: 1;
  border: none;
  background: transparent;
  cursor: pointer;
  opacity: 0.35;
  transition: opacity 0.08s ease, transform 0.08s ease;
}
.starBtn.on {
  opacity: 1;
  color: var(--yellow);
  text-shadow: 0 2px 8px rgba(244, 179, 22, 0.25);
}
.starBtn:hover {
  transform: translateY(-1px);
}
.ratingText {
  font-size: 0.9rem;
  opacity: 0.85;
  margin-bottom: 10px;
}
.commentLabel {
  font-size: 0.85rem;
  font-weight: 800;
  display: block;
  margin-bottom: 6px;
}
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
.primaryBtn:hover {
  background: #ffbe21;
}
.submitted {
  margin-top: 8px;
  font-size: 0.85rem;
  opacity: 0.85;
}

/* Main */
.main {
  position: relative;
  padding: 20px 26px 50px;
}

/* ✅ Mini Brand Strip: default hidden everywhere */
.brandStrip {
  display: none;
}
.brandStripLogo {
  display: block;
}

/* Topbar */
.topbar {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}
.topbarLeft {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}
.topbarRight {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: flex-end;
}

/* Hamburger hidden on desktop */
.hamburgerBtn {
  display: none;
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: #fff;
  border-radius: 14px;
  padding: 10px 12px;
  cursor: pointer;
  box-shadow: var(--cardShadow);
}
.hamburgerIcon {
  font-size: 18px;
  font-weight: 1000;
  line-height: 1;
}

/* Location */
.locationWrap {
  position: relative;
  min-width: 0;
}
.locationPill {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  background: rgba(75, 52, 41, 0.06);
  border: 1px solid rgba(75, 52, 41, 0.12);
  padding: 10px 14px;
  border-radius: 999px;
  font-weight: 900;
  min-width: 0;
}
.locDot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(244, 179, 22, 0.95);
  box-shadow: 0 0 0 4px rgba(244, 179, 22, 0.16);
}
.locationSelected {
  opacity: 0.85;
  font-weight: 900;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Cart */
.cartBtn {
  position: relative;
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: #fff;
  border-radius: 14px;
  padding: 10px 12px;
  cursor: pointer;
  box-shadow: var(--cardShadow);
}
.cartIcon {
  font-size: 18px;
}
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
.hero {
  text-align: center;
  padding: 8px 0 16px;
}
.title {
  margin: 0;
  font-size: 44px;
  letter-spacing: 2px;
  font-weight: 900;
  color: var(--brown);
}
.subtitle {
  margin: 8px 0 0;
  opacity: 0.75;
  font-weight: 800;
}

/* Contact Layout */
.contactGrid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 18px;
  align-items: start;
}
.leftCol,
.rightCol {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.card {
  background: #fff;
  border: 1px solid rgba(75, 52, 41, 0.14);
  border-radius: 18px;
  box-shadow: var(--cardShadow);
  padding: 14px;
}
.cardHeader {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: baseline;
  flex-wrap: wrap;
}
.cardTitle {
  margin: 0;
  font-size: 18px;
  font-weight: 1000;
  color: var(--brown);
}
.statusLine {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 900;
  opacity: 0.9;
}
.statusDot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #b34a3a;
  box-shadow: 0 0 0 4px rgba(179, 74, 58, 0.15);
}
.statusDot.open {
  background: #2c8a4b;
  box-shadow: 0 0 0 4px rgba(44, 138, 75, 0.15);
}

.infoRow {
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 10px;
  padding: 10px 0;
  border-top: 1px solid rgba(75, 52, 41, 0.1);
}
.infoLabel {
  font-weight: 1000;
  opacity: 0.8;
}
.infoValue {
  font-weight: 900;
}
.phoneLink {
  color: var(--brown);
  text-decoration: none;
  border-bottom: 1px dashed rgba(75, 52, 41, 0.35);
}
.phoneLink:hover {
  border-bottom-color: rgba(244, 179, 22, 0.9);
}

.aboutText {
  margin: 10px 0 0;
  line-height: 1.5;
  font-weight: 800;
  opacity: 0.92;
}

.aboutCard {
  position: relative;
}
.aboutHighlight {
  margin-top: 14px;
  border-radius: 16px;
  border: 1px solid rgba(244, 179, 22, 0.4);
  background: linear-gradient(
    180deg,
    rgba(244, 179, 22, 0.16),
    rgba(244, 179, 22, 0.08)
  );
  padding: 12px;
}
.aboutHighlightTitle {
  font-weight: 1000;
  margin-bottom: 4px;
}
.aboutHighlightBody {
  font-weight: 900;
  opacity: 0.9;
}

/* Hours */
.hoursTable {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}
.hoursRow {
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(75, 52, 41, 0.1);
}
.hoursDay {
  font-weight: 1000;
}
.hoursDay.today {
  text-decoration: underline;
}
.hoursTime {
  font-weight: 900;
  opacity: 0.9;
}

/* Map */
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
.secondaryBtn:hover {
  border-color: rgba(244, 179, 22, 0.55);
  box-shadow: var(--cardShadow);
}

/* FAQ */
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
.faqItem:hover {
  border-color: rgba(244, 179, 22, 0.55);
  box-shadow: var(--cardShadow);
}
.faqChev {
  opacity: 0.7;
  transition: transform 0.15s ease;
}
.faqChev.open {
  transform: rotate(180deg);
}
.faqBody {
  padding: 10px 12px;
  margin-top: 8px;
  border-radius: 14px;
  background: rgba(75, 52, 41, 0.04);
  border: 1px solid rgba(75, 52, 41, 0.1);
  font-weight: 900;
  opacity: 0.9;
}

/* Privacy + Message */
.privacyBar {
  margin-top: 14px;
  width: 100%;
  padding: 12px 12px;
  border-radius: 14px;
  background: rgba(244, 179, 22, 0.18);
  border: 1px solid rgba(244, 179, 22, 0.35);
  font-weight: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}
.privacyChev {
  opacity: 0.75;
  transition: transform 0.15s ease;
}
.privacyChev.open {
  transform: rotate(180deg);
}
.privacyPanel {
  margin-top: 10px;
  border-radius: 16px;
  border: 1px solid rgba(75, 52, 41, 0.12);
  background: rgba(255, 255, 255, 0.7);
  padding: 12px;
}
.privacyCols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.privacyP {
  margin: 0 0 10px;
  font-weight: 900;
  opacity: 0.92;
  line-height: 1.45;
}
.privacyLink {
  font-weight: 1000;
  text-decoration: underline;
  color: var(--brown);
}
.privacyHint {
  margin-left: 8px;
  opacity: 0.7;
  font-weight: 900;
}

.contactForm {
  border-radius: 14px;
  border: 1px solid rgba(75, 52, 41, 0.12);
  background: #fff;
  padding: 12px;
}
.fieldLabel {
  display: block;
  font-size: 0.85rem;
  font-weight: 1000;
  margin: 8px 0 6px;
}
.fieldInput,
.fieldTextarea {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(75, 52, 41, 0.18);
  padding: 10px;
  outline: none;
  font-family: inherit;
  font-weight: 900;
}
.fieldTextarea {
  resize: vertical;
}

/* Cart slide-over */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  z-index: 20;
}
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
.cartPanel.open {
  right: 0;
}
.cartHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(75, 52, 41, 0.12);
}
.xBtn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  opacity: 0.8;
}
.emptyCart {
  padding: 14px 0;
  opacity: 0.8;
}
.cartItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(75, 52, 41, 0.12);
  border-radius: 14px;
  padding: 10px 10px;
  background: rgba(75, 52, 41, 0.03);
}
.cartItemName {
  font-weight: 900;
}
.removeBtn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 900;
  color: var(--brown2);
  opacity: 0.9;
}
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
.checkoutBtn:hover {
  background: #ffbe21;
}

/* ===== Responsive ===== */
@media (max-width: 980px) {
  .page {
    grid-template-columns: 220px 1fr;
  }
  .contactGrid {
    grid-template-columns: 1fr;
  }
  .privacyCols {
    grid-template-columns: 1fr;
  }
}

/* ✅ Mobile: drawer sidebar like your other pages */
@media (max-width: 720px) {
  .page {
    grid-template-columns: 1fr;
  }

  /* ✅ Show mini strip only on mobile */
  .brandStrip {
    display: flex;
    height: 58px;
    background: #f6e28a;
    border-bottom: 1px solid rgba(75, 52, 41, 0.12);
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 22px rgba(0, 0, 0, 0.08);
    margin: -14px -14px 12px; /* match mobile main padding */
  }
  .brandStripLogo {
    height: 38px;
    width: auto;
    object-fit: contain;
    filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.12));
  }

  .hamburgerBtn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .mobileOverlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    z-index: 90;
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
    border-right: 1px solid rgba(75, 52, 41, 0.12);
  }
  .sidebar.open {
    transform: translateX(0);
  }

  .drawerCloseBtn {
    display: inline-grid;
    place-items: center;
  }

  .main {
    padding: 14px 14px 44px;
  }

  .title {
    font-size: 34px;
    letter-spacing: 1px;
  }

  .locationPill {
    max-width: 100%;
  }

  .mapFrame {
    height: 240px;
  }
}
</style>
