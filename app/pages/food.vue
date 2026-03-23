<!-- app/pages/food.vue -->
<template>
  <div class="page">
    <!-- ✅ Mobile dark overlay (tap to close) -->
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

    <!-- Main content area -->
    <main class="main">
      <!-- ✅ Mobile-only mini brand strip -->
      <div class="brandStrip" aria-hidden="true">
        <img class="brandStripLogo" src="/Logo.png" alt="Einstein Bros Logo" />
      </div>

      <!-- Top bar -->
      <header class="topbar">
        <!-- ✅ Mobile hamburger (hidden on desktop) -->
        <button class="hamburgerBtn" type="button" @click="openMobileNav" aria-label="Open menu">
          <span class="hamburgerIcon" aria-hidden="true">☰</span>
        </button>

        <div class="topbarSpacer"></div>

        <div class="topbarRight">
          <button class="cartBtn" type="button" @click="toggleCart" aria-label="Cart">
            <span class="cartIcon">🛒</span>
            <span class="cartCount">{{ cartCount }}</span>
          </button>
        </div>
      </header>

      <!-- Title -->
      <section class="hero">
        <h1 class="title">Food Selection</h1>
      </section>

      <!-- Breakfast -->
      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Breakfast</h2>
          <div class="sectionLine" />
        </div>

        <div class="tileGrid">
          <article v-for="item in Breakfast" :key="item.id" class="tileCard">
            <div class="tileImg" :class="{ tileDisabled: !isAvailable(item.name) }">
              <img :src="item.img" :alt="item.name" />
              <div v-if="!isAvailable(item.name)" class="unavailableOverlay">
                Currently unavailable
              </div>
            </div>

            <div class="tileFooter">
              <div class="tileFooterGrid">
                <div class="tileName">{{ item.name }}</div>

                <div class="tileBottomRow">
                  <span v-if="resolvePrice(item) != null" class="pricePill">
                    ${{ Number(resolvePrice(item)).toFixed(2) }}
                  </span>

                  <button
                    class="plusBtn"
                    type="button"
                    aria-label="Add to cart"
                    :disabled="!isAvailable(item.name)"
                    @click="addToCart(item)"
                  >
                    +
                  </button>
                </div>
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
            <div class="tileImg" :class="{ tileDisabled: !isAvailable(item.name) }">
              <img :src="item.img" :alt="item.name" />
              <div v-if="!isAvailable(item.name)" class="unavailableOverlay">
                Currently unavailable
              </div>
            </div>

            <div class="tileFooter">
              <div class="tileFooterGrid">
                <div class="tileName">{{ item.name }}</div>

                <div class="tileBottomRow">
                  <span v-if="resolvePrice(item) != null" class="pricePill">
                    ${{ Number(resolvePrice(item)).toFixed(2) }}
                  </span>

                  <button
                    class="plusBtn"
                    type="button"
                    aria-label="Add to cart"
                    :disabled="!isAvailable(item.name)"
                    @click="addToCart(item)"
                  >
                    +
                  </button>
                </div>
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
            <div class="tileImg" :class="{ tileDisabled: !isAvailable(item.name) }">
              <img :src="item.img" :alt="item.name" />
              <div v-if="!isAvailable(item.name)" class="unavailableOverlay">
                Currently unavailable
              </div>
            </div>

            <div class="tileFooter">
              <div class="tileFooterGrid">
                <div class="tileName">{{ item.name }}</div>

                <div class="tileBottomRow">
                  <span v-if="resolvePrice(item) != null" class="pricePill">
                    ${{ Number(resolvePrice(item)).toFixed(2) }}
                  </span>

                  <button
                    class="plusBtn"
                    type="button"
                    aria-label="Add to cart"
                    :disabled="!isAvailable(item.name)"
                    @click="addToCart(item)"
                  >
                    +
                  </button>
                </div>
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
            <div class="tileImg" :class="{ tileDisabled: !isAvailable(item.name) }">
              <img :src="item.img" :alt="item.name" />
              <div v-if="!isAvailable(item.name)" class="unavailableOverlay">
                Currently unavailable
              </div>
            </div>

            <div class="tileFooter">
              <div class="tileFooterGrid">
                <div class="tileName">{{ item.name }}</div>

                <div class="tileBottomRow">
                  <span v-if="resolvePrice(item) != null" class="pricePill">
                    ${{ Number(resolvePrice(item)).toFixed(2) }}
                  </span>

                  <button
                    class="plusBtn"
                    type="button"
                    aria-label="Add to cart"
                    :disabled="!isAvailable(item.name)"
                    @click="addToCart(item)"
                  >
                    +
                  </button>
                </div>
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
            <div class="tileImg" :class="{ tileDisabled: !isAvailable(item.name) }">
              <img :src="item.img" :alt="item.name" />
              <div v-if="!isAvailable(item.name)" class="unavailableOverlay">
                Currently unavailable
              </div>
            </div>

            <div class="tileFooter">
              <div class="tileFooterGrid">
                <div class="tileName">{{ item.name }}</div>

                <div class="tileBottomRow">
                  <span v-if="resolvePrice(item) != null" class="pricePill">
                    ${{ Number(resolvePrice(item)).toFixed(2) }}
                  </span>

                  <button
                    class="plusBtn"
                    type="button"
                    aria-label="Add to cart"
                    :disabled="!isAvailable(item.name)"
                    @click="addToCart(item)"
                  >
                    +
                  </button>
                </div>
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
                ${{ ((item.priceEach ?? item.basePrice ?? 0) * (item.qty || 1)).toFixed(2) }}
              </div>

              <button class="removeBtn" type="button" @click="removeFromCart(idx)">
                Remove
              </button>
            </div>
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

