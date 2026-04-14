<!-- app/pages/index.vue -->
<template>
  <div class="page">
    <!-- Mobile dark overlay (tap to close) -->
    <div
      v-if="mobileNavOpen"
      class="mobileOverlay"
      @click="closeMobileNav"
      aria-hidden="true"
    />

    <!-- Sidebar (desktop fixed column, mobile slide-in drawer) -->
    <aside class="sidebar" :class="{ open: mobileNavOpen }" aria-label="Sidebar navigation">
      <div class="sidebarTop">
        <NuxtLink to="/" class="logoLink" aria-label="Main Page" @click="closeMobileNav">
          <img src="/Logo.png" alt="Einstein Bros Logo" class="logoImg" />
        </NuxtLink>

        <!-- Mobile close button inside drawer -->
        <button class="drawerCloseBtn" type="button" @click="closeMobileNav" aria-label="Close menu">
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

          <button class="primaryBtn" type="button" @click="submitReview">
            Submit
          </button>
          <p v-if="submitted" class="submitted">Thanks! Review saved locally.</p>
        </div>
      </nav>
    </aside>

    <!-- Logging out overlay -->
    <div v-if="isLoggingOut" class="verifyOverlay" role="status" aria-live="polite">
      <div class="verifyCard">
        <div v-if="!logoutDone" class="spinner" aria-hidden="true"></div>

        <div v-else class="tickWrap" aria-hidden="true">
          <svg class="tickSvg" viewBox="0 0 52 52">
            <circle class="tickCircle" cx="26" cy="26" r="24" />
            <path class="tickMark" d="M14 27 L22 35 L38 18" />
          </svg>
        </div>

        <div class="verifyText">
          {{ logoutDone ? "Success!" : "Logging Out" }}
        </div>
      </div>
    </div>

    <!-- Main content area -->
    <main class="main">
      <!-- Mobile-only mini brand strip -->
      <div class="brandStrip" aria-hidden="true">
        <img class="brandStripLogo" src="/Logo.png" alt="Einstein Bros Logo" />
      </div>
      <!-- Top bar -->
      <header class="topbar">
        <!-- Mobile hamburger (hidden on desktop) -->
        <button class="hamburgerBtn" type="button" @click="openMobileNav" aria-label="Open menu">
          <span class="hamburgerIcon" aria-hidden="true">☰</span>
        </button>

        <!-- Spacer (keeps layout same on desktop) -->
        <div class="topbarSpacer"></div>

        <!-- Topbar Right -->
        <div class="topbarRight">
          <div class="locationWrap">
            <button
              class="locationPill"
              type="button"
              @click.stop="showLocationDropdown = !showLocationDropdown"
              aria-label="Choose location"
            >
              <span class="pin">📍 Dubuque, IA</span>
              <span class="locationSelected">{{ location }}</span>
            </button>

            <div v-if="showLocationDropdown" class="locationDropdown">
              <input
                class="locationInput"
                v-model="locationQuery"
                placeholder="Search locations…"
                @input="showLocationDropdown = true"
              />
              <div v-if="filteredLocations.length === 0" class="locationEmpty">No matches</div>

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

          <!-- Account / Sign in -->
          <div class="accountWrap">
            <button
              class="signInBtn"
              type="button"
              @click="user ? toggleAccountMenu() : signIn()"
            >
              <template v-if="user">
                <span class="helloText">Hello, {{ user.username }}</span>
              </template>
              <template v-else>Sign In</template>
            </button>

            <div v-if="showAccountMenu" class="accountMenu">
              <button v-if="authType !== 'guest'" class="menuItem" @click="goProfile">My Profile</button>
              <button v-if="authType !== 'guest'" class="menuItem" @click="goOrders">My Orders</button>
              <button class="menuItem" @click="goTracking">Order Tracking</button>
              <div class="menuDivider"></div>
              <button class="menuItem danger" @click="logout">Logout</button>
            </div>
          </div>

          <button class="cartBtn" type="button" @click="toggleCart">
            <span class="cartIcon">🛒</span>
            <span class="cartCount">{{ cartCount }}</span>
          </button>
        </div>
      </header>

      <!-- Title -->
      <section class="hero">
        <h1 class="title">EINSTEIN BRO’S</h1>
      </section>

      <!-- Best Seller -->
      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Best Seller</h2>
          <div class="sectionLine" />
        </div>

        <div class="tileGrid">
          <article v-for="item in bestSellers" :key="item.id" class="tileCard">
            <div class="tileImg">
              <img :src="item.img" :alt="item.name" />
            </div>
            <div class="tileFooter">
              <div class="tileNameRow">
                <div class="namePrice">
                  <span class="tileName">{{ item.name }}</span>
                  <span v-if="item.price != null" class="pricePill">
                    ${{ Number(item.price).toFixed(2) }}
                  </span>
                </div>

                <button class="plusBtn" type="button" aria-label="Add to cart" @click="addToCart(item)">
                  +
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- Classics -->
      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Classics</h2>
          <div class="sectionLine" />
        </div>

        <div class="tileGrid">
          <article v-for="item in classics" :key="item.id" class="tileCard">
            <div class="tileImg">
              <img :src="item.img" :alt="item.name" />
            </div>

            <div class="tileFooter">
              <div class="tileNameRow">
                <div class="namePrice">
                  <span class="tileName">{{ item.name }}</span>
                  <span v-if="item.price != null" class="pricePill">
                    ${{ Number(item.price).toFixed(2) }}
                  </span>
                </div>

                <button class="plusBtn" type="button" aria-label="Add to cart" @click="addToCart(item)">
                  +
                </button>
              </div>
            </div>
          </article>
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
            <div class="cartThumb">
              <img v-if="item.img" :src="item.img" :alt="item.name" />
              <div v-else class="cartThumbFallback">PIC</div>
            </div>

            <div class="cartMeta">
              <div class="cartName">{{ item.name }}</div>
              <div class="cartSub">Qty: {{ item.qty }}</div>
            </div>

            <div class="cartRight">
              <div class="cartPrice">
                ${{
                  ((item.priceEach ?? item.basePrice ?? 0) * (item.qty || 1)).toFixed(2)
                }}
              </div>

              <button class="removeBtn" type="button" @click="removeFromCart(idx)">
                Remove
              </button>
            </div>
          </li>
        </ul>

        <button class="checkoutBtn" type="button" :disabled="cart.length === 0" @click="goToCheckout">Checkout</button>
      </aside>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useApi } from "~/composables/useApi";

