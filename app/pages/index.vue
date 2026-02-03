<!-- app/pages/index.vue -->
<template>
  <div class="page">
    <!-- Left Sidebar -->
    <aside class="sidebar">
      <div class="sidebarTop">

        <img src="/Logo.png" alt="Einstein Bros Logo" class="logoImg" />
      </div>

      <nav class="nav">
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

        <!-- Einstein-style image tiles (3 across) -->
        <div class="tileGrid">
          <article v-for="item in bestSellers" :key="item.id" class="tileCard">
            <div class="tileImg">
              <img :src="item.img" :alt="item.name" />
            </div>
            <div class="tileFooter">
              <div class="tileNameRow">
                <div class="namePrice">
                  <span class="tileName">{{ item.name }}</span>
                  <span class="tilePrice">${{ item.price.toFixed(2) }}</span>
                </div>

                <!-- ONLY this button adds to cart -->
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

// ===== MENU DATA (from our excel) =====
const MENU = [
  {
    id: 1,
    name: "Farm House Egg Sandwich",
    price: 6.99,
    calories: "680/770",
    bagel: "Cheesy Hash",
    ingredients: ["Eggs", "Bacon", "Smoked Ham", "Cheddar Cheese", "Country Pepper Shmear"],
    img: "/Farmhouse.png",
  },
  {
    id: 3,
    name: "All Nighter Egg Sandwich",
    price: 6.99,
    calories: "900",
    bagel: "Cheesy Hash",
    ingredients: ["Eggs", "Bacon", "American Cheese", "Chipotle Aioli"],
    img: "/AllNIght.png",
  },
  {
    id: 2,
    name: "Garden Avocado Egg Sandwich",
    price: 6.39,
    calories: "510/600",
    bagel: "Everything",
    ingredients: ["Eggs", "Avocado", "Tomato", "Spinach", "Roasted Tomato Spread"],
    img: "/Garden.png",
  },
  {
    id: 4,
    name: "Breakfast Burrito",
    price: 7.49,
    calories: "1200",
    bagel: "Tortilla",
    ingredients: ["Eggs", "Bacon", "Turkey Sausage", "Shredded Cheese", "Green Chiles", "Hash Brown"],
    img: "/Burrito.png",
  },
  {
    id: 5,
    name: "B.A.T.",
    price: 6.59,
    calories: "400/440",
    bagel: "Plain Thin",
    ingredients: ["Egg Whites", "Bacon", "Avocado", "Tomato", "Roasted Tomato Spread"],
    img: "/BAT.png",
  },
  {
    id: 6,
    name: "Santa Fe",
    price: 6.59,
    calories: "420/460",
    bagel: "Asiago Thin",
    ingredients: ["Egg Whites", "Turkey Sausage", "Cheddar", "Salsa", "Jalapeno Shmear"],
    img: "/SantaFe.png",
  },
  {
    id: 7,
    name: "Nova Lox",
    price: 8.29,
    calories: "500",
    bagel: "Plain",
    ingredients: ["Nova Lox", "Red Onion", "Capers", "Tomato", "Plain Shmear"],
    img: "/Nova.png",
  },
  {
    id: 8,
    name: "T.B.A.",
    price: 7.99,
    calories: "580",
    bagel: "Ciabatta",
    ingredients: ["Turkey", "Bacon", "Avocado", "Lettuce", "Tomato", "Roasted Tomato Spread"],
    img: "/TBA.png",
  },
  {
    id: 9,
    name: "Tasty Turkey",
    price: 7.79,
    calories: "510",
    bagel: "Asiago",
    ingredients: ["Turkey", "Spinach", "Cucumber", "Lettuce", "Tomato", "Onion"],
    img: "/Tastey.png",
  },
  {
    id: 10,
    name: "Avocado Veg Out",
    price: 7.29,
    calories: "410",
    bagel: "Sesame",
    ingredients: ["Avocado", "Tomato", "Cucumber", "Red Onion", "Spinach", "Lettuce"],
    img: "/Veg.png",
  },
  {
    id: 11,
    name: "Albuquerque Turkey",
    price: 7.59,
    calories: "680",
    bagel: "6 Cheese",
    ingredients: ["Turkey", "Bacon", "Cheddar", "Lettuce", "Tomato", "Green Chiles"],
    img: "/Albuquerque.png",
  },
  {
    id: 12,
    name: "Pepperoni Chicken",
    price: 7.59,
    calories: "680",
    bagel: "Ciabatta",
    ingredients: ["Pepperoni", "Swiss", "Asiago", "Red Onion", "Spinach", "Roasted Tomato Spread"],
    img: "/Pepperoni.png",
  },
  {
    id: 13,
    name: "Spicy Chicken",
    price: 7.59,
    calories: "620",
    bagel: "Ciabatta",
    ingredients: ["Chicken", "Bacon", "Cheddar", "Jalapenos", "Red Onion", "Jalapeno Shmear"],
    img: "/Spicy.png",
  },
  {
    id: 14,
    name: "Cheesy Veggie Melt",
    price: 7.09,
    calories: "610",
    bagel: "Ciabatta",
    ingredients: ["Cheddar", "Swiss", "Tomato", "Spinach", "Roasted Tomato Spread"],
    img: "/Cheesy.png",
  },
];


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
const cart = useState("cart", () => []);
const cartCount = computed(() =>
  cart.value.reduce((sum, item) => sum + (item.qty || 1), 0)
)


