<template>
  <div class="page">
    <!-- Sidebar (UNCHANGED) -->
    <aside class="sidebar">
      <div class="sidebarTop">
        <img src="/Logo.png" alt="Einstein Bros Logo" class="logoImg" />
      </div>

      <nav class="nav">
        <NuxtLink class="navItem" to="/food">Food Menu</NuxtLink>
        <NuxtLink class="navItem" to="/drinks">Drinks Menu</NuxtLink>
        <NuxtLink class="navItem" to="/contact">Contact</NuxtLink>

        <button class="navItem reviewBtn" type="button" @click="toggleReview">
          Review
          <span class="chev" :class="{ open: showReview }">▾</span>
        </button>

        <div v-if="showReview" class="reviewPanel">
          <div class="starsRow">
            <button
              v-for="n in 5"
              :key="n"
              class="starBtn"
              type="button"
              :class="{ on: n <= (hoverRating || rating) }"
              @mouseenter="hoverRating = n"
              @mouseleave="hoverRating = 0"
              @click="rating = n"
            >★</button>
          </div>

          <div class="ratingText">
            <span v-if="rating === 0">Tap a star to rate</span>
            <span v-else>You rated: <b>{{ rating }}/5</b></span>
          </div>

          <label class="commentLabel">Comment</label>
          <textarea v-model="comment" class="commentBox" rows="4" />

          <button class="primaryBtn" @click="submitReview">Submit</button>
          <p v-if="submitted" class="submitted">Thanks! Review saved locally.</p>
        </div>
      </nav>
    </aside>

    <!-- Main -->
    <main class="main">
      <!-- Topbar (UNCHANGED) -->
      <header class="topbar">
        <div class="topbarLeft">
          
        </div>

        <div class="topbarRight">
          <button class="signInBtn">Sign In</button>
          <button class="cartBtn" @click="toggleCart">
            🛒 <span class="cartCount">{{ cartItems.length }}</span>
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
                <span class="tileName">{{ item.name }}</span>
                <button class="plusBtn" @click="addToCart(item.name)">+</button>
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
                <span class="tileName">{{ item.name }}</span>
                <button class="plusBtn" @click="addToCart(item.name)">+</button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- CART PANEL -->
      <div class="overlay" v-if="showCart" @click="showCart = false" />
      <aside class="cartPanel" :class="{ open: showCart }">
        <div class="cartHeader">
          <h3>Your Cart</h3>
          <button class="xBtn" @click="showCart = false">✕</button>
        </div>

        <div v-if="cartItems.length === 0" class="emptyCart">
          No items yet.
        </div>

        <ul v-else class="cartList">
          <li v-for="(item, idx) in cartItems" :key="idx" class="cartItem">
            <span>{{ item }}</span>
            <button class="removeBtn" @click="removeFromCart(idx)">Remove</button>
          </li>
        </ul>

        <button class="checkoutBtn" @click="goToCheckout">Checkout</button>
      </aside>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";





/* CART */
const showCart = ref(false);
const cartItems = ref([]);
function toggleCart() { showCart.value = !showCart.value; }
function addToCart(name) { cartItems.value.push(name); showCart.value = true; }
function removeFromCart(i) { cartItems.value.splice(i, 1); }
function goToCheckout() { navigateTo("/checkout"); }

/* DRINK DATA */
const coldDrinks = ref([
  { id: "c1", name: "Classic Cold Brew", img: "ClassicColdBrew.png" },
  { id: "c2", name: "Chocolate Cream Cold Brew", img: "ChocolateCreamColdBrew.png" },
  { id: "c3", name: "Vanilla Cream Cold Brew", img: "VanillaCreamColdBrew.png" },
]);
</script>

<style scoped>
</style>