const api = useApi();

const isLoggingOut = ref(false);
const logoutDone = ref(false);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Mobile nav */
const mobileNavOpen = ref(false);
function openMobileNav() {
  mobileNavOpen.value = true;
}
function closeMobileNav() {
  mobileNavOpen.value = false;
}

/** close mobile nav with ESC */
function handleKeydown(e) {
  if (e.key === "Escape") closeMobileNav();
}
onMounted(() => document.addEventListener("keydown", handleKeydown));
onBeforeUnmount(() => document.removeEventListener("keydown", handleKeydown));

function signIn() {
  navigateTo("/login");
}

const user = ref(null);
const authType = ref(null);
const showAccountMenu = ref(false);

function toggleAccountMenu() {
  showAccountMenu.value = !showAccountMenu.value;
}
function closeAccountMenu() {
  showAccountMenu.value = false;
}
function goProfile() {
  closeAccountMenu();
  navigateTo("/profile");
}
function goOrders() {
  closeAccountMenu();
  navigateTo("/ordering");
}

function goTracking() {
  closeAccountMenu();

  const lastOrderNumber = localStorage.getItem("lastOrderNumber");

  // ✅ If NO order number → go to empty state
  if (!lastOrderNumber) {
    localStorage.setItem("trackingState", "empty");
    navigateTo("/Tracking");
    return;
  }

  // ✅ If order exists → go with order
  navigateTo(`/Tracking?orderNumber=${lastOrderNumber}`);
}