/** ✅ Mobile nav */
const mobileNavOpen = ref(false);
function openMobileNav() {
  mobileNavOpen.value = true;
}
function closeMobileNav() {
  mobileNavOpen.value = false;
}

/** close drawer with ESC */
function handleKeydown(e) {
  if (e.key === "Escape") closeMobileNav();
}
onMounted(() => document.addEventListener("keydown", handleKeydown));
onBeforeUnmount(() => document.removeEventListener("keydown", handleKeydown));

/** ✅ Availability (shared state with Staff) — key by NAME */
const availability = useAvailability();
function isAvailable(name) {
  return availability.isAvailable(name);
}

/** =========================
 *  Prices (ALL)
 *  ========================= */
const PRICE_BY_NAME = {
  // ===== Breakfast =====
  "Farm House Egg Sandwich": 7.19,
  "All Nighter Egg Sandwich": 6.99,
  "Garden Avocado Egg Sandwich": 6.39,
  "Bacon Cheddar Egg Sandwich": 6.59,
  "Cheddar Egg Sandwich": 6.59,
  "Ham Swiss Egg Sandwich": 6.59,
  "Turkey Sausage Egg Sandwich": 6.59,
  "Bacon Avocado Tomato Sandwich": 6.59,
  "Santa Fe Egg White Sandwich": 6.59,
  "Texas Brisket Egg Sandwich": 7.59,
  "Big Breakfast Burrito": 7.49,
  "Avocado Toast": 5.49,

  // ===== Lunch =====
  "Tastey Turkey Sandwich": 7.99,
  "Avocado Veg Out Sandwich": 7.54,
  "Nova Lox Sandwich": 8.49,
  "Pepperoni Chicken": 7.59,
  "Ham & Swiss Sandwich": 7.99,
  "Turkey, Bacon & Avocado Sandwich": 7.49,
  "Spicy Chicken": 7.59,
  "Cheesy Veggie Melt": 7.09,
  "Cheese Pizza Bagel": 4.99,
  "Pepperoni Pizza Bagel": 5.29,
  "Turkey and Cheddar": 7.49,
  "Chicken Salad": 6.99,
  "Albuquerque Turkey": 7.59,

  // ===== Bagels =====
  "Plain Bagel": 2.19,
  "Cinnamon Raisin Bagel": 2.49,
  "Everything Bagel": 2.49,
  "Ancient Grain Bagel": 2.79,
  "Sesame Seed Bagel": 2.49,
  "Cheesy Hashbrown Bagel": 2.99,
  "Six Cheese Bagel": 2.99,
  "Asiago Bagel": 2.99,
  "Blueberry Bagel": 2.49,
  "Chocolate Chip Bagel": 2.59,

  // ===== Smears =====
  Plain: 1.29,
  Strawberry: 1.49,
  Almond: 1.49,
  "Country Pepper": 1.49,
  "Garden Veggie": 1.49,
  "Onion Chive": 1.49,

  // ===== Other =====
  "Cinnamon Chip Muffin": 2.99,
  "Cinnamon Bliss Rolls": 3.49,
  "Blueberry Muffin": 2.99,
  "Chocolate Chip Cookie": 2.49,
  "Twice Baked Hashbrown": 2.79,
};

