<!-- app/pages/terms.vue -->
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
                placeholder="Search a city…"
                @focus="showLocationDropdown = true"
                @input="showLocationDropdown = true"
              />
              <span class="locationSelected">{{ location }}</span>
            </div>

            <div v-if="showLocationDropdown" class="locationDropdown">
              <div v-if="filteredLocations.length === 0" class="locationEmpty">
                No matches. Try "Chicago" or "Boston".
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
            <span class="cartCount">0</span>
          </button>
        </div>
      </header>

      <!-- Terms Title -->
      <section class="hero">
        <h1 class="title">TERMS OF USE</h1>
        <p class="subtitle">Last updated: {{ currentDate }}</p>
      </section>

      <!-- Terms Content -->
      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Agreement to Terms</h2>
          <div class="sectionLine" />
        </div>

        <div class="policyContent">
          <p>
            These Terms of Use govern your access to and use of the website and services provided by Einstein Bros.
            By accessing or using the Site, you agree to be bound by these Terms. If you do not agree, do not use the Site.
          </p>
        </div>
      </section>

      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Permitted Use & Restrictions</h2>
          <div class="sectionLine" />
        </div>

        <div class="policyContent">
          <ul>
            <li>You may use the Site for personal, non-commercial purposes only.</li>
            <li>You agree not to: interfere with the Site, reverse engineer, or attempt to access other accounts.</li>
            <li>Do not post unlawful, abusive, or infringing content on the Site.</li>
          </ul>
        </div>
      </section>

      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Account Security</h2>
          <div class="sectionLine" />
        </div>

        <div class="policyContent">
          <p>
            When you create an account, you are responsible for maintaining the confidentiality of your credentials
            and for all activity that occurs under your account. Notify us immediately of any unauthorized use.
          </p>
        </div>
      </section>

      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Intellectual Property</h2>
          <div class="sectionLine" />
        </div>

        <div class="policyContent">
          <p>
            All content on the Site, including text, images, logos, and software, is the property of Einstein Bros or
            its licensors and is protected by intellectual property laws. You may not copy, reproduce, or create
            derivative works without prior written permission.
          </p>
        </div>
      </section>

      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Third-Party Services</h2>
          <div class="sectionLine" />
        </div>

        <div class="policyContent">
          <p>
            The Site may contain links or integrations with third-party services. We are not responsible for the
            availability or practices of those services.
          </p>
        </div>
      </section>

      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Disclaimer of Warranties</h2>
          <div class="sectionLine" />
        </div>

        <div class="policyContent">
          <p>
            THE SITE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. TO THE MAXIMUM EXTENT
            PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, WHETHER EXPRESS OR IMPLIED.
          </p>
        </div>
      </section>

      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Limitation of Liability</h2>
          <div class="sectionLine" />
        </div>

        <div class="policyContent">
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, EINSTEIN BROS SHALL NOT BE LIABLE FOR ANY INDIRECT,
            INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE SITE.
          </p>
        </div>
      </section>

      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Termination</h2>
          <div class="sectionLine" />
        </div>

        <div class="policyContent">
          <p>
            We may suspend or terminate your access for violations of these Terms or for other business reasons,
            without liability to you.
          </p>
        </div>
      </section>

      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Governing Law</h2>
          <div class="sectionLine" />
        </div>

        <div class="policyContent">
          <p>
            These Terms are governed by the laws of the State of Iowa, without regard to conflict of law principles.
          </p>
        </div>
      </section>

      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Changes to Terms</h2>
          <div class="sectionLine" />
        </div>

        <div class="policyContent">
          <p>
            We may update these Terms from time to time. Material changes will be posted with an updated "Last updated" date.
            Continued use after changes constitutes acceptance of the new Terms.
          </p>
        </div>
      </section>

      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Contact</h2>
          <div class="sectionLine" />
        </div>

        <div class="policyContent">
          <p>
            For questions about these Terms, contact us:
          </p>
          <div class="contactInfo">
            <p><strong>Einstein Bros Bagels - Loras College</strong></p>
            <p>Phone: (563) 588-7067</p>
            <p>Address: 1450 Alta Vista<br />Dubuque, IA 52001</p>
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

        <div v-if="cartItems.length === 0" class="emptyCart">
          No items yet. Use the <b>+</b> button to add items.
        </div>

        <ul v-else class="cartList">
          <li v-for="(item, idx) in cartItems" :key="idx" class="cartItem">
            <span class="cartItemName">{{ item }}</span>
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

