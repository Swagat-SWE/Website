<template>
  <div class="page">
    <div class="topRow">
      <div>
        <h1 class="title">My Orders</h1>
        <p class="sub">Here are your completed orders. Tap re-order to add them back to your cart.</p>
      </div>

      <NuxtLink class="checkoutBtn" to="/checkout">
        Go to Checkout ({{ cartCount }})
      </NuxtLink>
    </div>

    <div class="navLinks">
      <NuxtLink class="navItem" to="/">Main Page</NuxtLink>
      <NuxtLink class="navItem" to="/food">Food Menu</NuxtLink>
      <NuxtLink class="navItem" to="/drinks">Drinks Menu</NuxtLink>
      <NuxtLink class="navItem" to="/contact">Contact</NuxtLink>
    </div>

    <div v-if="loading" class="emptyCard">
      Loading your completed orders...
    </div>

    <div v-else-if="!isLoggedIn" class="emptyCard">
      You must sign in to view your completed orders.
      <div class="emptyActions">
        <NuxtLink class="primaryBtn" to="/login">Go to Login</NuxtLink>
      </div>
    </div>

    <div v-else-if="orders.length === 0" class="emptyCard">
      You do not have any completed orders yet.
    </div>

    <div v-else class="ordersWrap">
      <div class="orderCard" v-for="order in orders" :key="order.id">
        <div class="orderHeader">
          <div>
            <div class="orderNumber">Order #{{ order.orderNumber }}</div>
            <div class="orderMeta">
              Completed • {{ formatDate(order.updatedAt || order.createdAt) }}
            </div>
          </div>

          <div class="headerRight">
            <span class="statusBadge">{{ order.status }}</span>
            <button class="reorderBtn" @click="reorder(order)">
              Re-order
            </button>
          </div>
        </div>

        <div class="itemsList">
          <div class="itemRow" v-for="item in order.items" :key="item.id">
            <div class="itemThumb">
              <img
                v-if="resolveImage(item)"
                :src="resolveImage(item)"
                :alt="item.name"
              />
              <div v-else class="thumbFallback">PIC</div>
            </div>

            <div class="itemLeft">
              <div class="itemName">{{ item.name }}</div>
              <div class="itemDetails">
                Qty: {{ item.quantity }}
                <span v-if="formatCustomizations(item.customizations)">
                  • {{ formatCustomizations(item.customizations) }}
                </span>
              </div>
            </div>

            <div class="itemRight">
              ${{ centsToDollars(item.lineTotal).toFixed(2) }}
            </div>
          </div>
        </div>

        <div class="orderFooter">
          <div class="footerRow">
            <span>Subtotal</span>
            <b>${{ centsToDollars(order.subtotal).toFixed(2) }}</b>
          </div>
          <div class="footerRow">
            <span>Tax</span>
            <b>${{ centsToDollars(order.tax).toFixed(2) }}</b>
          </div>
          <div class="footerRow totalRow">
            <span>Total</span>
            <b>${{ centsToDollars(order.total).toFixed(2) }}</b>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import { useApi } from "~/composables/useApi"

const api = useApi()

const cart = useState("cart", () => [])
const orders = ref([])
const loading = ref(true)
const isLoggedIn = ref(false)

const cartCount = computed(() =>
  cart.value.reduce((sum, item) => sum + (item.qty || 1), 0)
)