function resolvePrice(item) {
  if (typeof item?.price === "number") return item.price;
  const p = PRICE_BY_NAME[item?.name];
  return typeof p === "number" ? p : null;
}

/** =========================
 *  Review
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
 *  Cart
 *  ========================= */
const showCart = ref(false);
const cart = useState("cart", () => []);

const cartCount = computed(() =>
  cart.value.reduce((sum, item) => sum + (item.qty || 1), 0)
);

function toggleCart() {
  showCart.value = !showCart.value;
}
function goToCheckout() {
  showCart.value = false;
  navigateTo("/checkout");
}

function getCategory(item) {
  const id = item?.id || "";
  if (id.startsWith("bs") || id.startsWith("l")) return "sandwich";
  if (id.startsWith("c")) return "bagel";
  if (id.startsWith("s")) return "shmear";
  if (id.startsWith("o")) return "other";
  return "other";
}

function addToCart(item) {
  // ✅ block if staff marked it unavailable (by NAME)
  if (!isAvailable(item.name)) return;

  const existing = cart.value.find((x) => x.id === item.id);
  const base = Number(resolvePrice(item) ?? 0);

  if (existing) existing.qty += 1;
  else {
    cart.value.push({
      id: item.id,
      category: getCategory(item),
      name: item.name,
      qty: 1,
      img: item.img,
      basePrice: base,
      priceEach: base,
      custom: null,
    });
  }

  showCart.value = true;
}

function removeFromCart(index) {
  cart.value.splice(index, 1);
}

/** =========================
 *  Menu items
 *  ========================= */
const Breakfast = ref([
  { 
    id: "bs1", 
    name: "Farm House Egg Sandwich", 
    img: "EBB-SignatureEgg-Farmhouse-650x6501-1.jpg" 
  },
  { 
    id: "bs2",
    name: "All Nighter Egg Sandwich",
    img: "EBB-SignatureEgg-All-Nighter-650x6501-1.jpg" 
  },
  { 
    id: "bs3",
    name: "Garden Avocado Egg Sandwich", 
    img: "EBB-SignatureEgg-GardenAvocado-650x6501-1.jpg" },
  { 
    id: "bs4",
    name: "Bacon Cheddar Egg Sandwich", 
    img: "EBB-Baconcheddar-Classic-Egg-Sandwich-1.jpg" 
  },
  { id: "bs5", name: "Cheddar Egg Sandwich", img: "EBB-Cheddar-Classic-Egg-Sandwich.jpg" },
  { id: "bs6", name: "Ham Swiss Egg Sandwich", img: "EBB-Ham-Swiss-Classic-Egg-Sandwich.jpg" },
  { id: "bs7", name: "Turkey Sausage Egg Sandwich", img: "EBB-Turkey-Sausage-Cheddar-Classic-Egg-Sandwich.jpg" },
  { id: "bs8", name: "Bacon Avocado Tomato Sandwich", img: "EBB-SignatureEgg-BaconAvocadoTomatoEggWhite-650x6501-1.jpg" },
  { id: "bs9", name: "Santa Fe Egg White Sandwich", img: "EBB-SignatureEgg-SantaFeEggWhite-650x6501-1.jpg" },
  { id: "bs10", name: "Texas Brisket Egg Sandwich", img: "EBB-SignatureEgg-TexasBrisket-650x6501-1.jpg" },
  { id: "bs11", name: "Big Breakfast Burrito", img: "Burriro.png" },
  { id: "bs12", name: "Avocado Toast", img: "ToastAvo.png" },
]);

