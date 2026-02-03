<!-- app/pages/index.vue -->
<template>
  <div class="page">
    <!-- Left Sidebar -->
    <aside class="sidebar">
      <div class="sidebarTop">

        <img src="/Logo.png" alt="Einstein Bros Logo" class="logoImg" />
      </div>

      <nav class="nav">
        <NuxtLink class="navItem" to="/">Home Page</NuxtLink>
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
      <!-- Top bar: Location (simple prototype) + Cart -->
      <header class="topbar">
        <div class="topbarLeft">
          <div class="locationWrap">
            <div class="locationPill">
              <span class="pin">📍</span>

              <!-- Always-visible search input -->
              <input
                v-model="locationQuery"
                class="locationInput"
                type="text"
                placeholder="Search a city…"
                @focus="showLocationDropdown = true"
                @input="showLocationDropdown = true"
              />

              <!-- Show selected location (like a “result”) -->
              <span class="locationSelected">{{ location }}</span>
            </div>

            <!-- Suggestions dropdown -->
            <div v-if="showLocationDropdown" class="locationDropdown">
              <div v-if="filteredLocations.length === 0" class="locationEmpty">
                No matches. Try “Chicago” or “Boston”.
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
          <!-- Sign In button -->
          <button class="signInBtn" type="button">
            Sign In
          </button>

          <!-- Cart button -->
          <button class="cartBtn" type="button" @click="toggleCart" aria-label="Cart">
            <span class="cartIcon">🛒</span>
            <span class="cartCount">{{ cartItems.length }}</span>
          </button>
        </div>
        </header>

      <!-- Title -->
      <section class="hero">
        <h1 class="title">Food Selection</h1>
      </section>

      <!-- Breakfest -->
      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Breakfast</h2>
          <div class="sectionLine" />
        </div>

        <!-- Einstein-style image tiles (3 across) -->
        <div class="tileGrid">
          <article v-for="item in Breakfest" :key="item.id" class="tileCard">
            <div class="tileImg">
              <img :src="item.img" :alt="item.name" />
            </div>
            <div class="tileFooter">
              <div class="tileNameRow">
                <span class="tileName">{{ item.name }}</span>

                <!-- ONLY this button adds to cart -->
                <button class="plusBtn" type="button" aria-label="Add to cart" @click="addToCart(item.name)">
                  +
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- Lunch -->
      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Lunch</h2>
          <div class="sectionLine" />
        </div>

        <div class="tileGrid">
          <article v-for="item in Lunch" :key="item.id" class="tileCard">
            <div class="tileImg">
              <img :src="item.img" :alt="item.name" />
            </div>
            <div class="tileFooter">
              <div class="tileNameRow">
                <span class="tileName">{{ item.name }}</span>

                <button class="plusBtn" type="button" aria-label="Add to cart" @click="addToCart(item.name)">
                  +
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- Bagels -->
      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Bagels</h2>
          <div class="sectionLine" />
        </div>

        <div class="tileGrid">
          <article v-for="item in Bagels" :key="item.id" class="tileCard">
            <div class="tileImg">
              <img :src="item.img" :alt="item.name" />
            </div>
            <div class="tileFooter">
              <div class="tileNameRow">
                <span class="tileName">{{ item.name }}</span>

                <button class="plusBtn" type="button" aria-label="Add to cart" @click="addToCart(item.name)">
                  +
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- Smears -->
      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Smears</h2>
          <div class="sectionLine" />
        </div>

        <div class="tileGrid">
          <article v-for="item in Smears" :key="item.id" class="tileCard">
            <div class="tileImg">
              <img :src="item.img" :alt="item.name" />
            </div>
            <div class="tileFooter">
              <div class="tileNameRow">
                <span class="tileName">{{ item.name }}</span>

                <button class="plusBtn" type="button" aria-label="Add to cart" @click="addToCart(item.name)">
                  +
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- Other -->
      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Other</h2>
          <div class="sectionLine" />
        </div>

        <div class="tileGrid">
          <article v-for="item in Other" :key="item.id" class="tileCard">
            <div class="tileImg">
              <img :src="item.img" :alt="item.name" />
            </div>
            <div class="tileFooter">
              <div class="tileNameRow">
                <span class="tileName">{{ item.name }}</span>

                <button class="plusBtn" type="button" aria-label="Add to cart" @click="addToCart(item.name)">
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

