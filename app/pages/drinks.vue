<!-- app/pages/drinks.vue -->
<template>
  <div class="page">
    <!-- Mobile dark overlay (tap to close) -->
    <div
      v-if="mobileNavOpen"
      class="mobileOverlay"
      @click="closeMobileNav"
      aria-hidden="true"
    />

    <aside class="sidebar" :class="{ open: mobileNavOpen }" aria-label="Sidebar navigation">
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

        <!-- Review Toggle -->
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

          <label class="commentLabel">Comment</label>
          <textarea
            v-model="comment"
            class="commentBox"
            placeholder="Tell us what you liked..."
            rows="4"
          />

          <button class="primaryBtn" type="button" @click="submitReview">Submit</button>
          <p v-if="submitted" class="submitted">Thanks! Review saved locally.</p>
        </div>
      </nav>
    </aside>

    <!-- Main -->
    <main class="main">
    <!--  Mobile-only mini brand strip -->
    <div class="brandStrip" aria-hidden="true">
      <img class="brandStripLogo" src="/Logo.png" alt="Einstein Bros Logo" />
    </div>
      <!--  Topbar -->
      <header class="topbar">
        <!-- Mobile hamburger (hidden on desktop) -->
        <button class="hamburgerBtn" type="button" @click="openMobileNav" aria-label="Open menu">
          <span class="hamburgerIcon" aria-hidden="true">☰</span>
        </button>

        <div class="topbarSpacer"></div>

        <div class="topbarRight">
          <button class="cartBtn" type="button" @click="toggleCart" aria-label="Cart">
            🛒 <span class="cartCount">{{ cartCount }}</span>
          </button>
        </div>
      </header>

      <!-- Title -->
      <section class="hero">
        <h1 class="title">DRINKS MENU</h1>
      </section>

      <!-- HOT DRINKS -->
      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Hot Drinks</h2>
          <div class="sectionLine" />
        </div>

        <div class="tileGrid">
          <article v-for="item in hotDrinks" :key="item.id" class="tileCard">
            <div class="tileImg">
              <img :src="item.img" :alt="item.name" />
            </div>

            <div class="tileFooter">
              <div class="tileNameRow">
                <div class="tileNamePrice">
                  <span class="tileName">{{ item.name }}</span>
                  <span class="pricePill">${{ Number(item.basePrice).toFixed(2) }}</span>
                </div>

                <button class="plusBtn" type="button" @click="openSizeModal(item)">+</button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- COLD DRINKS -->
      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Cold Drinks</h2>
          <div class="sectionLine" />
        </div>

        <div class="tileGrid">
          <article v-for="item in coldDrinks" :key="item.id" class="tileCard">
            <div class="tileImg">
              <img :src="item.img" :alt="item.name" />
            </div>

            <div class="tileFooter">
              <div class="tileNameRow">
                <div class="tileNamePrice">
                  <span class="tileName">{{ item.name }}</span>
                  <span class="pricePill">${{ Number(item.basePrice).toFixed(2) }}</span>
                </div>

                <button class="plusBtn" type="button" @click="openSizeModal(item)">+</button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- Tea and Smoothies -->
      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Tea and Smoothies</h2>
          <div class="sectionLine" />
        </div>

        <div class="tileGrid">
          <article v-for="item in TeaAndSmoothies" :key="item.id" class="tileCard">
            <div class="tileImg">
              <img :src="item.img" :alt="item.name" />
            </div>

            <div class="tileFooter">
              <div class="tileNameRow">
                <div class="tileNamePrice">
                  <span class="tileName">{{ item.name }}</span>
                  <span class="pricePill">${{ Number(item.basePrice).toFixed(2) }}</span>
                </div>

                <button class="plusBtn" type="button" @click="openSizeModal(item)">+</button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- Bottled Drinks -->
      <section class="section">
        <div class="sectionHeader">
          <h2 class="sectionTitle">Bottled Drinks</h2>
          <div class="sectionLine" />
        </div>

        <div class="tileGrid">
          <article v-for="item in bottledDrinks" :key="item.id" class="tileCard">
            <div class="tileImg">
              <img :src="item.img" :alt="item.name" />
            </div>

            <div class="tileFooter">
              <div class="tileNameRow">
                <div class="tileNamePrice">
                  <span class="tileName">{{ item.name }}</span>
                  <span class="pricePill">${{ Number(item.basePrice).toFixed(2) }}</span>
                </div>

                <button class="plusBtn" type="button" @click="openSizeModal(item)">+</button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- SIZE MODAL -->
      <div v-if="showSizeModal" class="sizeOverlay" @click="showSizeModal = false">
        <div class="sizeModal" @click.stop>
          <div class="sizeHead">
            <h3 class="sizeTitle sizeDrinkTitle">{{ selectedDrink?.name }}</h3>
            <p class="sizeDrinkName">Choose a Size</p>
          </div>

          <div class="sizeOptions">
            <button
              v-for="size in selectedDrink?.sizes"
              :key="size.label"
              class="sizeBtn"
              type="button"
              @click="selectSize(size)"
            >
              <span class="sizeLeft">
                <span class="sizeLabel">{{ size.label }}</span>
              </span>

              <span class="sizePrice">
                ${{ (selectedDrink.basePrice + size.mod).toFixed(2) }}
              </span>
            </button>
          </div>

          <button class="cancelBtn" type="button" @click="showSizeModal = false">Cancel</button>
        </div>
      </div>

      <!-- CART -->
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
              <div class="cartName">
                {{ item.name }} <span v-if="item.size">({{ item.size }})</span>
              </div>
              <div class="cartSub">Qty: {{ item.qty }}</div>
            </div>

            <div class="cartRight">
              <div class="cartPrice">
                ${{ ((item.priceEach ?? item.basePrice ?? 0) * (item.qty || 1)).toFixed(2) }}
              </div>
              <button class="removeBtn" type="button" @click="removeFromCart(idx)">Remove</button>
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

