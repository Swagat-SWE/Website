<!-- app/pages/index.vue -->
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
        <NuxtLink class="navItem" to="/">Main Page</NuxtLink>
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
        <div> </div> <!-- empty div to balance the flex space on the left -->

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
                <button class="plusBtn" type="button" aria-label="Add to cart" @click="addToCart(item)">
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

                <button class="plusBtn" type="button" aria-label="Add to cart" @click="addToCart(item)">
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

                <button class="plusBtn" type="button" aria-label="Add to cart" @click="addToCart(item)">
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

                <button class="plusBtn" type="button" aria-label="Add to cart" @click="addToCart(item)">
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
        <!-- left: image -->
        <div class="cartThumb">
          <img v-if="item.img" :src="item.img" :alt="item.name" />
          <div v-else class="cartThumbFallback">PIC</div>
        </div>      

        <!-- middle: name + qty -->
        <div class="cartMeta">
          <div class="cartName">{{ item.name }}</div>
          <div class="cartSub">Qty: {{ item.qty }}</div>
        </div>      

        <!-- right: price + remove -->
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

const PRICE_BY_NAME = {
  // ===== Breakfast sandwiches (from your index MENU / common Einstein prices) =====
  "Farm House Egg Sandwich": 6.99,
  "All Nighter Egg Sandwich": 6.99,
  "Garden Avacado Egg Sandwich": 6.39,
  "Bacon Chedder Egg Sandwich": 6.59,
  "Chedder Egg Sandwich": 6.59,
  "Ham Swiss Egg Sandwich": 6.59,
  "Turky Sausage Egg Sandwich": 6.59,
  "Bacon Avocoado Tomato Sandwich": 6.59,
  "Stanta Fe Egg White Sandwich": 6.59,
  "Texas Brisket Egg Sandwich": 7.59,
  "Big Breakfast Burrito": 7.49,
  "Avocado Toast": 5.49,

  // ===== Lunch sandwiches (from your index MENU / common items) =====
  "Tastey Turkey Sandwich": 7.79,
  "Avacado Veg Out Sandwich": 7.29,
  "Nova Lox Sandwich": 8.29,
  "Pepperoni Chicken": 7.59,
  "Ham & Swiss Sandwich": 7.29,
  "Turkey, Bacon & Avacado Sandwich": 7.99,
  "Spicy Chicken": 7.59,
  "Chessy Veggie Melt": 7.09,
  "Cheese Pizza Bagel": 4.99,
  "Pepperoni Pizza Bagel": 5.29,
  "Turkey and Chedder": 7.49,
  "Chicken Salad": 6.99,
  "Albuquerque Turkey": 7.59,

  // ===== Bagels =====
  "Plain Bagel": 2.19,
  "Cinnamon Rasin Bagel": 2.49,
  "Everything Bagel": 2.49,
  "Ancient Grain Bagel": 2.79,
  "Sesame Seed Bagel": 2.49,
  "Cheesy Hashbrown Bagel": 2.99,
  "Six Cheese Bagel": 2.99,
  "Aisago Bagle": 2.99,
  "Blueberry Bagel": 2.49,
  "Chocolate Chip Bagel": 2.59,

  // ===== Smears =====
  "Plain": 1.29,
  "Strawberry": 1.49,
  "Almond": 1.49,
  "Country Pepper": 1.49,
  "Garden Veggie": 1.49,
  "Onion Chive": 1.49,

  // ===== Other =====
  "Cinnamon Chip Muffin": 2.99,
  "Cinnamon Bliss Rolls": 3.49,
  "Blueberry Muffin": 2.99,
  "Chocolate Chip Cooke": 2.49,
  "Twice Baked Hashbrown": 2.79,
};


import { ref, computed, onMounted, onBeforeUnmount } from "vue";
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
);


function toggleCart() {
  showCart.value = !showCart.value;
}

function goToCheckout() {
  showCart.value = false;        // optional: close the cart
  navigateTo("/checkout");       // or "/Checkout" depending on your filename
}

function addToCart(item) {
  const price = item.price ?? PRICE_BY_NAME[item.name] ?? 0;

  const existing = cart.value.find((x) => x.name === item.name);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.value.push({
      name: item.name,
      qty: 1,
      img: item.img,
      basePrice: item.price ?? 0,
      priceEach: item.price ?? 0,
      custom: null,
      category: "food",
    });
  }

  showCart.value = true;
}

function removeFromCart(index) {
  cart.value.splice(index, 1);
}


/** =========================
 *  Page Content (images)
 *  Replace URLs later with your own images in /public
 *  ========================= */