/** =========================
 *  Location prototype (simple)
 *  ========================= */
const location = ref("Dubuque, IA");
const locationQuery = ref("");
const showLocationDropdown = ref(false);

const locations = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
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

/** close dropdown if user clicks outside */
function handleDocClick(e) {
  const target = e.target;
  if (target?.closest?.(".locationWrap")) return;
  showLocationDropdown.value = false;
}

onMounted(() => {
  document.addEventListener("click", handleDocClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleDocClick);
});

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
  // show message
  submitted.value = true;

  // reset the form
  rating.value = 0;
  hoverRating.value = 0;
  comment.value = "";

  // optional: close the review panel after submit
  // showReview.value = false;

  setTimeout(() => (submitted.value = false), 2000);
}


/** =========================
 *  Cart
 *  ========================= */
const showCart = ref(false);
const cartItems = ref([]);

function toggleCart() {
  showCart.value = !showCart.value;
}

function goToCheckout() {
  showCart.value = false;        // optional: close the cart
  navigateTo("/checkout");       // or "/Checkout" depending on your filename
}

function addToCart(name) {
  cartItems.value.push(name);
  showCart.value = true;
}

function removeFromCart(index) {
  cartItems.value.splice(index, 1);
}

/** =========================
 *  Page Content (images)
 *  Replace URLs later with your own images in /public
 *  ========================= */
const Breakfest = ref([
  {
    id: "bs1",
    name: "Farm House Egg Sandwich",
    img: "/Farmhouse.png",
  },
  {
    id: "bs2",
    name: "All Nighter Egg Sandwich",
    img: "/AllNight.png",
  },
  {
    id: "bs3",
    name: "Garden Avacado Egg Sandwich",
    img: "/Garden.png",
  },
  {
    id: "bs4",
    name: "Bacon Chedder Egg Sandwich",
    img: "/Farmhouse.png",
  },
  {
    id: "bs5",
    name: "Chedder Egg Sandwich",
    img: "/AllNight.png",
  },
  {
    id: "bs6",
    name: "Ham Swiss Egg Sandwich",
    img: "/Garden.png",
  },
  {
    id: "bs7",
    name: "Turky Sausage Egg Sandwich",
    img: "/Farmhouse.png",
  },
  {
    id: "bs8",
    name: "Bacon Avocoado Tomato Sandwich",
    img: "/AllNight.png",
  },
  {
    id: "bs9",
    name: "Stanta Fe Egg White Sandwich",
    img: "/Garden.png",
  },
  {
    id: "bs10",
    name: "Texas Brisket Egg Sandwich",
    img: "/Farmhouse.png",
  },
]);

const Lunch = ref([
  {
    id: "l1",
    name: "Tastey Turkey Sandwich",
    img: "/Tastey.png",
  },
  {
    id: "l2",
    name: "Avacado Veg Out Sandwich",
    img: "/Veg.png",
  },
  {
    id: "l3",
    name: "Nova Lox Sandwich",
    img: "/Nova.png",
  },
  {
    id: "l4",
    name: "Nova Lux Brunch Special",
    img: "/Special.png",
  },
  {
    id: "l5",
    name: "Ham & Swiss Sandwich",
    img: "/Ham.png",
  },
  {
    id: "l6",
    name: "Turkey, Bacon & Avacado Sandwich",
    img: "/TT.png",
  },
]);
const Bagels = ref([
  {
    id: "c1",
    name: "Plain Bagel",
    img: "/Tastey.png",
  },
  {
    id: "c2",
    name: "Cinnamon Rasin Bagel",
    img: "/Veg.png",
  },
  {
    id: "c3",
    name: "Everything Bagel",
    img: "/Nova.png",
  },
  {
    id: "c4",
    name: "Ancient Grain Bagel",
    img: "/Special.png",
  },
  {
    id: "c5",
    name: "Sesame Seed Bagel",
    img: "/Ham.png",
  },
  {
    id: "c6",
    name: "Cheesy Hashbrown Bagel",
    img: "/TT.png",
  },
    {
    id: "c7",
    name: "Six Cheese Bagel",
    img: "/Tastey.png",
  },
  {
    id: "c8",
    name: "Aisago Bagle",
    img: "/Veg.png",
  },
  {
    id: "c9",
    name: "Blueberry Bagel",
    img: "/Nova.png",
  },
  {
    id: "c10",
    name: "Chocolate Chip Bagel",
    img: "/Special.png",
  },
]);
const Smears = ref([
  {
    id: "s1",
    name: "Tastey Turkey Sandwich",
    img: "/Tastey.png",
  },
  {
    id: "s2",
    name: "Avacado Veg Out Sandwich",
    img: "/Veg.png",
  },
  {
    id: "s3",
    name: "Nova Lox Sandwich",
    img: "/Nova.png",
  },
  {
    id: "s4",
    name: "Nova Lux Brunch Special",
    img: "/Special.png",
  },
  {
    id: "s5",
    name: "Ham & Swiss Sandwich",
    img: "/Ham.png",
  },
  {
    id: "s6",
    name: "Turkey, Bacon & Avacado Sandwich",
    img: "/TT.png",
  },
]);
const Other = ref([
  {
    id: "o1",
    name: "Cinnamon Chip Muffin",
    img: "/Tastey.png",
  },
  {
    id: "o2",
    name: "Cinnamon Bliss Rolls",
    img: "/Veg.png",
  },
  {
    id: "o3",
    name: "Blueberry Muffin",
    img: "/Nova.png",
  },
  {
    id: "o4",
    name: "Chocolate Chip Cooke",
    img: "/Special.png",
  },
  {
    id: "o5",
    name: "Twice Baked Hashbrown",
    img: "/Ham.png",
  },
]);
</script>