/** Mobile nav drawer */
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

/** Review */
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

/** Cart */
const showCart = ref(false);
const cart = useState("cart", () => []);

function toggleCart() {
  showCart.value = !showCart.value;
}
function removeFromCart(i) {
  cart.value.splice(i, 1);
}
function goToCheckout() {
  navigateTo("/checkout");
}

const cartCount = computed(() =>
  cart.value.reduce((sum, item) => sum + (item.qty || 1), 0)
);

/** Size modal */
const showSizeModal = ref(false);
const selectedDrink = ref(null);

function openSizeModal(drink) {
  // No sizes -> add directly
  if (!drink.sizes || drink.sizes.length === 0) {
    const existing = cart.value.find(
      (item) => item.id === drink.id && item.category === "drink" && !item.size
    );

    if (existing) {
      existing.qty++;
    } else {
      cart.value.push({
        id: drink.id,
        category: "drink",
        name: drink.name,
        img: drink.img?.startsWith("/") ? drink.img : `/${drink.img}`,
        qty: 1,
        basePrice: drink.basePrice,
        priceEach: drink.basePrice,
        custom: {
          size: "",
          milk: "No milk",
          sweetener: "No sweetener",
          ice: "No ice",
          upgrades: [],
          notes: "",
        },
      });
    }

    showCart.value = true;
    return;
  }

  selectedDrink.value = drink;
  showSizeModal.value = true;
}

function selectSize(size) {
  const price = selectedDrink.value.basePrice + size.mod;

  const existing = cart.value.find(
    (item) => item.id === selectedDrink.value.id && item.size === size.label
  );

  if (existing) {
    existing.qty++;
  } else {
    cart.value.push({
      id: selectedDrink.value.id,
      category: "drink",
      name: selectedDrink.value.name,
      img: selectedDrink.value.img?.startsWith("/")
        ? selectedDrink.value.img
        : `/${selectedDrink.value.img}`,
      size: size.label,
      qty: 1,
      basePrice: selectedDrink.value.basePrice,
      priceEach: price,
      custom: {
        size: size.label,
        milk: "2% milk",
        sweetener: "No sweetener",
        ice: "Regular ice",
        upgrades: [],
        notes: "",
      },
    });
  }

  showCart.value = true;
  showSizeModal.value = false;
}