/*
  Image map from your food.vue names/images.
  These are used when showing completed orders
  and when re-ordering them back into cart.
*/
const IMAGE_BY_NAME = {
  // Breakfast
  "Farm House Egg Sandwich": "EBB-SignatureEgg-Farmhouse-650x6501-1.jpg",
  "All Nighter Egg Sandwich": "EBB-SignatureEgg-All-Nighter-650x6501-1.jpg",
  "Garden Avocado Egg Sandwich": "EBB-SignatureEgg-GardenAvocado-650x6501-1.jpg",
  "Bacon Cheddar Egg Sandwich": "EBB-Baconcheddar-Classic-Egg-Sandwich-1.jpg",
  "Cheddar Egg Sandwich": "EBB-Cheddar-Classic-Egg-Sandwich.jpg",
  "Ham Swiss Egg Sandwich": "EBB-Ham-Swiss-Classic-Egg-Sandwich.jpg",
  "Turkey Sausage Egg Sandwich": "EBB-Turkey-Sausage-Cheddar-Classic-Egg-Sandwich.jpg",
  "Bacon Avocado Tomato Sandwich": "EBB-SignatureEgg-BaconAvocadoTomatoEggWhite-650x6501-1.jpg",
  "Santa Fe Egg White Sandwich": "EBB-SignatureEgg-SantaFeEggWhite-650x6501-1.jpg",
  "Texas Brisket Egg Sandwich": "EBB-SignatureEgg-TexasBrisket-650x6501-1.jpg",
  "Big Breakfast Burrito": "Burriro.png",
  "Avocado Toast": "ToastAvo.png",

  // Lunch
  "Tastey Turkey Sandwich": "/Tastey.png",
  "Avocado Veg Out Sandwich": "/Veg.png",
  "Nova Lox Sandwich": "/Nova.png",
  "Pepperoni Chicken": "/Special.png",
  "Ham & Swiss Sandwich": "/Ham.png",
  "Turkey, Bacon & Avocado Sandwich": "/TT.png",
  "Spicy Chicken": "/Chicken.png",
  "Cheesy Veggie Melt": "/Veg.png",
  "Cheese Pizza Bagel": "ChessyPiz.png",
  "Pepperoni Pizza Bagel": "PeppyPiz.png",
  "Turkey and Cheddar": "/Ham.png",
  "Chicken Salad": "/TT.png",
  "Albuquerque Turkey": "/TT.png",

  // Bagels
  "Plain Bagel": "EBB-Bagel-Classic-Plain-1.jpg",
  "Cinnamon Raisin Bagel": "EBB-Bagel-Classic-Cinnamon-Raisin.jpg",
  "Everything Bagel": "EBB-Bagel-Classic-Everything.jpg",
  "Ancient Grain Bagel": "EBB-Bagel-Classic-Ancient-Grain.jpg",
  "Sesame Seed Bagel": "EBB-Bagel-Classic-Sesame-Seed.jpg",
  "Cheesy Hashbrown Bagel": "EBB-Bagel-Gourmet-Cheesy-Hashbrown.jpg",
  "Six Cheese Bagel": "EBB-Bagel-Gourmet-Six-Cheese.jpg",
  "Asiago Bagel": "EBB-Bagel-Signature-Asiago-1.jpg",
  "Blueberry Bagel": "EBB-Bagel-Signature-Blueberry.jpg",
  "Chocolate Chip Bagel": "EBB-Bagel-Signature-Chocolate-Chip.jpg",

  // Smears
  "Plain": "PlainSmear.png",
  "Strawberry": "Straberry.png",
  "Almond": "Almond.png",
  "Country Pepper": "CountryPepper.png",
  "Garden Veggie": "GardenVeggie.png",
  "Onion Chive": "OnionChive.png",

  // Other
  "Cinnamon Chip Muffin": "650x6501-1.jpeg",
  "Cinnamon Bliss Rolls": "EBB-Cinnamon-Bliss-Roll-1.jpg",
  "Blueberry Muffin": "EBB-Sweets-BlueberryMuffin-650x6501-1.jpg",
  "Chocolate Chip Cookie": "EBB-Sweets-ChocolateChipCookie-650x6501-1.jpg",
  "Twice Baked Hashbrown": "EBB-Twice-Baked-Hashbrown.jpg",

  // Drinks
  "Classic Cold Brew": "/ClassicColdBrew.png",
  "Chocolate Cream Cold Brew": "/ChocolateCreamColdBrew.png",
  "Vanilla Cream Cold Brew": "/VanillaCreamColdBrew.png",
  "Caramel Cream Cold Brew": "/CaramelCreamColdBrew.png",
  "Chocolate Cold Brew Shake": "/ChocolateColdBrewShake.png",
  "Vanilla Cold Brew Shake": "/VanillaColdBrewShake.png",
  "Mocha": "/Mocha.png",
  "Caramel Macchiato": "/CaramelMacchiato.png",
  "Latte": "/Latte.png",
  "Chai Tea Latte": "/ChaiTeaLatte.png",
  "Hot Chocolate": "/HotChocolate.png",
  "Coffee": "/HotCoffee.png",
  "Hot Tea": "/HotTea.png",
  "Iced Tea": "/IcedTea.png",
  "Strawberry Banana Smoothie": "/Strawberry Banana Smoothie.png",
  "Pepsi": "/Pepsi.png",
  "Diet Pepsi": "/DietPepsi.png",
  "Mountain Dew": "/MountainDew.png",
  "Diet Mountain Dew": "/DietMountainDew.png",
  "Orange Juice": "/OrangeJuice.png",
  "Grape Juice": "/GrapeJuice.png",
  "Apple Juice": "/AppleJuice.png",
  "Raspberry Iced Tea": "/RaspberryIcedTea.png",
  "Unsweetened Iced Tea": "/UnsweetenedIcedTea.png",
  "Chocolate Milk": "/ChocolateMilk.png",
  "White Milk": "/WhiteMilk.png",
  "Water": "/Water.png",
  "Lemon Lime Gatorade": "/YellowGatorade.png",
  "Cool Blue Gatorade": "/CoolBlueGatorade.png",
}