<style scoped>
/* Einstein-ish warm palette */
:root {
  --cream: #f6f0e8;
  --cream2: #fbf8f3;
  --brown: #4b3429;
  --brown2: #6a4a3a;

  /* Your plus button orange */
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
  box-shadow: 0 10px 26px rgba(0,0,0,0.12);
  border-color: rgba(244, 179, 22, 0.5);
}

.logoImg {
  width: 100%;
  max-width: 160px;   /* controls how big it can get */
  height: auto;
  display: block;
  object-fit: contain;
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
  justify-content: center;  /* centers the logo */
  margin-bottom: 14px;
  overflow: hidden;         /* prevents it from spilling */
}

.dotsBtn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid rgba(75, 52, 41, 0.18);
  background: #fff;
  display: grid;
  place-items: center;
  gap: 3px;
  padding: 8px;
  cursor: pointer;
}

.dot {
  width: 5px;
  height: 5px;
  border-radius: 99px;
  background: var(--brown);
  opacity: 0.9;
}

.badge {
  font-weight: 800;
  font-size: 0.9rem;
  color: var(--brown);
  background: rgba(244, 179, 22, 0.22);
  border: 1px solid rgba(244, 179, 22, 0.35);
  padding: 8px 10px;
  border-radius: 12px;
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

/* Location (simple prototype) */
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

/* dropdown container */
.locationDropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;

  width: 320px;
  max-height: 312px;       /* fixed box height */
  overflow-y: auto;       /* scroll */
  overflow-x: hidden;

  background: #fff;
  border: 1px solid rgba(75, 52, 41, 0.14);
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  padding: 8px;

  z-index: 50;
}

/* each row */
.locationOption {
  width: 100%;
  height: 44px;           /* fixed row height */
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

.subtitle {
  margin: 8px 0 0;
  opacity: 0.75;
  font-weight: 800;
}

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

/* === Einstein-style big tiles === */
.tileGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  align-items: start;
}


.tileCard {
  background: transparent;
}

.tileImg {
  width: 80%;
  aspect-ratio: 1 / 1;      /* ✅ makes the box the same shape (square like Einstein tiles) */
  border-radius: 22px;
  overflow: hidden;         /* ✅ prevents overflow outside rounded corners */
  box-shadow: var(--cardShadow);
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: #fff;
}

.tileImg img {
  width: 100%;
  height: 100%;
  object-fit: cover;        /* ✅ fills the box perfectly */
  display: block;
}

.tileFooter {
  padding-top: 10px;
}

.tileNameRow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.tileName {
  font-size: 18px;
  font-weight: 1000;
  color: var(--brown);
  letter-spacing: 0.2px;
}

/* Orange + button */
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
  .tileGrid {
    grid-template-columns: 1fr;
  }
  .locationInput {
    width: 150px;
  }
  .locationDropdown {
    min-width: 260px;
  }
}
</style>