/** DRINK DATA */
const coldDrinks = ref([
  {
    id: "c1",
    name: "Classic Cold Brew",
    img: "ClassicColdBrew.png",
    basePrice: 3.49,
    sizes: [
      { label: "Small", mod: 0 },
      { label: "Large", mod: 0.5 },
    ],
  },
  {
    id: "c2",
    name: "Chocolate Cream Cold Brew",
    img: "ChocolateCreamColdBrew.png",
    basePrice: 4.99,
    sizes: [
      { label: "Small", mod: 0 },
      { label: "Large", mod: 0.8 },
    ],
  },
  {
    id: "c3",
    name: "Vanilla Cream Cold Brew",
    img: "VanillaCreamColdBrew.png",
    basePrice: 4.99,
    sizes: [
      { label: "Small", mod: 0 },
      { label: "Large", mod: 0.8 },
    ],
  },
  {
    id: "c4",
    name: "Caramel Cream Cold Brew",
    img: "CaramelCreamColdBrew.png",
    basePrice: 4.99,
    sizes: [
      { label: "Small", mod: 0 },
      { label: "Large", mod: 0.8 },
    ],
  },
  {
    id: "c5",
    name: "Chocolate Cold Brew Shake",
    img: "ChocolateColdBrewShake.png",
    basePrice: 4.99,
    sizes: [
      { label: "Small", mod: 0 },
      { label: "Large", mod: 0.8 },
    ],
  },
  {
    id: "c6",
    name: "Vanilla Cold Brew Shake",
    img: "VanillaColdBrewShake.png",
    basePrice: 4.99,
    sizes: [
      { label: "Small", mod: 0 },
      { label: "Large", mod: 0.8 },
    ],
  },
  {
    id: "c7",
    name: "Caramel Cold Brew Shake",
    img: "CaramelColdBrewShake.png",
    basePrice: 4.99,
    sizes: [
      { label: "Small", mod: 0 },
      { label: "Large", mod: 0.8 },
    ],
  },
  {
    id: "c8",
    name: "Mocha",
    img: "IcedMocha.png",
    basePrice: 4.69,
    sizes: [
      { label: "Small", mod: 0 },
      { label: "Large", mod: 0.3 },
    ],
  },
  {
    id: "c9",
    name: "Caramel Macchiato",
    img: "IcedCaramelMacchiato.png",
    basePrice: 5.39,
    sizes: [
      { label: "Small", mod: 0 },
      { label: "Large", mod: 0.1 },
    ],
  },
  {
    id: "c10",
    name: "Latte",
    img: "ColdLatte.png",
    basePrice: 4.29,
    sizes: [
      { label: "Small", mod: 0 },
      { label: "Large", mod: 0.4 },
    ],
  },
  {
    id: "c11",
    name: "Chai Tea Latte",
    img: "ColdChaiTeaLatte.png",
    basePrice: 4.19,
    sizes: [
      { label: "Small", mod: 0 },
      { label: "Large", mod: 0.2 },
    ],
  },
]);

const hotDrinks = ref([
  {
    id: "h1",
    name: "Mocha",
    img: "Mocha.png",
    basePrice: 4.69,
    sizes: [
      { label: "Medium", mod: 0 },
      { label: "Large", mod: 0.3 },
    ],
  },
  {
    id: "h2",
    name: "Latte",
    img: "Latte.png",
    basePrice: 4.19,
    sizes: [
      { label: "Medium", mod: 0 },
      { label: "Large", mod: 0.2 },
    ],
  },
  {
    id: "h3",
    name: "Caramel Macchiato",
    img: "CaramelMacchiato.png",
    basePrice: 5.29,
    sizes: [
      { label: "Medium", mod: 0 },
      { label: "Large", mod: 0.2 },
    ],
  },
  {
    id: "h4",
    name: "Chai Tea Latte",
    img: "ChaiTeaLatte.png",
    basePrice: 4.19,
    sizes: [
      { label: "Medium", mod: 0 },
      { label: "Large", mod: 0.2 },
    ],
  },
  {
    id: "h5",
    name: "Hot Chocolate",
    img: "HotChocolate.png",
    basePrice: 3.99,
    sizes: [
      { label: "Medium", mod: 0 },
      { label: "Large", mod: 0.5 },
    ],
  },
  {
    id: "h6",
    name: "Coffee",
    img: "HotCoffee.png",
    basePrice: 4.99,
    sizes: [
      { label: "Medium", mod: 0 },
      { label: "Large", mod: 0.8 },
    ],
  },
]);

const TeaAndSmoothies = ref([
  {
    id: "o1",
    name: "Hot Tea",
    img: "HotTea.png",
    basePrice: 3.99,
    sizes: [
      { label: "Small", mod: 0 },
      { label: "Large", mod: 0.76 },
    ],
  },
  {
    id: "o2",
    name: "Iced Tea",
    img: "IcedTea.png",
    basePrice: 3.99,
    sizes: [
      { label: "Small", mod: 0 },
      { label: "Large", mod: 0.76 },
    ],
  },
  {
    id: "o3",
    name: "Strawberry Banana Smoothie",
    img: "Strawberry Banana Smoothie.png",
    basePrice: 4.99,
    sizes: [
      { label: "Small", mod: 0 },
      { label: "Large", mod: 0.8 },
    ],
  },
]);