const Lunch = ref([
  { id: "l1", name: "Tastey Turkey Sandwich", img: "/Tastey.png" },
  { id: "l2", name: "Avocado Veg Out Sandwich", img: "/Veg.png" },
  { id: "l3", name: "Nova Lox Sandwich", img: "/Nova.png" },
  { id: "l4", name: "Pepperoni Chicken", img: "/Special.png" },
  { id: "l5", name: "Ham & Swiss Sandwich", img: "/Ham.png" },
  { id: "l6", name: "Turkey, Bacon & Avocado Sandwich", img: "/TT.png" },
  { id: "l7", name: "Spicy Chicken", img: "/Chicken.png" },
  { id: "l8", name: "Cheesy Veggie Melt", img: "/Veg.png" },
  { id: "l9", name: "Cheese Pizza Bagel", img: "ChessyPiz.png" },
  { id: "l10", name: "Pepperoni Pizza Bagel", img: "PeppyPiz.png" },
  { id: "l11", name: "Turkey and Cheddar", img: "/Ham.png" },
  { id: "l12", name: "Chicken Salad", img: "/TT.png" },
  { id: "l13", name: "Albuquerque Turkey", img: "/TT.png" },
]);

const Bagels = ref([
  { id: "c1", name: "Plain Bagel", img: "EBB-Bagel-Classic-Plain-1.jpg" },
  { id: "c2", name: "Cinnamon Raisin Bagel", img: "EBB-Bagel-Classic-Cinnamon-Raisin.jpg" },
  { id: "c3", name: "Everything Bagel", img: "EBB-Bagel-Classic-Everything.jpg" },
  { id: "c4", name: "Ancient Grain Bagel", img: "EBB-Bagel-Classic-Ancient-Grain.jpg" },
  { id: "c5", name: "Sesame Seed Bagel", img: "EBB-Bagel-Classic-Sesame-Seed.jpg" },
  { id: "c6", name: "Cheesy Hashbrown Bagel", img: "EBB-Bagel-Gourmet-Cheesy-Hashbrown.jpg" },
  { id: "c7", name: "Six Cheese Bagel", img: "EBB-Bagel-Gourmet-Six-Cheese.jpg" },
  { id: "c8", name: "Asiago Bagel", img: "EBB-Bagel-Signature-Asiago-1.jpg" },
  { id: "c9", name: "Blueberry Bagel", img: "EBB-Bagel-Signature-Blueberry.jpg" },
  { id: "c10", name: "Chocolate Chip Bagel", img: "EBB-Bagel-Signature-Chocolate-Chip.jpg" },
]);

const Smears = ref([
  { id: "s1", name: "Plain", img: "PlainSmear.png" },
  { id: "s2", name: "Strawberry", img: "Straberry.png" },
  { id: "s3", name: "Almond", img: "Almond.png" },
  { id: "s4", name: "Country Pepper", img: "CountryPepper.png" },
  { id: "s5", name: "Garden Veggie", img: "GardenVeggie.png" },
  { id: "s6", name: "Onion Chive", img: "OnionChive.png" },
]);