async function logout() {
  closeAccountMenu();
  logoutDone.value = false;
  isLoggingOut.value = true;

  try {
    await api.post("/api/auth/logout", {});
    user.value = null;

    await sleep(1800);
    logoutDone.value = true;
    await sleep(600);

    window.location.reload();
  } catch (e) {
    isLoggingOut.value = false;
  }
}

async function checkAuth() {
  const data = await api.get("/api/me");
  if (data?.ok && data.user) {
    user.value = data.user;
    authType.value = data.type || null;
  } else {
    user.value = null;
    authType.value = null;
  }
}
onMounted(() => checkAuth());

onMounted(() => {
  const saved = localStorage.getItem("cart");
  if (saved) {
    cart.value = JSON.parse(saved);
  }
});

/** Location */
function selectLocation(opt) {
  location.value = opt;
  locationQuery.value = "";
  showLocationDropdown.value = false;
}

/** close dropdown if user clicks outside */
function handleDocClick(e) {
  const target = e.target;

  if (target?.closest?.(".accountWrap")) return;
  if (target?.closest?.(".locationWrap")) return;

  showLocationDropdown.value = false;
  showAccountMenu.value = false;
}
onMounted(() => document.addEventListener("click", handleDocClick));
onBeforeUnmount(() => document.removeEventListener("click", handleDocClick));

/** Sidebar Review */
const showReview = ref(false);
const rating = ref(0);
const hoverRating = ref(0);
const comment = ref("");
const submitted = ref(false);

function toggleReview() {
  showReview.value = !showReview.value;
}

