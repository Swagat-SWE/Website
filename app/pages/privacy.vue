<!-- app/pages/privacy.vue -->
<template>
  <div class="page">
    <!-- Mobile overlay (tap to close drawer) -->
    <div
      v-if="mobileNavOpen"
      class="mobileOverlay"
      @click="closeMobileNav"
      aria-hidden="true"
    />

    <!-- Sidebar (desktop column, mobile drawer) -->
    <aside class="sidebar" :class="{ open: mobileNavOpen }">
      <div class="sidebarTop">
        <NuxtLink to="/" class="logoLink" aria-label="Main Page" @click="closeMobileNav">
          <img src="/Logo.png" alt="Einstein Bros Logo" class="logoImg" />
        </NuxtLink>

        <!-- Mobile close button inside drawer -->
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
        <NuxtLink class="navItem" to="/" @click="closeMobileNav">Main Page</NuxtLink>
        <NuxtLink class="navItem" to="/food" @click="closeMobileNav">Food Menu</NuxtLink>
        <NuxtLink class="navItem" to="/drinks" @click="closeMobileNav">Drinks Menu</NuxtLink>
        <NuxtLink class="navItem" to="/contact" @click="closeMobileNav">Contact</NuxtLink>

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

          <button class="primaryBtn" type="button" @click="submitReview">Submit</button>
          <p v-if="submitted" class="submitted">Thanks! Review saved locally.</p>
        </div>
      </nav>
    </aside>

    <!-- Main content area -->
    <main class="main">
      <!-- Mobile-only mini brand strip -->
      <div class="brandStrip" aria-hidden="true">
        <img class="brandStripLogo" src="/Logo.png" alt="Einstein Bros Logo" />
      </div>

      <!-- Top bar: hamburger (mobile) + spacer -->
      <header class="topbar">
        <button
          class="hamburgerBtn"
          type="button"
          @click="openMobileNav"
          aria-label="Open menu"
        >
          <span class="hamburgerIcon" aria-hidden="true">☰</span>
        </button>

        <div class="topbarSpacer"></div>
      </header>

      <!-- Privacy Policy Title -->
      <section class="hero">
        <h1 class="title">PRIVACY POLICY</h1>
        <p class="subtitle">Last updated: {{ currentDate }}</p>
      </section>

      <!-- Content Sections -->
      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Introduction</h2>
          <div class="sectionLine" />
        </div>

        <div class="policyContent">
          <p>
            Einstein Bros Bagels ("we," "us," "our," or "Company") respects the privacy of our
            customers and website visitors. This Privacy Policy explains how we collect, use,
            disclose, and safeguard your information when you visit our website and use our
            services.
          </p>
          <p>
            Please read this Privacy Policy carefully. If you do not agree with our policies and
            practices, please do not use our website.
          </p>
        </div>
      </section>

      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Information We Collect</h2>
          <div class="sectionLine" />
        </div>

        <div class="policyContent">
          <h3>Personal Information You Provide</h3>
          <ul>
            <li>Name, email address, and phone number</li>
            <li>Billing and delivery address</li>
            <li>Payment information</li>
            <li>Order history and preferences</li>
            <li>Account credentials and password</li>
            <li>Comments, reviews, and feedback</li>
            <li>Customer service inquiries and communications</li>
          </ul>

          <h3>Automatically Collected Information</h3>
          <ul>
            <li>Browser type and version</li>
            <li>IP address and device identifier</li>
            <li>Pages visited and time spent</li>
            <li>Cookies and similar tracking technologies</li>
            <li>Location data (with permission)</li>
            <li>Usage patterns and analytics</li>
          </ul>

          <h3>Third-Party Information</h3>
          <p>
            We may receive information about you from third parties, including payment processors,
            delivery partners, and social media platforms.
          </p>
        </div>
      </section>

      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">How We Use Your Information</h2>
          <div class="sectionLine" />
        </div>

        <div class="policyContent">
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process and fulfill your orders</li>
            <li>Send order confirmations and updates</li>
            <li>Provide customer service and support</li>
            <li>Personalize your experience</li>
            <li>Send promotional emails and offers (with consent)</li>
            <li>Improve our website and services</li>
            <li>Conduct market research and analytics</li>
            <li>Comply with legal obligations</li>
            <li>Prevent fraud and unauthorized access</li>
            <li>Enforce our Terms of Service</li>
          </ul>
        </div>
      </section>

      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Information Sharing & Disclosure</h2>
          <div class="sectionLine" />
        </div>

        <div class="policyContent">
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share
            your information with:
          </p>
          <ul>
            <li>Service providers (payment processors, delivery partners, hosting providers)</li>
            <li>Business partners for co-marketing initiatives</li>
            <li>Legal authorities when required by law</li>
            <li>Professional advisors (attorneys, accountants, auditors)</li>
            <li>Successors in case of merger, acquisition, or sale of assets</li>
          </ul>
          <p>
            All third parties are contractually obligated to use your information only as necessary
            to provide services and maintain confidentiality.
          </p>
        </div>
      </section>

      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Data Security</h2>
          <div class="sectionLine" />
        </div>

        <div class="policyContent">
          <p>We implement comprehensive security measures to protect your personal information, including:</p>
          <ul>
            <li>SSL encryption for data transmission</li>
            <li>Secure password protection</li>
            <li>Regular security audits and updates</li>
            <li>Access controls and authentication</li>
            <li>Secure data storage protocols</li>
          </ul>
          <p>
            However, no security system is impenetrable. We cannot guarantee absolute security of your
            information, and you transmit information at your own risk.
          </p>
        </div>
      </section>

      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Cookies & Tracking Technologies</h2>
          <div class="sectionLine" />
        </div>

        <div class="policyContent">
          <p>
            Our website uses cookies and similar tracking technologies to enhance your experience.
            You can control cookie settings through your browser preferences. Disabling cookies may
            affect some website functionality.
          </p>
          <p>
            We use Google Analytics and similar tools to understand user behavior and improve our
            services. These providers have their own privacy policies governing their data
            collection practices.
          </p>
        </div>
      </section>

      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Your Rights & Choices</h2>
          <div class="sectionLine" />
        </div>

        <div class="policyContent">
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt-out of marketing communications</li>
            <li>Request a copy of your data</li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us using the information in the "Contact
            Us" section below.
          </p>
        </div>
      </section>

      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Children's Privacy</h2>
          <div class="sectionLine" />
        </div>

        <div class="policyContent">
          <p>
            Our website is not intended for children under the age of 13. We do not knowingly
            collect personal information from children under 13. If we become aware that a child
            under 13 has provided us with personal information, we will promptly delete such
            information and terminate the child's account.
          </p>
        </div>
      </section>

      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Third-Party Links</h2>
          <div class="sectionLine" />
        </div>

        <div class="policyContent">
          <p>
            Our website may contain links to third-party websites. We are not responsible for the
            privacy practices or content of external websites. We encourage you to review the
            privacy policies of any third-party sites before providing your personal information.
          </p>
        </div>
      </section>

      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Policy Updates</h2>
          <div class="sectionLine" />
        </div>

        <div class="policyContent">
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices,
            technology, legal requirements, or other factors. We will notify you of material
            changes by posting the updated policy on our website and updating the "Last updated"
            date. Continued use of our website following notification constitutes your acceptance
            of the updated Privacy Policy.
          </p>
        </div>
      </section>

      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Contact Us</h2>
          <div class="sectionLine" />
        </div>

        <div class="policyContent">
          <p>
            If you have questions, concerns, or requests regarding this Privacy Policy or our
            privacy practices, please contact us:
          </p>
          <div class="contactInfo">
            <p><strong>Einstein Bros Bagels - Loras College</strong></p>
            <p>Phone: (563) 588-7067</p>
            <p>Address: 1450 Alta Vista<br />Dubuque, IA 52001</p>
          </div>
        </div>
      </section>

      <!-- Slide-out cart panel (kept for layout consistency, optional) -->
      <div class="overlay" v-if="showCart" @click="showCart = false" />
      <aside class="cartPanel" :class="{ open: showCart }" aria-label="Cart panel">
        <div class="cartHeader">
          <h3>Your Cart</h3>
          <button class="xBtn" type="button" @click="showCart = false">✕</button>
        </div>

        <div v-if="cartItems.length === 0" class="emptyCart">
          No items yet.
        </div>

        <ul v-else class="cartList">
          <li v-for="(item, idx) in cartItems" :key="idx" class="cartItem">
            <span class="cartItemName">{{ item }}</span>
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
import { ref } from "vue";