const Breakfest = ref([
  {
    id: "bs1",
    name: "Farm House Egg Sandwich",
    img: "EBB-SignatureEgg-Farmhouse-650x6501-1.jpg",
  },
  {
    id: "bs2",
    name: "All Nighter Egg Sandwich",
    img: "EBB-SignatureEgg-All-Nighter-650x6501-1.jpg",
  },
  {
    id: "bs3",
    name: "Garden Avocado Egg Sandwich",
    img: "EBB-SignatureEgg-GardenAvocado-650x6501-1.jpg",
  },
  {
    id: "bs4",
    name: "Bacon Cheddar Egg Sandwich",
    img: "EBB-Baconcheddar-Classic-Egg-Sandwich-1.jpg",
  },
  {
    id: "bs5",
    name: "Cheddar Egg Sandwich",
    img: "EBB-Cheddar-Classic-Egg-Sandwich.jpg",
  },
  {
    id: "bs6",
    name: "Ham Swiss Egg Sandwich",
    img: "EBB-Ham-Swiss-Classic-Egg-Sandwich.jpg",
  },
  {
    id: "bs7",
    name: "Turky Sausage Egg Sandwich",
    img: "EBB-Turkey-Sausage-Cheddar-Classic-Egg-Sandwich.jpg",
  },
  {
    id: "bs8",
    name: "Bacon Avocado Tomato Sandwich",
    img: "EBB-SignatureEgg-BaconAvocadoTomatoEggWhite-650x6501-1.jpg",
  },
  {
    id: "bs9",
    name: "Santa Fe Egg White Sandwich",
    img: "EBB-SignatureEgg-SantaFeEggWhite-650x6501-1.jpg",
  },
  {
    id: "bs10",
    name: "Texas Brisket Egg Sandwich",
    img: "EBB-SignatureEgg-TexasBrisket-650x6501-1.jpg",
  },
  {
    id: "bs11",
    name: "Big Breakfast Burrito",
    img: "EBB-SignatureEgg-SantaFeEggWhite-650x6501-1.jpg",
  },
  {
    id: "bs12",
    name: "Avocado Toast",
    img: "EBB-SignatureEgg-TexasBrisket-650x6501-1.jpg",
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
    name: "Avocado Veg Out Sandwich",
    img: "/Veg.png",
  },
  {
    id: "l3",
    name: "Nova Lox Sandwich",
    img: "/Nova.png",
  },
  {
    id: "l4",
    name: "Pepperoni Chicken",
    img: "/Special.png",
  },
  {
    id: "l5",
    name: "Ham & Swiss Sandwich",
    img: "/Ham.png",
  },
  {
    id: "l6",
    name: "Turkey, Bacon & Avocado Sandwich",
    img: "/TT.png",
  },
  {
    id: "l7",
    name: "Spicy Chicken",
    img: "/Tastey.png",
  },
  {
    id: "l8",
    name: "Chessy Veggie Melt",
    img: "/Veg.png",
  },
  {
    id: "l9",
    name: "Cheese Pizza Bagel",
    img: "/Nova.png",
  },
  {
    id: "l10",
    name: "Pepperoni Pizza Bagel",
    img: "/Special.png",
  },
  {
    id: "l11",
    name: "Turkey and Cheddar",
    img: "/Ham.png",
  },
  {
    id: "l12",
    name: "Chicken Salad",
    img: "/TT.png",
  },
   {
    id: "l13",
    name: "Albuquerque Turkey",
    img: "/TT.png",
  },
]);
const Bagels = ref([
  {
    id: "c1",
    name: "Plain Bagel",
    img: "EBB-Bagel-Classic-Plain-1.jpg",
  },
  {
    id: "c2",
    name: "Cinnamon Raisin Bagel",
    img: "EBB-Bagel-Classic-Cinnamon-Raisin.jpg",
  },
  {
    id: "c3",
    name: "Everything Bagel",
    img: "EBB-Bagel-Classic-Everything.jpg",
  },
  {
    id: "c4",
    name: "Ancient Grain Bagel",
    img: "EBB-Bagel-Classic-Ancient-Grain.jpg",
  },
  {
    id: "c5",
    name: "Sesame Seed Bagel",
    img: "EBB-Bagel-Classic-Sesame-Seed.jpg",
  },
  {
    id: "c6",
    name: "Cheesy Hashbrown Bagel",
    img: "EBB-Bagel-Gourmet-Cheesy-Hashbrown.jpg",
  },
    {
    id: "c7",
    name: "Six Cheese Bagel",
    img: "EBB-Bagel-Gourmet-Six-Cheese.jpg",
  },
  {
    id: "c8",
    name: "Asiago Bagle",
    img: "EBB-Bagel-Signature-Asiago-1.jpg",
  },
  {
    id: "c9",
    name: "Blueberry Bagel",
    img: "EBB-Bagel-Signature-Blueberry.jpg",
  },
  {
    id: "c10",
    name: "Chocolate Chip Bagel",
    img: "EBB-Bagel-Signature-Chocolate-Chip.jpg",
  },
]);
const Smears = ref([
  {
    id: "s1",
    name: "Plain",
    img: "PlainSmear.png",
  },
  {
    id: "s2",
    name: "Strawberry",
    img: "Straberry.png",
  },
  {
    id: "s3",
    name: "Almond",
    img: "Almond.png",
  },
  {
    id: "s4",
    name: "Country Pepper",
    img: "CountryPepper.png",
  },
  {
    id: "s5",
    name: "Garden Veggie",
    img: "GardenVeggie.png",
  },
  {
    id: "s6",
    name: "Onion Chive",
    img: "OnionChive.png",
  },
]);
const Other = ref([
  {
    id: "o1",
    name: "Cinnamon Chip Muffin",
    img: "650x6501-1.jpeg",
  },
  {
    id: "o2",
    name: "Cinnamon Bliss Rolls",
    img: "EBB-Cinnamon-Bliss-Roll-1.jpg",
  },
  {
    id: "o3",
    name: "Blueberry Muffin",
    img: "EBB-Sweets-BlueberryMuffin-650x6501-1.jpg",
  },
  {
    id: "o4",
    name: "Chocolate Chip Cookie",
    img: "EBB-Sweets-ChocolateChipCookie-650x6501-1.jpg",
  },
  {
    id: "o5",
    name: "Twice Baked Hashbrown",
    img: "EBB-Twice-Baked-Hashbrown.jpg",
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

.cartList{
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
  display: grid;
  gap: 12px;
  align-items: stretch; /* ✅ important: prevents centering shrink */
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

.cartMini{
  display:flex;
  align-items:center;
  gap:12px;
  flex:1;
  min-width:0;
}

.cartMiniImg{
  width:54px;
  height:54px;
  border-radius:14px;
  overflow:hidden;
  border: 1px solid rgba(75,52,41,0.12);
  background:#fff;
  flex:0 0 auto;
}

.cartMiniImg img{
  width:100%;
  height:100%;
  object-fit:cover;
  display:block;
}

.cartMiniInfo{
  flex:1;
  min-width:0;
}

.cartMiniName{
  font-weight:1000;
  font-size:15px;
  line-height:1.15;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}

.cartMiniQty{
  margin-top:4px;
  font-weight:900;
  opacity:0.75;
  font-size:13px;
}

/* make each cart row fill the panel width */
.cartItem{
  width: 100%;
  box-sizing: border-box;
}

/* RIGHT side column (price + remove) */
.cartRight{
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex: 0 0 auto;
  min-width: 90px;
  text-align: right;
}

.cartPrice{
  font-weight: 1000;
  font-size: 16px;
}

.cartMiniPrice{
  font-weight:1000;
  font-size:16px;
}

.cartList{
  justify-items: stretch;
  align-items: stretch;
}

.cartMiniMeta{
  margin-top:4px;
  display:flex;
  gap:10px;
  align-items:center;
  opacity:0.85;
  font-weight:900;
  font-size:13px;
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
  gap: 20px;
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

.tileNameRow{
  display: flex;                 /* ✅ not inline-flex */
  align-items: center;
  justify-content: space-between; /* ✅ pushes + to the right */
  gap: 12px;
  width: 80%;                    /* ✅ match tileImg width */
}


.tileName{
  font-size: 18px;
  font-weight: 1000;
  color: var(--brown);

  flex: 1;               /* ✅ take remaining space */
  min-width: 0;          /* ✅ important */
  white-space: normal;   /* ✅ allow 2 lines */
  line-height: 1.15;
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

.cartThumb{
  width: 56px;
  height: 56px;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: #fff;
  display: grid;
  place-items: center;
}

.cartThumb img{
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cartThumbFallback{
  font-weight: 1000;
  opacity: 0.6;
  font-size: 12px;
}

.cartMeta{
  min-width: 0; /* ✅ SUPER IMPORTANT */
}

.cartName{
  font-weight: 1000;
  font-size: 14px;
  line-height: 1.2;

  /* ✅ stops long names pushing price away */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cartSub{
  margin-top: 4px;
  font-weight: 900;
  opacity: 0.7;
  font-size: 12px;
}

.cartRight{
  display: grid;
  justify-items: end;
  gap: 6px;
}

.cartPrice{
  font-weight: 1000;
  font-size: 14px;
  white-space: nowrap;
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

.cartItem{
  display: grid;
  grid-template-columns: 64px 1fr auto;
  gap: 12px;
  align-items: center;

  border: 1px solid rgba(75, 52, 41, 0.12);
  border-radius: 16px;
  padding: 10px;
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