async function submitReview() {
  if (!rating.value) {
    alert("Please select a rating");
    return;
  }

  try {
    const payload = {
      rating: rating.value,
      comment: comment.value,
    };

    // if logged in user
    if (user.value) {
      payload.userId = user.value.id;
    } else {
      payload.guestName = "Guest"; // or you can make this dynamic later
    }

    const res = await api.post("/api/reviews", payload);

    if (res?.ok) {
      submitted.value = true;

      rating.value = 0;
      hoverRating.value = 0;
      comment.value = "";

      setTimeout(() => (submitted.value = false), 2000);
    } else {
      alert(res?.message || "Failed to submit review");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
}

/** Cart */
const showCart = ref(false);
const cart = ref([]);

watch(cart, (newCart) => {
  localStorage.setItem("cart", JSON.stringify(newCart));
}, { deep: true });
const cartCount = computed(() => cart.value.reduce((sum, item) => sum + (item.qty || 1), 0));

function toggleCart() {
  showCart.value = !showCart.value;
}
function goToCheckout() {
  showCart.value = false;
  navigateTo("/checkout");
}

/** MENU DATA */
const MENU = [
  { id: 1, name: "Farm House Egg Sandwich", price: 6.99, calories: "680/770", bagel: "Cheesy Hash", ingredients: ["Eggs", "Bacon", "Smoked Ham", "Cheddar Cheese", "Country Pepper Shmear"], img: "/Farmhouse.png" },
  { id: 3, name: "All Nighter Egg Sandwich", price: 6.99, calories: "900", bagel: "Cheesy Hash", ingredients: ["Eggs", "Bacon", "American Cheese", "Chipotle Aioli"], img: "/AllNIght.png" },
  { id: 2, name: "Garden Avocado Egg Sandwich", price: 6.39, calories: "510/600", bagel: "Everything", ingredients: ["Eggs", "Avocado", "Tomato", "Spinach", "Roasted Tomato Spread"], img: "/Garden.png" },
  { id: 4, name: "Breakfast Burrito", price: 7.49, calories: "1200", bagel: "Tortilla", ingredients: ["Eggs", "Bacon", "Turkey Sausage", "Shredded Cheese", "Green Chiles", "Hash Brown"], img: "/Burrito.png" },
  { id: 5, name: "B.A.T.", price: 6.59, calories: "400/440", bagel: "Plain Thin", ingredients: ["Egg Whites", "Bacon", "Avocado", "Tomato", "Roasted Tomato Spread"], img: "/BAT.png" },
  { id: 6, name: "Santa Fe", price: 6.59, calories: "420/460", bagel: "Asiago Thin", ingredients: ["Egg Whites", "Turkey Sausage", "Cheddar", "Salsa", "Jalapeno Shmear"], img: "/SantaFe.png" },
  { id: 7, name: "Nova Lox", price: 8.29, calories: "500", bagel: "Plain", ingredients: ["Nova Lox", "Red Onion", "Capers", "Tomato", "Plain Shmear"], img: "/Nova.png" },
  { id: 8, name: "T.B.A.", price: 7.99, calories: "580", bagel: "Ciabatta", ingredients: ["Turkey", "Bacon", "Avocado", "Lettuce", "Tomato", "Roasted Tomato Spread"], img: "/TBA.png" },
  { id: 9, name: "Tasty Turkey", price: 7.79, calories: "510", bagel: "Asiago", ingredients: ["Turkey", "Spinach", "Cucumber", "Lettuce", "Tomato", "Onion"], img: "/Tastey.png" },
  { id: 10, name: "Avocado Veg Out", price: 7.29, calories: "410", bagel: "Sesame", ingredients: ["Avocado", "Tomato", "Cucumber", "Red Onion", "Spinach", "Lettuce"], img: "/Veg.png" },
  { id: 11, name: "Albuquerque Turkey", price: 7.59, calories: "680", bagel: "6 Cheese", ingredients: ["Turkey", "Bacon", "Cheddar", "Lettuce", "Tomato", "Green Chiles"], img: "/Albuquerque.png" },
  { id: 12, name: "Pepperoni Chicken", price: 7.59, calories: "680", bagel: "Ciabatta", ingredients: ["Pepperoni", "Swiss", "Asiago", "Red Onion", "Spinach", "Roasted Tomato Spread"], img: "/Pepperoni.png" },
  { id: 13, name: "Spicy Chicken", price: 7.59, calories: "620", bagel: "Ciabatta", ingredients: ["Chicken", "Bacon", "Cheddar", "Jalapenos", "Red Onion", "Jalapeno Shmear"], img: "/Spicy.png" },
  { id: 14, name: "Cheesy Veggie Melt", price: 7.09, calories: "610", bagel: "Ciabatta", ingredients: ["Cheddar", "Swiss", "Tomato", "Spinach", "Roasted Tomato Spread"], img: "/Cheesy.png" },
];

function addToCart(input) {
  const menuItem =
    typeof input === "string"
      ? MENU.find((m) => m.name === input) || { name: input, price: 0 }
      : input;

  const existing = cart.value.find((x) => x.name === menuItem.name);

  if (existing) existing.qty += 1;
  else {
    cart.value.push({
      name: menuItem.name,
      type: "sandwich",
      qty: 1,
      img: menuItem.img,
      basePrice: menuItem.price,
      priceEach: menuItem.price,
      custom: null,
    });
  }

  showCart.value = true;
}

/** remove */
function removeFromCart(index) {
  cart.value.splice(index, 1);
}

/** Page content */
const bestSellers = ref([
  { id: 1, name: "Farm House Egg Sandwich", price: 7.19, img: "/Farmhouse.png" },
  { id: 2, name: "All Nighter Egg Sandwich", price: 6.99, img: "/AllNIght.png" },
  { id: 3, name: "Garden Avocado Egg Sandwich", price: 6.39, img: "/Garden.png" },
]);

const classics = ref([
  { id: "c1", name: "Tastey Turkey Sandwich", price: 7.99, img: "/Tastey.png" },
  { id: "c2", name: "Avocado Veg Out Sandwich", price: 7.54, img: "/Veg.png" },
  { id: "c3", name: "Nova Lox Sandwich", price: 8.49, img: "/Nova.png" },
  { id: "c4", name: "Nova Lux Brunch Special", price: 9.29, img: "/Special.png" },
  { id: "c5", name: "Ham & Swiss Sandwich", price: 7.99, img: "/Ham.png" },
  { id: "c6", name: "Turkey, Bacon & Avacado Sandwich", price: 7.49, img: "/TT.png" },
]);
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

/* ===== Layout ===== */
.page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr;
  background: linear-gradient(180deg, var(--cream2), var(--cream));
  color: var(--brown);
}

/* ===== Mobile overlay for drawer ===== */
.mobileOverlay {
  display: none;
}

/* ===== Sidebar ===== */
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

/* ===== Main ===== */
.main {
  position: relative;
  padding: 20px 26px 50px;
}

.topbar {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

/* hamburger (mobile only) */
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
  min-height: 1px;
}

.topbarRight {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}

.signInBtn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(75, 52, 41, 0.12);
  background: #fff;
  border-radius: 16px;
  padding: 8px 14px;
  min-height: 44px;
  font-size: 15px;
  font-weight: 800;
  color: var(--brown);
  cursor: pointer;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.08);
  transition: all 0.15s ease;
}
.signInBtn:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  border-color: rgba(244, 179, 22, 0.5);
}

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
  cursor: pointer;
}