/** Mobile nav drawer */
const mobileNavOpen = ref(false);
function openMobileNav() {
  mobileNavOpen.value = true;
}
function closeMobileNav() {
  mobileNavOpen.value = false;
}

const currentDate = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

// Review management
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

// Cart management (simple placeholder)
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

/* Mobile overlay */
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

/* Hide sidebar logo on desktop/laptop (optional – matches what you did on Contact) */
@media (min-width: 721px) {
  .sidebarTop {
    display: none;
  }
}

/* Drawer close button (mobile only) */
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
  max-width: 980px; /* nicer reading width */
  margin: 0 auto;
}

/* Topbar */
.topbar {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
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
.topbarSpacer {
  height: 1px;
}

/* Hero */
.hero {
  text-align: center;
  padding: 12px 0 10px;
}
.title {
  margin: 0;
  font-size: 44px;
  letter-spacing: 2px;
  font-weight: 1000;
  color: var(--brown);
}
.subtitle {
  margin: 8px 0 0;
  opacity: 0.7;
  font-weight: 900;
  font-size: 14px;
}

/* Sections */
.section {
  margin-top: 22px;
}
.sectionHeader {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
}
.sectionTitle {
  margin: 0;
  font-size: 20px;
  font-weight: 1000;
  color: var(--brown);
}
.sectionLine {
  height: 2px;
  flex: 1;
  background: linear-gradient(90deg, rgba(75, 52, 41, 0.25), rgba(75, 52, 41, 0));
}

.policyContent {
  background: #fff;
  border-radius: 18px;
  padding: 22px;
  border: 1px solid rgba(75, 52, 41, 0.12);
  box-shadow: var(--cardShadow);
  line-height: 1.75;
  font-weight: 800;
}
.policyContent p {
  margin: 0 0 14px 0;
  opacity: 0.92;
}
.policyContent h3 {
  margin: 18px 0 8px 0;
  font-size: 16px;
  font-weight: 1000;
  color: var(--brown);
}
.policyContent ul {
  margin: 0 0 14px 0;
  padding-left: 22px;
}
.policyContent li {
  margin: 8px 0;
  opacity: 0.9;
}

.contactInfo {
  background: rgba(244, 179, 22, 0.1);
  border-left: 4px solid var(--yellow);
  padding: 14px;
  border-radius: 12px;
  margin-top: 12px;
}
.contactInfo p {
  margin: 6px 0;
  font-weight: 900;
}

/* Mini Brand Strip (mobile only) */
.brandStrip {
  display: none;
}
.brandStripLogo {
  display: block;
}

/* Cart slide-over (optional) */
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

/* ===== Responsive ===== */
@media (max-width: 980px) {
  .page {
    grid-template-columns: 220px 1fr;
  }
  .main {
    padding: 16px 16px 44px;
  }
  .title {
    font-size: 36px;
  }
}

/* Mobile: drawer sidebar + better reading */
@media (max-width: 720px) {
  .page {
    grid-template-columns: 1fr;
  }

  /* Mobile-only mini brand strip */
  .brandStrip {
    display: flex;
    height: 58px;
    background: #f6e28a;
    border-bottom: 1px solid rgba(75, 52, 41, 0.12);
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 22px rgba(0, 0, 0, 0.08);
    margin: -16px -16px 12px; /* matches .main padding */
    border-radius: 14px;
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

  /* let content breathe on phone */
  .main {
    padding: 16px 16px 44px;
    max-width: 100%;
  }
  .hero {
    padding: 8px 0 8px;
  }
  .title {
    font-size: 30px;
    letter-spacing: 1px;
  }
  .subtitle {
    font-size: 13px;
  }
  .sectionTitle {
    font-size: 18px;
  }
  .policyContent {
    padding: 16px;
    border-radius: 16px;
  }
  .policyContent ul {
    padding-left: 18px;
  }
}
</style>