function toggleCart() {
  showCart.value = !showCart.value;
}

function goToCheckout() {
  showCart.value = false;        // optional: close the cart
  navigateTo("/checkout");       // or "/Checkout" depending on your filename
}

function addToCart(input) {
  // allow passing either the whole object OR just a name string
  const menuItem =
    typeof input === "string"
      ? MENU.find((m) => m.name === input) || { name: input, price: 0 }
      : input;

  const existing = cart.value.find((x) => x.name === menuItem.name);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.value.push({
      name: menuItem.name,
      qty: 1,
      img: menuItem.img,
      basePrice: menuItem.price,
      priceEach: menuItem.price,
      custom: null,
    });
  }

  showCart.value = true;
}



function removeFromCart(index) {
  cart.value.splice(index, 1)
}

/** =========================
 *  Page Content (images)
 *  Replace URLs later with your own images in /public
 *  ========================= */
// ===== Best Sellers (from MENU) =====
const bestSellers = ref([
  {
    id: 1,
    name: "Farm House Egg Sandwich",
    price: 6.99,
    img: "/Farmhouse.png",
  },
  {
    id: 2,
    name: "All Nighter Egg Sandwich",
    price: 6.99,
    // IMPORTANT: your file in /public is AllNIght.png (capital I)
    img: "/AllNIght.png",
  },
  {
    id: 3,
    name: "Garden Avocado Egg Sandwich",
    price: 6.39,
    img: "/Garden.png",
  },
]);


const classics = ref([
  {
    id: "c1",
    name: "Tastey Turkey Sandwich",
    img: "/Tastey.png",
  },
  {
    id: "c2",
    name: "Avacado Veg Out Sandwich",
    img: "/Veg.png",
  },
  {
    id: "c3",
    name: "Nova Lox Sandwich",
    img: "/Nova.png",
  },
  {
    id: "c4",
    name: "Nova Lux Brunch Special",
    img: "/Special.png",
  },
  {
    id: "c5",
    name: "Ham & Swiss Sandwich",
    img: "/Ham.png",
  },
  {
    id: "c6",
    name: "Turkey, Bacon & Avacado Sandwich",
    img: "/TT.png",
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
  grid-template-columns: repeat(3, minmax(240px, 1fr));
  gap: 18px;
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

.namePrice {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.tilePrice {
  font-weight: 1000;
  opacity: 0.85;
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