const Other = ref([
  { id: "o1", name: "Cinnamon Chip Muffin", img: "650x6501-1.jpeg" },
  { id: "o2", name: "Cinnamon Bliss Rolls", img: "EBB-Cinnamon-Bliss-Roll-1.jpg" },
  { id: "o3", name: "Blueberry Muffin", img: "EBB-Sweets-BlueberryMuffin-650x6501-1.jpg" },
  { id: "o4", name: "Chocolate Chip Cookie", img: "EBB-Sweets-ChocolateChipCookie-650x6501-1.jpg" },
  { id: "o5", name: "Twice Baked Hashbrown", img: "EBB-Twice-Baked-Hashbrown.jpg" },
]);
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

/* Review panel */
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
  background: #f4a51c;
  color: #111;
  font-weight: 900;
  display: grid;
  place-items: center;
  border: 2px solid #fff;
  font-size: 12px;
}

/* Title */
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

/* Tiles (desktop/tablet) */
.tileGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 22px;
  align-items: start;
}

.tileCard {
  background: transparent;
}

.tileImg {
  position: relative;
  width: 82%;
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

.tileDisabled {
  filter: grayscale(0.15);
  opacity: 0.7;
}

.unavailableOverlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 14px;
  text-align: center;
  font-weight: 1000;
  color: #b00020;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(4px);
}

.tileFooter {
  padding-top: 10px;
  width: 82%;
}

/* ✅ Clean name + bottom row (price | +) */
.tileFooterGrid {
  width: 100%;
  display: grid;
  gap: 10px;
}

.tileName {
  font-size: 16px;
  font-weight: 1000;
  color: var(--brown);
  line-height: 1.2;
  white-space: normal;
}

.tileBottomRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.pricePill {
  background: #111;
  color: #fff;
  font-weight: 1000;
  font-size: 13px;
  padding: 6px 10px;
  border-radius: 999px;
  letter-spacing: 0.3px;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.08);
  white-space: nowrap;
}

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

.plusBtn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
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
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  white-space: nowrap;
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

/* ===== Mini Brand Strip (desktop hidden) ===== */
.brandStrip {
  display: none;
}
.brandStripLogo {
  display: block;
}

/* ===== Responsive ===== */
@media (max-width: 980px) {
  .page {
    grid-template-columns: 220px 1fr;
  }

  .tileImg,
  .tileFooter {
    width: 100%;
  }
}

/* ✅ MOBILE: 3 items per row + drawer */
@media (max-width: 720px) {
  .page {
    grid-template-columns: 1fr;
  }

  .hamburgerBtn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .main {
    padding: 14px 14px 44px;
  }

  .title {
    font-size: 34px;
    letter-spacing: 1px;
  }

  /* ✅ overlay */
  .mobileOverlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    z-index: 90;
  }

  /* ✅ sidebar becomes drawer */
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

  /* ✅ 3 tiles per row on mobile */
  .tileGrid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    align-items: start;
  }

  .tileImg {
    width: 100%;
    border-radius: 18px;
  }

  .tileFooter {
    width: 100%;
    padding-top: 8px;
  }

  .tileName {
    font-size: 13px;
    line-height: 1.15;
  }

  .pricePill {
    font-size: 12px;
    padding: 5px 9px;
  }

  .plusBtn {
    width: 28px;
    height: 28px;
    font-size: 18px;
    border-radius: 9px;
  }

  /* ===== Mini Brand Strip (mobile only) ===== */
  .brandStrip {
    display: flex;
    height: 58px;
    background: #f6e28a;
    border-bottom: 1px solid rgba(75, 52, 41, 0.12);
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 22px rgba(0, 0, 0, 0.08);

    /* match your .main padding on mobile */
    margin: -14px -14px 12px;
  }

  .brandStripLogo {
    height: 38px;
    width: auto;
    object-fit: contain;
    filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.12));
  }
}
</style>