const CATEGORY_BY_NAME = {
  // Breakfast + Lunch => sandwich
  "Farm House Egg Sandwich": "sandwich",
  "All Nighter Egg Sandwich": "sandwich",
  "Garden Avocado Egg Sandwich": "sandwich",
  "Bacon Cheddar Egg Sandwich": "sandwich",
  "Cheddar Egg Sandwich": "sandwich",
  "Ham Swiss Egg Sandwich": "sandwich",
  "Turkey Sausage Egg Sandwich": "sandwich",
  "Bacon Avocado Tomato Sandwich": "sandwich",
  "Santa Fe Egg White Sandwich": "sandwich",
  "Texas Brisket Egg Sandwich": "sandwich",
  "Big Breakfast Burrito": "sandwich",
  "Avocado Toast": "sandwich",
  "Tastey Turkey Sandwich": "sandwich",
  "Avocado Veg Out Sandwich": "sandwich",
  "Nova Lox Sandwich": "sandwich",
  "Pepperoni Chicken": "sandwich",
  "Ham & Swiss Sandwich": "sandwich",
  "Turkey, Bacon & Avocado Sandwich": "sandwich",
  "Spicy Chicken": "sandwich",
  "Cheesy Veggie Melt": "sandwich",
  "Cheese Pizza Bagel": "sandwich",
  "Pepperoni Pizza Bagel": "sandwich",
  "Turkey and Cheddar": "sandwich",
  "Chicken Salad": "sandwich",
  "Albuquerque Turkey": "sandwich",

  // Bagels
  "Plain Bagel": "bagel",
  "Cinnamon Raisin Bagel": "bagel",
  "Everything Bagel": "bagel",
  "Ancient Grain Bagel": "bagel",
  "Sesame Seed Bagel": "bagel",
  "Cheesy Hashbrown Bagel": "bagel",
  "Six Cheese Bagel": "bagel",
  "Asiago Bagel": "bagel",
  "Blueberry Bagel": "bagel",
  "Chocolate Chip Bagel": "bagel",

  // Smears
  "Plain": "shmear",
  "Strawberry": "shmear",
  "Almond": "shmear",
  "Country Pepper": "shmear",
  "Garden Veggie": "shmear",
  "Onion Chive": "shmear",

  // Other
  "Cinnamon Chip Muffin": "other",
  "Cinnamon Bliss Rolls": "other",
  "Blueberry Muffin": "other",
  "Chocolate Chip Cookie": "other",
  "Twice Baked Hashbrown": "other",
}

onMounted(async () => {
  await loadOrders()
})