.locationSelected {
  opacity: 0.75;
  font-weight: 900;
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

.locationInput {
  width: 100%;
  border: 1px solid rgba(75, 52, 41, 0.18);
  outline: none;
  background: #fff;
  font: inherit;
  font-weight: 900;
  color: var(--brown);
  border-radius: 12px;
  padding: 10px 12px;
  margin-bottom: 8px;
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
  background: #f4a51c; /* 🔥 hard-coded orange */
  color: #111;
  font-weight: 900;
  display: grid;
  place-items: center;
  border: 2px solid #fff;
  font-size: 12px;
}

/* Hero */
.hero {
  text-align: center;
  padding: 8px 0 12px;
}
.title {
  margin: 0;
  font-size: 44px;
  letter-spacing: 2px;
  font-weight: 900;
  color: var(--brown);
}

/* Sections */
.section {
  margin-top: 26px;
}
.sectionHeader {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
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

/* tiles */
.tileGrid {
  display: grid;
  grid-template-columns: repeat(3, minmax(240px, 1fr));
  gap: 18px;
  align-items: start;
}

.tileCard {
  background: transparent;
}

.tileImg {
  width: 80%;
  aspect-ratio: 1 / 1;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: var(--cardShadow);
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: #fff;
}

.tileImg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.tileFooter {
  padding-top: 10px;
}

.tileNameRow {
  display: flex;
  align-items: center;
  gap: 10px;
}

.namePrice {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  max-width: 260px;
}

.tileName {
  font-size: 18px;
  font-weight: 1000;
  color: var(--brown);
  letter-spacing: 0.2px;
}

.pricePill {
  flex: 0 0 auto;
  background: #111;
  color: #fff;
  font-weight: 1000;
  font-size: 13px;
  padding: 6px 10px;
  border-radius: 999px;
  letter-spacing: 0.3px;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* plus btn */
.plusBtn {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: var(--orange);
  color: #111;
  font-weight: 1000;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  display: grid;
  place-items: center;
  box-shadow: 0 8px 18px rgba(244, 165, 28, 0.25);
}
.plusBtn:hover {
  background: var(--orangeHover);
}

/* cart */
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
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;
}

.cartItem {
  display: grid;
  grid-template-columns: 64px 1fr auto;
  gap: 12px;
  align-items: center;
  border: 1px solid rgba(75, 52, 41, 0.12);
  border-radius: 16px;
  padding: 10px;
  background: rgba(75, 52, 41, 0.03);
}

.cartThumb {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: #fff;
  display: grid;
  place-items: center;
}

.cartThumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cartThumbFallback {
  font-weight: 1000;
  opacity: 0.6;
  font-size: 12px;
}

.cartMeta {
  min-width: 0;
}

.cartName {
  font-weight: 1000;
  font-size: 14px;
  line-height: 1.2;
}

.cartSub {
  margin-top: 4px;
  font-weight: 900;
  opacity: 0.7;
  font-size: 12px;
}

.cartRight {
  display: grid;
  justify-items: end;
  gap: 6px;
}

.cartPrice {
  font-weight: 1000;
  font-size: 14px;
}

.removeBtn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 900;
  color: var(--brown2);
  opacity: 0.9;
  padding: 0;
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

.checkoutBtn:disabled {
  background: #ccc;
  color: #666;
  cursor: not-allowed;
}

/* account dropdown */
.accountWrap {
  position: relative;
}

.accountMenu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 200px;
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

.menuDivider {
  height: 1px;
  margin: 6px 0;
  background: rgba(75, 52, 41, 0.12);
}

.menuItem.danger {
  color: #b00020;
}
.menuItem.danger:hover {
  background: rgba(176, 0, 32, 0.08);
}

/* ===== Logout overlay ===== */
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
.brandStrip {
  display: none; /* hidden on desktop */
}
.brandStripLogo {
  display: block;
}
/* ===== Responsive ===== */
@media (max-width: 980px) {
  .page {
    grid-template-columns: 220px 1fr;
  }

  .tileGrid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    align-items: start;
  }

  .tileImg {
    width: 100%;
  }
}

@media (max-width: 720px) {
  .page {
    grid-template-columns: 1fr;
  }

  /* Topbar mobile layout */
  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    flex-wrap: wrap;
  }

  .hamburgerBtn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .topbarRight {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr auto auto; /* location | sign in | cart */
    gap: 10px;
    align-items: center;
  }

  .locationPill {
    width: 100%;
    max-width: 100%;
    justify-content: flex-start;
  }

  .locationSelected {
    display: block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .signInBtn {
    padding: 8px 10px;
    border-radius: 14px;
    font-size: 14px;
  }

  .cartBtn {
    padding: 9px 10px;
    border-radius: 14px;
  }

  /* Mobile drawer behavior */
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


  .tileCard {
    width: 100%;
  }

  .tileImg {
    width: 100%;
  }

  .locationDropdown {
    width: min(320px, 86vw);
  }
  /* Smaller image container on mobile */
  .tileImg {
    width: 100%;
    margin: 0;
    aspect-ratio: 1 / 1;   /* keep it square like the pretty grid */
  }

   /* Mobile: Name wraps, but Price + Plus stay on same line */
  .tileNameRow {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto;   /* price left | plus right */
  grid-template-rows: auto auto;     /* name row | price row */
  column-gap: 10px;
  row-gap: 8px;
  align-items: start;
  }

  .tileName {
    grid-row: 1;
  }

  .pricePill {
  grid-column: 1;
  grid-row: 2;
  justify-self: start;
  font-size: 12px;
  padding: 5px 9px;
  }

  .plusBtn {
    grid-column: 2;
    grid-row: 2;
    justify-self: end;
    align-self: center;
  
    width: 28px;
    height: 28px;
    font-size: 18px;
    border-radius: 9px;
  }
/* 
  .tileName {
  grid-column: 1 / -1;              span full width
  grid-row: 1;
  font-size: 13px;
  line-height: 1.15;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}   */


  
  /* Mobile: Name on top, then Price + Plus on same row */
.tileFooter {
  padding-top: 6px;
  width: 100%;
}

.tileNameRow {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto; /* left (price) | right (+) */
  grid-template-rows: auto auto;   /* row1: name | row2: price/+ */
  column-gap: 10px;
  row-gap: 8px;
  align-items: start;
}

/* magic: makes the children behave as if they are direct kids of tileNameRow */
.namePrice {
  display: contents;
}

.tileName {
  grid-column: 1 / -1; /* span full width */
  grid-row: 1;
  font-size: 13px;
  line-height: 1.15;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.pricePill {
  grid-column: 1;
  grid-row: 2;
  justify-self: start;
  font-size: 12px;
  padding: 5px 9px;
}

.plusBtn {
  grid-column: 2;
  grid-row: 2;
  justify-self: end;
  align-self: center;

  width: 28px;
  height: 28px;
  font-size: 18px;
  border-radius: 9px;
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

  /* match your .main padding on mobile */
  margin: -14px -14px 12px;
}

.brandStripLogo{
  height: 38px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 6px 10px rgba(0,0,0,0.12));
}

}
</style>