const bottledDrinks = ref([
  { id: "b1", name: "Pepsi", img: "Pepsi.png", basePrice: 2.5 },
  { id: "b2", name: "Diet Pepsi", img: "DietPepsi.png", basePrice: 2.5 },
  { id: "b3", name: "Mountain Dew", img: "MountainDew.png", basePrice: 2.5 },
  { id: "b4", name: "Diet Mountain Dew", img: "DietMountainDew.png", basePrice: 2.5 },
  { id: "b5", name: "Orange Juice", img: "OrangeJuice.png", basePrice: 2.5 },
  { id: "b6", name: "Grape Juice", img: "GrapeJuice.png", basePrice: 2.5 },
  { id: "b7", name: "Apple Juice", img: "AppleJuice.png", basePrice: 2.5 },
  { id: "b8", name: "Raspberry Iced Tea", img: "RaspberryIcedTea.png", basePrice: 2.5 },
  { id: "b9", name: "Unsweetened Iced Tea", img: "UnsweetenedIcedTea.png", basePrice: 2.5 },
  { id: "b10", name: "Chocolate Milk", img: "ChocolateMilk.png", basePrice: 2.5 },
  { id: "b11", name: "White Milk", img: "WhiteMilk.png", basePrice: 2.5 },
  { id: "b12", name: "Water", img: "Water.png", basePrice: 2.5 },
  { id: "b14", name: "Lemon Lime Gatorade", img: "YellowGatorade.png", basePrice: 2.5 },
  { id: "b15", name: "Cool Blue Gatorade", img: "CoolBlueGatorade.png", basePrice: 2.5 },
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

/* ===== Mobile overlay ===== */
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
  position: relative; /* for X button */
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

/* Topbar */
.topbar {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.topbarSpacer {
  min-height: 1px;
}

.topbarRight {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: flex-end;
}

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

.cartBtn {
  position: relative;
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: #fff;
  border-radius: 14px;
  padding: 10px 12px;
  cursor: pointer;
  box-shadow: var(--cardShadow);
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

/* Tiles */
.tileGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 28px;
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
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  padding-right: 3px;
}

.tileNamePrice {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.tileName {
  flex: 1;
  min-width: 0;
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
  line-height: 1.15;
  max-width: 100%;
  font-weight: 900;
}

.pricePill {
  font-weight: 900;
  font-size: 14px;
  color: #fff;
  background: #111;
  padding: 4px 8px;
  border-radius: 999px;
  width: fit-content;
  white-space: nowrap;
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
  margin-left: 0;
  margin-right: 30px; /* desktop spacing you had */
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
.checkoutBtn:hover {
  background: #ffbe21;
}

.checkoutBtn:disabled {
  background: #ccc;
  color: #666;
  cursor: not-allowed;
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

/* ===== Size Modal (Premium) ===== */
.sizeOverlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: grid;
  place-items: center;
  z-index: 9999;
  padding: 18px;
}

.sizeModal {
  width: min(420px, 92vw);
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 26px;
  border: 1px solid rgba(75, 52, 41, 0.12);
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.25);
  padding: 18px 18px 14px;
}

.sizeHead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
}

.sizeTitle {
  margin: 0;
  font-weight: 1000;
  font-size: 22px;
  color: var(--brown);
  letter-spacing: 0.2px;
}

.sizeDrinkName {
  margin: 0 0 14px;
  font-weight: 900;
  opacity: 0.75;
  font-size: 15px;
}

.sizeOptions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
}

.sizeBtn {
  width: 100%;
  border: 1px solid rgba(75, 52, 41, 0.12);
  background: #fff;
  border-radius: 18px;
  padding: 14px 14px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.08);
  transition: transform 0.1s ease, box-shadow 0.1s ease, border-color 0.1s ease;
}
.sizeBtn:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 34px rgba(0, 0, 0, 0.12);
  border-color: rgba(244, 179, 22, 0.55);
}

.sizeLeft {
  display: grid;
  gap: 3px;
  text-align: left;
}
.sizeLabel {
  font-weight: 1000;
  font-size: 16px;
  color: var(--brown);
}