async function loadOrders() {
  loading.value = true

  try {
    const me = await api.get("/api/me")

    if (!me?.ok || me?.type !== "user" || !me?.user) {
      isLoggedIn.value = false
      orders.value = []
      return
    }

    isLoggedIn.value = true

    const data = await api.get("/api/orders/my-completed")

    if (data?.ok) {
      orders.value = Array.isArray(data.orders) ? data.orders : []
    } else {
      orders.value = []
    }
  } catch (err) {
    console.error("Failed to load completed orders:", err)
    isLoggedIn.value = false
    orders.value = []
  } finally {
    loading.value = false
  }
}

function centsToDollars(cents) {
  return Number(cents || 0) / 100
}

function formatDate(dateString) {
  if (!dateString) return "Unknown date"

  const date = new Date(dateString)
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function formatCustomizations(customizations) {
  if (!customizations || typeof customizations !== "object") return ""

  const parts = []

  if (customizations.bagel) parts.push(`Bagel: ${customizations.bagel}`)
  if (customizations.shmear) parts.push(`Shmear: ${customizations.shmear}`)
  if (Array.isArray(customizations.extras) && customizations.extras.length) {
    parts.push(`Extras: ${customizations.extras.join(", ")}`)
  }

  if (customizations.size) parts.push(`Size: ${customizations.size}`)
  if (customizations.milk) parts.push(`Milk: ${customizations.milk}`)
  if (customizations.sweetener) parts.push(`Sweetener: ${customizations.sweetener}`)
  if (customizations.ice) parts.push(`Ice: ${customizations.ice}`)
  if (Array.isArray(customizations.upgrades) && customizations.upgrades.length) {
    parts.push(`Add-ons: ${customizations.upgrades.join(", ")}`)
  }

  if (customizations.notes) parts.push(`Notes: ${customizations.notes}`)

  return parts.join(" • ")
}

function resolveImage(item) {
  return IMAGE_BY_NAME[item?.name] || ""
}

function resolveCategory(name, customizations) {
  if (CATEGORY_BY_NAME[name]) return CATEGORY_BY_NAME[name]

  const looksLikeDrink =
    customizations?.size ||
    customizations?.milk ||
    customizations?.sweetener ||
    customizations?.ice ||
    (Array.isArray(customizations?.upgrades) && customizations.upgrades.length > 0)

  return looksLikeDrink ? "drink" : "other"
}

function reorder(order) {
  if (!order?.items?.length) return

  for (const oldItem of order.items) {
    const custom = oldItem.customizations ?? null
    const img = IMAGE_BY_NAME[oldItem.name] || ""
    const category = resolveCategory(oldItem.name, custom)
    const unitPrice = centsToDollars(oldItem.unitPrice)

    const existing = cart.value.find((x) => {
      const sameName = x.name === oldItem.name
      const samePrice = Number(x.priceEach || 0) === unitPrice
      const sameCustom =
        JSON.stringify(x.custom || null) === JSON.stringify(custom || null)

      return sameName && samePrice && sameCustom
    })

    if (existing) {
      existing.qty += oldItem.quantity
    } else {
      cart.value.push({
        id: `reorder-${oldItem.id}`,
        category,
        name: oldItem.name,
        qty: oldItem.quantity,
        img,
        basePrice: unitPrice,
        priceEach: unitPrice,
        custom,
      })
    }
  }

  navigateTo("/checkout")
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 28px;
  background: #f7f3ee;
  font-family: Arial, sans-serif;
}

.topRow {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
}

.title {
  margin: 0;
  font-size: 34px;
  font-weight: 900;
  color: inherit;
}

.sub {
  margin-top: 8px;
  color: inherit;
  opacity: 0.8;
  font-size: 15px;
}

.navLinks {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
  margin-bottom: 22px;
}

.navItem {
  text-decoration: none;
  background: #fff;
  color: #111;
  border: 1px solid #ddd;
  padding: 10px 14px;
  border-radius: 12px;
  font-weight: 800;
}

.navItem:hover {
  border-color: #f4b316;
}

.checkoutBtn {
  display: inline-block;
  padding: 12px 16px;
  border-radius: 12px;
  text-decoration: none;
  background: #f4b316;
  color: #111;
  font-weight: 900;
}

.emptyCard {
  margin-top: 20px;
  background: #fff;
  border: 1px solid #e7ddd1;
  border-radius: 18px;
  padding: 24px;
  color: #444;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.emptyActions {
  margin-top: 16px;
}

.primaryBtn {
  display: inline-block;
  text-decoration: none;
  background: #111;
  color: #fff;
  padding: 10px 14px;
  border-radius: 12px;
  font-weight: 800;
}

.ordersWrap {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.orderCard {
  background: #fff;
  border: 1px solid #e7ddd1;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.06);
}

.orderHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.orderNumber {
  font-size: 20px;
  font-weight: 900;
  color: #111;
}

.orderMeta {
  margin-top: 4px;
  color: #777;
  font-size: 14px;
}

.headerRight {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.statusBadge {
  background: #e9f8ee;
  color: #167c3a;
  font-weight: 900;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 13px;
  border: 1px solid #bfe4ca;
}

.reorderBtn {
  padding: 10px 14px;
  border-radius: 12px;
  border: none;
  background: #111;
  color: #fff;
  font-weight: 900;
  cursor: pointer;
}

.reorderBtn:hover {
  opacity: 0.92;
}

.itemsList {
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-top: 1px solid #f0e6db;
  border-bottom: 1px solid #f0e6db;
  padding: 14px 0;
}

.itemRow {
  display: grid;
  grid-template-columns: 64px 1fr auto;
  gap: 14px;
  align-items: center;
}

.itemThumb {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: #fff;
  display: grid;
  place-items: center;
}

.itemThumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.thumbFallback {
  font-weight: 900;
  opacity: 0.6;
  font-size: 12px;
}

.itemLeft {
  min-width: 0;
}

.itemName {
  font-weight: 900;
  color: #111;
}

.itemDetails {
  margin-top: 4px;
  color: #666;
  font-size: 14px;
  line-height: 1.45;
}

.itemRight {
  font-weight: 900;
  color: #111;
  white-space: nowrap;
}

.orderFooter {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footerRow {
  display: flex;
  justify-content: space-between;
  color: #444;
}

.totalRow {
  margin-top: 4px;
  padding-top: 10px;
  border-top: 1px dashed #ddd;
  font-size: 17px;
  color: #111;
}

@media (max-width: 768px) {
  .page {
    padding: 18px;
  }

  .title {
    font-size: 28px;
  }

  .orderHeader,
  .topRow {
    flex-direction: column;
    align-items: stretch;
  }

  .itemRow {
    grid-template-columns: 56px 1fr;
  }

  .itemRight {
    grid-column: 2;
  }

  .headerRight {
    justify-content: flex-start;
  }

  .checkoutBtn {
    width: fit-content;
  }
}

:global(html.dark) .title {
  color: #fff7ee !important;
}

:global(html.dark) .sub {
  color: #b9aca0 !important;
}

:global(html.dark) .emptyCard,
:global(html.dark) .orderCard {
  background: #2b2420 !important;
  color: #fff7ee !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.28) !important;
}

:global(html.dark) .primaryBtn,
:global(html.dark) .reorderBtn {
  background: #111 !important;
  color: #fff7ee !important;
}

:global(html.dark) .orderNumber,
:global(html.dark) .itemName,
:global(html.dark) .itemRight,
:global(html.dark) .totalRow {
  color: #fff7ee !important;
}

:global(html.dark) .orderMeta,
:global(html.dark) .itemDetails,
:global(html.dark) .footerRow,
:global(html.dark) .emptyCard {
  color: #c7bbb0 !important;
}

:global(html.dark) .itemsList {
  border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
}

:global(html.dark) .itemThumb {
  background: rgba(255, 255, 255, 0.04) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
}

:global(html.dark) .statusBadge {
  background: rgba(71, 161, 98, 0.16) !important;
  color: #8ae0a4 !important;
  border: 1px solid rgba(138, 224, 164, 0.18) !important;
}

:global(html.dark) .totalRow {
  border-top: 1px dashed rgba(255, 255, 255, 0.14) !important;
}
</style>