const currentDate = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

// Location management
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
  if (!q) return locations.slice(0, 50);
  return locations.filter((x) => x.toLowerCase().includes(q)).slice(0, 8);
});

function selectLocation(opt) {
  location.value = opt;
  locationQuery.value = "";
  showLocationDropdown.value = false;
}

function handleDocClick(e) {
  const target = e.target;
  if (target?.closest?.(".locationWrap")) return;
  showLocationDropdown.value = false;
}

onMounted(() => document.addEventListener("click", handleDocClick));
onBeforeUnmount(() => document.removeEventListener("click", handleDocClick));

// Review
const showReview = ref(false);
const rating = ref(0);
const hoverRating = ref(0);
const comment = ref("");
const submitted = ref(false);
function toggleReview() { showReview.value = !showReview.value; }
function submitReview() { submitted.value = true; rating.value = 0; hoverRating.value = 0; comment.value = ""; setTimeout(() => (submitted.value = false), 2000); }

// Cart
const showCart = ref(false);
const cartItems = ref([]);

function toggleCart() {
  showCart.value = !showCart.value;
}

function goToCheckout() {
  showCart.value = false;
  navigateTo("/checkout");
}

function removeFromCart(index) {
  cartItems.value.splice(index, 1);
}
</script>

<style scoped>
/* reuse styles similar to other pages */
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

.topbarRight {
  display: flex;
  align-items: center;
  gap: 12px;
}

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
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.12);
  border-color: rgba(244, 179, 22, 0.5);
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

.reviewBtn {
  text-align: left;
  cursor: pointer;
}

.chev {
  float: right;
  opacity: 0.7;
  transform: rotate(0deg);
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
  transform: translateY(0);
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

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.topbarLeft {
  display: flex;
  align-items: center;
  gap: 14px;
}

/* Location */
.locationWrap {
  position: relative;
}

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
  overflow-x: hidden;
  background: #fff;
  border: 1px solid rgba(75, 52, 41, 0.14);
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
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

.locationOption:hover {
  background: rgba(244, 179, 22, 0.18);
}

.locationEmpty {
  padding: 10px;
  opacity: 0.75;
  font-weight: 800;
}

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

/* Hero section */
.hero {
  text-align: center;
  padding: 20px 0 30px;
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
  opacity: 0.65;
  font-weight: 800;
  font-size: 14px;
}

/* Sections */
.section {
  margin-top: 30px;
}

.sectionHeader {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}

.sectionTitle {
  margin: 0;
  font-size: 22px;
  font-weight: 900;
  color: var(--brown);
}

.sectionLine {
  height: 2px;
  flex: 1;
  background: linear-gradient(90deg, rgba(75, 52, 41, 0.25), rgba(75, 52, 41, 0));
}

.policyContent {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(75, 52, 41, 0.12);
  box-shadow: var(--cardShadow);
  line-height: 1.7;
}

.policyContent p {
  margin: 0 0 14px 0;
  opacity: 0.9;
}

.policyContent ul {
  margin: 0 0 14px 0;
  padding-left: 24px;
}

.policyContent li {
  margin: 8px 0;
  opacity: 0.85;
}

.contactInfo {
  background: rgba(244, 179, 22, 0.08);
  border-left: 4px solid var(--yellow);
  padding: 16px;
  border-radius: 8px;
  margin-top: 14px;
}

.contactInfo p {
  margin: 6px 0;
  font-weight: 800;
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

.cartList {
  flex: 1;
  overflow-y: auto;
  padding: 14px 0;
  margin: 0;
  list-style: none;
}

.cartItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(75, 52, 41, 0.12);
  border-radius: 14px;
  padding: 10px 10px;
  background: rgba(75, 52, 41, 0.03);
  margin-bottom: 8px;
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

/* Responsive */
@media (max-width: 980px) {
  .page {
    grid-template-columns: 220px 1fr;
  }
}

@media (max-width: 720px) {
  .page {
    grid-template-columns: 1fr;
  }
  .sidebar {
    position: sticky;
    top: 0;
    z-index: 10;
    border-right: none;
    border-bottom: 1px solid rgba(75, 52, 41, 0.12);
  }
  .locationInput {
    width: 150px;
  }
  .locationDropdown {
    min-width: 260px;
  }
  .main {
    padding: 16px 18px 40px;
  }
  .title {
    font-size: 32px;
  }
  .policyContent {
    padding: 16px;
  }
}
</style>
