<template>
  <div class="page">
    <h1>Ordering</h1>
    <p class="sub">Click an item to add it to your cart.</p>
        <NuxtLink class="navItem" to="/">Main Page</NuxtLink>
        <NuxtLink class="navItem" to="/food">Food Menu</NuxtLink>
        <NuxtLink class="navItem" to="/drinks">Drinks Menu</NuxtLink>
        <NuxtLink class="navItem" to="/contact">Contact</NuxtLink>
    <div class="list">
      <div class="row" v-for="item in menu" :key="item.id">
        <div>
          <div class="name">{{ item.name }}</div>
          <div class="details">{{ item.details }}</div>
        </div>

        <div class="right">
          <div class="price">${{ item.priceEach.toFixed(2) }}</div>
          <button class="btn" @click="add(item)">Add</button>
        </div>
      </div>
    </div>

    <NuxtLink class="checkoutBtn" to="/checkout">
      Go to Checkout ({{ cartCount }})
    </NuxtLink>
  </div>
</template>

<script setup>
import { computed } from "vue"

// shared cart across pages
const cart = useState("cart", () => [])

// simple menu (you can change these later)
const menu = [
  { id: 1, name: "All Nighter", priceEach: 8.99, details: "bagel, cheese, eggs, meat" },
  { id: 2, name: "Cold Brew", priceEach: 4.25, details: "size: medium" },
  { id: 3, name: "Blueberry Muffin", priceEach: 3.25, details: "fresh baked" },
]

// cart count (total items)
const cartCount = computed(() =>
  cart.value.reduce((sum, item) => sum + (item.qty || 1), 0)
)

function add(item) {
  // if it already exists, increase qty
  const existing = cart.value.find((x) => x.name === item.name)

  if (existing) {
    existing.qty += 1
  } else {
    cart.value.push({
      name: item.name,
      qty: 1,
      priceEach: item.priceEach,
      details: item.details,
    })
  }
}
</script>

<style scoped>
.page {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.sub {
  color: #666;
  margin-top: 6px;
}

.list {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 12px;
  background: #fff;
}

.name {
  font-weight: 800;
}

.details {
  font-size: 13px;
  color: #666;
  margin-top: 4px;
}

.right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.price {
  font-weight: 800;
}

.btn {
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #111;
  background: #111;
  color: #fff;
  cursor: pointer;
}

.checkoutBtn {
  display: inline-block;
  margin-top: 16px;
  padding: 10px 14px;
  border-radius: 12px;
  text-decoration: none;
  background: #f4b316;
  color: #111;
  font-weight: 900;
}
</style>