.sizePrice {
  font-weight: 1000;
  font-size: 15px;
  color: #2c1b12;
  background: rgba(244, 179, 22, 0.22);
  border: 1px solid rgba(244, 179, 22, 0.35);
  padding: 8px 10px;
  border-radius: 999px;
  white-space: nowrap;
}

.cancelBtn {
  width: 100%;
  margin-top: 6px;
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: transparent;
  border-radius: 16px;
  padding: 12px;
  font-weight: 1000;
  color: var(--brown);
  opacity: 0.8;
  cursor: pointer;
}
.cancelBtn:hover {
  opacity: 1;
  border-color: rgba(244, 179, 22, 0.55);
}
/* ===== Mini Brand Strip (desktop hidden) ===== */
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
  }

  .tileImg {
    width: 100%;
  }
}

/* Mobile: drawer + 3 tiles per row */
@media (max-width: 720px) {
  .page {
    grid-template-columns: 1fr;
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

  /* 3 items per row like main page */
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
    margin-right: 0; /* undo desktop push */
  }
  /* ===== Mini Brand Strip ===== */
.brandStrip{
  height: 64px;                    /* the strip height */
  background: #f6e28a;             /* yellow-ish (change if you want) */
  border-bottom: 1px solid rgba(75, 52, 41, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 22px rgba(0,0,0,0.08);
  margin: -20px -26px 14px;        /* pulls to the edges inside main padding */
}

.brandStripLogo{
  height: 42px;                    /* mini logo size */
  width: auto;
  object-fit: contain;
  display: block;
  filter: drop-shadow(0 6px 10px rgba(0,0,0,0.12));
}

/* Mobile: match your smaller main padding */
@media (max-width: 720px){
  .brandStrip{
    margin: -14px -14px 12px;
    height: 58px;
  }
  .brandStripLogo{
    height: 38px;
  }
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
  .modalOverlay {
    align-items: flex-end;        /* push sheet to bottom */
    padding: 12px;               /* smaller outer padding */
  }

  .modal {
    width: 100%;
    max-width: 520px;
    max-height: 75vh;            /* IMPORTANT: prevents huge box */
    overflow: hidden;            /* hide overflow; body will scroll */
    border-radius: 18px 18px 22px 22px;
  }

  .modalHeader {
    padding: 12px 14px;          /* smaller header */
  }

  .modalBody {
    padding: 12px 14px;
    max-height: calc(75vh - 120px); /* leaves room for header+footer */
    overflow-y: auto;              /* scroll inside */
    -webkit-overflow-scrolling: touch;
  }

  .modalTitle {
    font-size: 18px;             /* smaller title */
  }

  .fieldLabel {
    margin: 8px 0 6px;           /* less vertical space */
  }

  .select, .textarea {
    padding: 10px 12px;          /* tighter inputs */
    border-radius: 12px;
  }

  .extras {
    padding: 8px;
    gap: 8px;
  }

  .checkLine {
    padding: 10px 10px;          /* tighter add-on rows */
  }

  /* Sticky footer like a real mobile sheet */
  .modalFooter {
    position: sticky;
    bottom: 0;
    background: #fff;
    padding: 12px 14px;
    margin-top: 0;
    border-top: 1px solid rgba(15,23,42,0.10);
  }
  .sizeOverlay {
    place-items: end center;      /* push modal down like a sheet */
    padding: 10px;
  }

  .sizeModal {
    width: 100%;
    max-width: 520px;
    max-height: 60vh;            /* key: cap height */
    overflow: hidden;            /* body will scroll */
    border-radius: 18px 18px 22px 22px;
    padding: 12px 12px 12px;     /* smaller padding */
  }

  .sizeHead {
    margin-bottom: 6px;
  }

  .sizeTitle {
    font-size: 18px;             /* smaller title */
  }

  .sizeDrinkName {
    font-size: 13px;
    margin: 0 0 10px;
  }

  .sizeOptions {
    max-height: calc(60vh - 140px); /* scroll area */
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    gap: 8px;
    padding-right: 2px;
  }

  .sizeBtn {
    padding: 12px;               /* smaller buttons */
    border-radius: 16px;
  }

  .sizeLabel {
    font-size: 15px;
  }

  .sizePrice {
    font-size: 14px;
    padding: 7px 10px;
  }

  .cancelBtn {
    padding: 12px;
    border-radius: 16px;
    margin-top: 8px;
  }
}
</style>
