<template>
  <div class="checkout">
    <h1 class="pageTitle">CHECKOUT</h1>

    <div class="layout">
      <!-- LEFT: cart list -->
      <section class="left">
        <h2 class="sectionTitle">Your Shopping Cart</h2>

        <div v-if="cart.length === 0" class="empty">
          Your cart is empty. Click “Add items” to go back.
        </div>

        <div v-else class="cartList">
          <div class="cartHeaderRow">
            <span class="colItem">Item</span>
            <span class="colTotal">Item Total</span>
          </div>

          <div v-for="(item, i) in cart" :key="i" class="cartRow">
            <!-- qty controls -->
            <div class="qtyCol">
              <button class="qtyBtn" type="button" @click="decrease(i)">−</button>
              <span class="qtyNum">{{ item.qty }}</span>
              <button class="qtyBtn" type="button" @click="increase(i)">+</button>
            </div>

            <!-- pic box -->
            <div class="pic">PIC</div>

            <!-- item info -->
            <div class="info">
              <div class="nameRow">
                <div class="name">{{ item.name }}</div>
                <button class="editBtn" type="button" @click="editItem(i)">edit</button>
              </div>

              <div class="details">
                <div v-if="item.details">{{ item.details }}</div>
                <div v-else class="muted">No customizations</div>
              </div>
            </div>

            <!-- item total -->
            <div class="itemTotal">
              ${{ lineTotal(item).toFixed(2) }}
            </div>
          </div>
        </div>

        <div class="bottomButtons">
          <button class="btn ghost" type="button" @click="goAddItems">
            Add items
          </button>
        </div>
      </section>

      <!-- RIGHT: totals + place order -->
      <aside class="right">
        <div class="summary">
          <div class="sumRow">
            <span>Subtotal:</span>
            <span>${{ subtotal.toFixed(2) }}</span>
          </div>
          <div class="sumRow">
            <span>Tax:</span>
            <span>${{ tax.toFixed(2) }}</span>
          </div>

          <hr class="line" />

          <div class="sumRow total">
            <span>Order Total:</span>
            <span>${{ total.toFixed(2) }}</span>
          </div>
        </div>

        <button class="btn primary" type="button" :disabled="cart.length === 0" @click="placeOrder">
          Add payment + place order
        </button>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"

/**
 * Shared cart state across pages.
 * This is the only thing you need to be consistent with.
 *
 * Each cart item should look like:
 * { name: "All Nighter", qty: 1, priceEach: 8.99, details: "bagel, cheese, meat" }
 */
const cart = useState("cart", () => [
  // demo items so you SEE the layout right away (delete later if you want)
  { name: "All Nighter", qty: 1, priceEach: 8.99, details: "bagel, cheese, meat" },
  { name: "Caramel Cream Cold Brew", qty: 1, priceEach: 4.75, details: "size: SM" },
])

const TAX_RATE = 0.08

function lineTotal(item) {
  return (item.priceEach || 0) * (item.qty || 1)
}

const subtotal = computed(() =>
  cart.value.reduce((sum, item) => sum + lineTotal(item), 0)
)

const tax = computed(() => subtotal.value * TAX_RATE)
const total = computed(() => subtotal.value + tax.value)

function increase(i) {
  cart.value[i].qty++
}

function decrease(i) {
  cart.value[i].qty--
  if (cart.value[i].qty <= 0) cart.value.splice(i, 1)
}

// For now, edit just sends them back to ordering page.
// Later you can pass an id/query param if needed.
function editItem(i) {
  navigateTo("/ordering")
}

function goAddItems() {
  navigateTo("/ordering")
}

function placeOrder() {
  // Since you're only doing checkout BEFORE order goes through,
  // this can just route to the "thank you / tracking" page later.
  // For now, show a message:
  alert("Order placed (demo). Next step would be confirmation page.")
  // navigateTo("/ordering/confirmation")  // if you make that page later
}
</script>

<style scoped>
.checkout {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.pageTitle {
  margin: 0 0 16px;
  letter-spacing: 1px;
}

.layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 18px;
}

/* left side */
.left {
  border: 1px solid #ccc;
  padding: 14px;
  background: #fff;
}

.sectionTitle {
  margin: 0 0 10px;
  font-size: 18px;
}

.empty {
  padding: 18px 0;
  color: #666;
}

.cartHeaderRow {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  font-weight: 700;
}

.colItem { width: 70%; }
.colTotal { width: 30%; text-align: right; }

.cartRow {
  display: grid;
  grid-template-columns: 70px 60px 1fr 120px;
  gap: 12px;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #eee;
}

.qtyCol {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qtyBtn {
  width: 28px;
  height: 28px;
  border: 1px solid #ccc;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
}

.qtyNum {
  width: 18px;
  text-align: center;
  font-weight: 700;
}

.pic {
  width: 54px;
  height: 54px;
  border: 1px solid #bbb;
  display: grid;
  place-items: center;
  font-size: 12px;
}

.nameRow {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.name {
  font-weight: 800;
}

.editBtn {
  border: none;
  background: transparent;
  text-decoration: underline;
  cursor: pointer;
  color: #333;
  font-size: 12px;
}

.details {
  margin-top: 4px;
  font-size: 13px;
}

.muted {
  color: #777;
}

.itemTotal {
  text-align: right;
  font-weight: 800;
}

.bottomButtons {
  margin-top: 14px;
}

/* right side */
.right {
  border: 1px solid #ccc;
  padding: 14px;
  background: #fff;
  height: fit-content;
}

.summary {
  margin-bottom: 14px;
}

.sumRow {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
}

.line {
  border: none;
  border-top: 1px solid #eee;
  margin: 10px 0;
}

.total {
  font-weight: 900;
  font-size: 16px;
}

.btn {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #111;
  cursor: pointer;
}

.btn.primary {
  width: 100%;
  background: #111;
  color: #fff;
}

.btn.primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn.ghost {
  background: #fff;
  border-color: #ccc;
}

/* responsive */
@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
