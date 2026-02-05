<!-- app/pages/tracking.vue -->
<template>
  <div class="page">
    <!-- Left Sidebar (match your theme) -->
    <aside class="sidebar">
      <div class="sidebarTop">
        <img src="/Logo.png" alt="Einstein Bros Logo" class="logoImg" />
      </div>

      <nav class="nav">
        <NuxtLink class="navItem" to="/">Main Page</NuxtLink>
        <NuxtLink class="navItem" to="/food">Food Menu</NuxtLink>
        <NuxtLink class="navItem" to="/drinks">Drinks Menu</NuxtLink>
        <NuxtLink class="navItem" to="/contact">Contact</NuxtLink>
      </nav>
    </aside>

    <!-- Main -->
    <main class="main">
      <header class="topbar">
        <div>
          <h1 class="title">TRACKING</h1>
          <div class="subtitle">Your bagel is on the belt. We’ll update you live 😄</div>
        </div>

        <button class="cartBtn" type="button" @click="navigateTo('/checkout')">
          ← Back to Checkout
        </button>
      </header>

      <!-- Conveyor Card -->
      <section class="card">
        <div class="cardHeader">
          <h2>Order Status</h2>
          <span class="muted">Order #{{ orderId }}</span>
        </div>

        <div class="beltWrap">
          <!-- Belt background -->
          <div class="belt">
            <div class="beltStripes" aria-hidden="true"></div>

            <!-- Neon progress rail -->
             <div class="rail" aria-hidden="true">
            <div class="railBase"></div>
            <div class="railGlow" :style="{ width: `${progressWidth}%` }"></div>
             </div>

            <!-- Stations -->
            <div class="stations">
              <div
                v-for="(s, i) in steps"
                :key="s.key"
                class="station"
                :class="{
                  done: i < statusIndex,
                  active: i === statusIndex,
                  oven: s.key === 'oven'
                }"
                :style="{ left: `${stationLeft(i)}%` }"
              >
                <div class="stationTop">
                  <div class="pill">
                    <span class="dot" />
                    <span class="label">{{ s.label }}</span>
                  </div>
                </div>

<div class="stationBase">
  <!-- ✅ ONLY show the oven at the oven station -->
  <template v-if="s.key === 'oven'">
    <div class="ovenBackdrop" aria-hidden="true"></div>

    <div class="ovenFx" aria-hidden="true">
      <div class="embers"></div>
      <div class="heatFx"></div>
    </div>

    <div
    v-if="statusIndex === i"
    class="heatWaves"
    aria-hidden="true">
    </div>

    <div class="ovenArt" aria-hidden="true">
      <div class="ovenGlowBg"></div>
      <div class="ovenEmbers"></div>

      <svg class="ovenSvg" viewBox="0 0 180 160" fill="none">
  <path
    d="M22 38
       C22 28 30 20 40 20
       H140
       C150 20 158 28 158 38
       V128
       C158 138 150 146 140 146
       H40
       C30 146 22 138 22 128
       V38Z"
    class="ovBody"
  />

  <!-- Top control strip -->
  <path d="M30 52 H150" class="ovLine" />

  <!-- Knobs -->
  <circle cx="56" cy="38" r="6" class="ovKnob" />
  <circle cx="90" cy="38" r="6" class="ovKnob" />
  <circle cx="124" cy="38" r="6" class="ovKnob" />

  <!-- Door window -->
  <path
    d="M44 68
       C44 58 52 50 62 50
       H118
       C128 50 136 58 136 68
       V120
       C136 130 128 138 118 138
       H62
       C52 138 44 130 44 120
       V68Z"
    class="ovWindow"
  />

  <!-- Rack lines -->
  <path d="M56 94 H124" class="ovRack" />
  <path d="M56 112 H124" class="ovRack2" />

  <!-- Warm glow inside -->
  <path
    d="M58 76
       C72 64 108 64 122 76
       C112 104 68 110 58 76Z"
    class="ovFire"
  />

  <!-- Little badge -->
  <path
    d="M84 147
       h12
       c4 0 6 2 6 6
       c0 4-2 6-6 6
       H84
       c-4 0-6-2-6-6
       c0-4 2-6 6-6Z"
    class="ovBadge"
  />
  <path d="M87 151 H95" class="ovBadgeLine" />
  <path d="M87 154 H93" class="ovBadgeLine" />
  <path d="M87 157 H95" class="ovBadgeLine" />
</svg>

    </div>

    <!-- ✅ ONLY when oven is ACTIVE -->
    <div v-if="statusIndex === i" class="heat" aria-hidden="true"></div>
  </template>

  <!-- ✅ If NOT oven, keep your normal T-shape -->
  <template v-else>
    <div class="post"></div>
    <div class="platform"></div>
  </template>
</div>



              </div>
            </div>

            <!-- Bagel cart (moves) -->
            <div
            class="bagelCart"\
            :class="{
            moving: isMoving,
            bounce: doBounce,
            oven: steps[statusIndex].key === 'oven'
            }"
            :style="{ left: `${bagelLeft}%` }"
            >

              <!-- Crumbs -->
              <div class="crumbs" aria-hidden="true">
                <span
                  v-for="c in crumbs"
                  :key="c.id"
                  class="crumb"
                  :style="{
                    left: c.x + 'px',
                    top: c.y + 'px',
                    transform: `translate(${c.dx}px, ${c.dy}px) rotate(${c.r}deg)`,
                    opacity: c.o
                  }"
                />
              </div>

              <div class="cart">
                <div class="cartTop" />

                <!-- Bagel -->
               <!-- Bagel (more realistic SVG) -->
                <svg class="bagelSvgReal" viewBox="0 0 64 64" aria-hidden="true">
                  <defs>
                <radialGradient id="bagelGradReal" cx="30%" cy="25%" r="80%">
                  <stop offset="0%" stop-color="#FFE2B8" />
                  <stop offset="55%" stop-color="#E9A760" />
                  <stop offset="100%" stop-color="#B8743D" />
                </radialGradient>
                
                <radialGradient id="holeGradReal" cx="40%" cy="35%" r="70%">
                  <stop offset="0%" stop-color="rgba(0,0,0,0.35)" />
                  <stop offset="100%" stop-color="rgba(0,0,0,0.75)" />
                </radialGradient>
              </defs>

  <!-- outer -->
  <circle cx="32" cy="32" r="21" fill="url(#bagelGradReal)" />
  <!-- inner hole -->
  <circle cx="32" cy="32" r="8.5" fill="url(#holeGradReal)" />

  <!-- highlight -->
  <path
    d="M18 26c4-9 20-14 28-4"
    fill="none"
    stroke="rgba(255,255,255,0.35)"
    stroke-width="5"
    stroke-linecap="round"
  />

  <!-- seeds -->
  <g fill="rgba(255,255,255,0.8)">
    <ellipse cx="21" cy="22" rx="2.2" ry="1.1" transform="rotate(20 21 22)" />
    <ellipse cx="27" cy="18" rx="2.1" ry="1.0" transform="rotate(-10 27 18)" />
    <ellipse cx="36" cy="18" rx="2.2" ry="1.1" transform="rotate(15 36 18)" />
    <ellipse cx="45" cy="23" rx="2.2" ry="1.1" transform="rotate(-18 45 23)" />
    <ellipse cx="46" cy="36" rx="2.2" ry="1.1" transform="rotate(12 46 36)" />
    <ellipse cx="40" cy="46" rx="2.2" ry="1.1" transform="rotate(-20 40 46)" />
    <ellipse cx="27" cy="47" rx="2.2" ry="1.1" transform="rotate(10 27 47)" />
    <ellipse cx="18" cy="36" rx="2.2" ry="1.1" transform="rotate(-10 18 36)" />
  </g>
</svg>


                <div class="wheels" aria-hidden="true">
                  <span class="wheel" />
                  <span class="wheel" />
                </div>
              </div>

              <!-- Motion blur trail -->
              <div v-if="isMoving" class="trail" aria-hidden="true"></div>
            </div>
          </div>

          <!-- Status Text -->
          <div class="statusText">
            <div class="bigStatus">
              <span class="badge" :class="steps[statusIndex].key">{{ steps[statusIndex].label }}</span>
            </div>
            <div class="smallStatus">{{ steps[statusIndex].desc }}</div>
          </div>
        </div>

        <!-- Demo controls (remove later when Staff page is done) -->
        <div class="demo">
          <div class="demoTitle">Demo tester (delete later)</div>
          <div class="demoBtns">
            <button class="demoBtn" @click="setStatus(0)">Ordered</button>
            <button class="demoBtn" @click="setStatus(1)">Preparing</button>
            <button class="demoBtn" @click="setStatus(2)">In the Oven</button>
            <button class="demoBtn" @click="setStatus(3)">Ready</button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";

/**
 * Shared status across pages (Staff page will update this later).
 * 0: ordered, 1: preparing, 2: oven, 3: ready
 */
const orderStatus = useState("orderStatus", () => 0);

const steps = [
  { key: "ordered", label: "Ordered", desc: "We got it. You’re officially in the system." },
  { key: "preparing", label: "Preparing", desc: "We’re making it fresh. Good things take a minute." },
  { key: "oven", label: "In the Oven", desc: "Heat is on. This is where the magic happens." },
  { key: "ready", label: "Ready for pickup", desc: "Come grab it! Your order is ready." },
];

const statusIndex = computed(() => clamp(orderStatus.value, 0, steps.length - 1));
const orderId = "EB-" + String(Math.floor(100000 + Math.random() * 900000));

/** Belt geometry */
function stationLeft(i) {
  // stations evenly spaced across belt
  const pad = 8; // %
  const span = 100 - pad * 2;
  return pad + (span * i) / (steps.length - 1);
}

const bagelLeft = computed(() => stationLeft(statusIndex.value));
const progressWidth = computed(() => stationLeft(statusIndex.value));


/** Animation flags */
const isMoving = ref(false);
const doBounce = ref(false);

/** Crumbs */
const crumbs = ref([]); // each crumb: {id,x,y,dx,dy,r,o}
let crumbId = 0;

function burstCrumbs() {
  const arr = [];
  // spawn around the bagel position
  for (let i = 0; i < 14; i++) {
    arr.push({
      id: ++crumbId,
      x: 40 + rand(-6, 6),
      y: 18 + rand(-6, 6),
      dx: rand(-26, 26),
      dy: rand(-18, 10),
      r: rand(-180, 180),
      o: 1,
    });
  }
  crumbs.value = arr;

  // fade out
  setTimeout(() => {
    crumbs.value = crumbs.value.map((c) => ({ ...c, o: 0 }));
  }, 80);

  // cleanup
  setTimeout(() => {
    crumbs.value = [];
  }, 520);
}

/** Trigger motion + bounce whenever status changes */
watch(
  () => statusIndex.value,
  () => {
    isMoving.value = true;
    doBounce.value = false;
    burstCrumbs();

    // stop blur after movement finishes
    setTimeout(() => {
      isMoving.value = false;
      doBounce.value = true;
      setTimeout(() => (doBounce.value = false), 420);
    }, 520);
  },
  { immediate: true }
);

function setStatus(i) {
  orderStatus.value = clamp(i, 0, steps.length - 1);
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

</script>


<style scoped>
:root {
  --cream: #f6f0e8;
  --cream2: #fbf8f3;
  --brown: #4b3429;
  --brown2: #6a4a3a;
  --yellow: #f4b316;
  --orange: #f4a51c;
  --cardShadow: 0 10px 30px rgba(0, 0, 0, 0.08);
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
  justify-content: center;
  margin-bottom: 14px;
}
.logoImg {
  width: 100%;
  max-width: 160px;
  height: auto;
  object-fit: contain;
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

/* Main */
.main {
  padding: 20px 26px 50px;
}
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
}
.title {
  margin: 0;
  font-size: 44px;
  letter-spacing: 2px;
  font-weight: 900;
}
.subtitle {
  margin-top: 6px;
  font-weight: 900;
  opacity: 0.75;
}
.cartBtn {
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: #fff;
  border-radius: 14px;
  padding: 10px 14px;
  cursor: pointer;
  box-shadow: var(--cardShadow);
  font-weight: 900;
}

/* Card */
.card {
  background: #fff;
  border-radius: 18px;
  border: 1px solid rgba(75, 52, 41, 0.14);
  box-shadow: var(--cardShadow);
  padding: 14px;
}
.cardHeader {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  border-bottom: 1px solid rgba(75, 52, 41, 0.12);
  padding-bottom: 10px;
  margin-bottom: 10px;
}
.cardHeader h2 { margin: 0; }
.muted { opacity: 0.7; font-weight: 900; }

/* Belt area */
.beltWrap {
  padding: 12px 4px 6px;
}
.belt {
  position: relative;
  height: 260px;
  border-radius: 22px;
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: linear-gradient(180deg, rgba(75,52,41,0.04), rgba(75,52,41,0.02));
  overflow: hidden;
}
/* Neon progress rail (NEW) */
.rail{
  position: absolute;
  left: 8%;
  right: 8%;
  top: 46px;               /* sits behind the pills */
  height: 14px;
  border-radius: 999px;
  pointer-events: none;
  z-index: 2;              /* above stripes, below station pills */
}

.railBase{
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(0,0,0,0.06), rgba(0,0,0,0.02));
}

/* OVEN visuals (Einstein toaster oven) */
.ovenBackdrop{
  position:absolute;
  left:50%;
  top:-10px;
  transform:translateX(-50%);
  width:220px;
  height:160px;
  border-radius: 22px;
  background: radial-gradient(circle at 50% 55%, rgba(255,142,40,0.18), rgba(255,142,40,0) 70%);
  filter: blur(10px);
  opacity: 0;
  transition: opacity 260ms ease;
  z-index: 10;
  pointer-events:none;
}
.station.oven.active .ovenBackdrop{ opacity: 1; }

.ovenFx {
  position: absolute;
  left: 50%;
  top: -18px;
  transform: translateX(-50%);
  width: 210px;
  height: 150px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.35s ease;
  z-index: 11;
}
.station.oven.active .ovenFx { opacity: 1; }

.embers {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 30% 60%, rgba(255, 142, 40, 0.24), rgba(255,255,255,0) 55%),
    radial-gradient(circle at 70% 30%, rgba(255, 80, 20, 0.20), rgba(255,255,255,0) 60%),
    radial-gradient(circle at 50% 50%, rgba(255, 200, 120, 0.14), rgba(255,255,255,0) 70%);
  filter: blur(10px);
  animation: ember 2.6s ease-in-out infinite;
}
@keyframes ember {
  0% { transform: translateY(0); opacity: 0.55; }
  50% { transform: translateY(-4px); opacity: 0.85; }
  100% { transform: translateY(0); opacity: 0.55; }
}

/* rename to avoid conflict with your existing .heat class */
.heatFx {
  position: absolute;
  left: 18px;
  right: 18px;
  top: 24px;
  bottom: 10px;
  border-radius: 18px;
  background: linear-gradient(0deg, rgba(255, 142, 40, 0.0), rgba(255, 142, 40, 0.12), rgba(255, 255, 255, 0.0));
  filter: blur(6px);
  opacity: 0.75;
  animation: shimmer 1.2s ease-in-out infinite;
  mix-blend-mode: multiply;
}
@keyframes shimmer {
  0% { transform: translateY(0) skewX(0deg); opacity: 0.55; }
  50% { transform: translateY(-6px) skewX(1.8deg); opacity: 0.90; }
  100% { transform: translateY(0) skewX(0deg); opacity: 0.55; }
}

.ovenArt{
  position:absolute;
  left:50%;
  top:6px;
  transform:translateX(-50%);
  width:180px;
  height:160px;
  pointer-events:none;
  opacity:0.20;
  transition: opacity 260ms ease, transform 260ms ease;
  z-index: 12;
}
.station.oven.active .ovenArt{
  opacity:1;
  transform:translateX(-50%) translateY(-2px);
}
.station.oven.active .ovenGlowBg{
  animation: ovenGlowPulse 1.6s ease-in-out infinite;
}


.ovenGlowBg{
  position:absolute;
  inset:-18px -24px -16px -24px;
  border-radius:26px;
  background:
    radial-gradient(circle at 45% 65%, rgba(255,142,40,0.42), rgba(255,142,40,0) 65%),
    radial-gradient(circle at 70% 55%, rgba(255,80,20,0.22), rgba(255,80,20,0) 70%);
  filter: blur(12px);
  opacity:0.7;
}
@keyframes ovenGlowPulse{
  0%,100%{ transform:translateY(0) skewX(0deg); opacity:0.65;}
  50%{ transform:translateY(-3px) skewX(-2deg); opacity:1;}
}

.ovenEmbers{ position:absolute; inset:0; }
.station.oven.active .ovenEmbers::before,
.station.oven.active .ovenEmbers::after{
  content:"";
  position:absolute;
  left:50%;
  top:72%;
  width:6px; height:6px;
  border-radius:999px;
  background: rgba(255,142,40,0.95);
  box-shadow:
    -44px 0 rgba(255,142,40,0.75),
    -18px -14px rgba(255,80,20,0.55),
    18px -20px rgba(255,142,40,0.65),
    44px -8px rgba(255,80,20,0.45);
  animation: embersUp 1.25s ease-out infinite;
}
.station.oven.active .ovenEmbers::after{
  width:5px; height:5px;
  top:78%;
  opacity:0.7;
  animation-duration:1.65s;
  animation-delay:0.22s;
}
@keyframes embersUp{
  0%{ transform:translate(-50%,0) scale(0.9); opacity:0;}
  15%{ opacity:0.9;}
  100%{ transform:translate(-50%,-20px) scale(1.1); opacity:0;}
}

.ovenSvg{
  position:absolute;
  left:50%;
  top:10px;
  transform:translateX(-50%);
  width:180px;
  height:160px;
  filter: drop-shadow(0 12px 26px rgba(0,0,0,0.10));
}

/* SVG paint */
.ovBody{ fill: rgba(255,255,255,0.74); stroke: rgba(0,0,0,0.10); stroke-width:2.5; }
.ovLine{ stroke: rgba(0,0,0,0.10); stroke-width:4; stroke-linecap:round; }
.ovKnob{ fill: rgba(255,255,255,0.9); stroke: rgba(0,0,0,0.12); stroke-width:2.2; }
.ovWindow{ fill: rgba(0,0,0,0.06); stroke: rgba(0,0,0,0.10); stroke-width:2.5; }
.ovFire{
  fill: rgba(255,142,40,0.65);
  filter: drop-shadow(0 0 18px rgba(255,142,40,0.45));
  animation: fireFlicker 1.0s ease-in-out infinite;
}
@keyframes fireFlicker{
  0%,100%{ transform:translateY(0); opacity:0.75;}
  50%{ transform:translateY(-1px); opacity:1;}
}
.ovRack{ stroke: rgba(255,142,40,0.30); stroke-width:4; stroke-linecap:round; }
.ovRack2{ stroke: rgba(255,80,20,0.18); stroke-width:4; stroke-linecap:round; }
.ovBadge{ fill: rgba(255,255,255,0.72); stroke: rgba(0,0,0,0.10); stroke-width:2; }
.ovBadgeLine{ stroke: rgba(0,0,0,0.18); stroke-width:2.2; stroke-linecap:round; }

.railGlow{
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  border-radius: 999px;

  /* neon blue → purple vibe like your screenshot */
  background: linear-gradient(
    90deg,
    rgba(46,233,255,0.0),
    rgba(46,233,255,0.75),
    rgba(138,91,255,0.72)
  );

  box-shadow: 0 0 24px rgba(46,233,255,0.28);
  transition: width 520ms cubic-bezier(0.2, 0.9, 0.2, 1.05);
}

/* optional: make it feel alive (subtle shimmer) */
.railGlow::after{
  content:"";
  position:absolute;
  inset:-6px;
  border-radius:999px;
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.20) 50%,
    rgba(255,255,255,0) 100%
  );
  opacity: 0.45;
  animation: railSweep 2.8s ease-in-out infinite;
}

@keyframes railSweep{
  0%{ transform: translateX(-35%); }
  50%{ transform: translateX(35%); }
  100%{ transform: translateX(-35%); }
}

.stationTop{ position: relative; z-index: 30; } /* pill always on top */


/* Oven container */
.ovenBox {
  position: relative;
  width: 140px;
  height: 110px;
  border-radius: 18px;
  margin-top: 6px;
  background: linear-gradient(180deg, rgba(75,52,41,0.18), rgba(75,52,41,0.10));
  border: 1px solid rgba(75,52,41,0.18);
  box-shadow: 0 14px 28px rgba(0,0,0,0.10);
  overflow: hidden;
  z-index: 2;
}

.bagelCart { z-index: 20; }

/* Top panel with knobs */

/* when the bagel is "In the Oven", push it up into the oven window */
.bagelCart.oven{
  bottom: 1px;          /* move cart up */
  z-index: 9;            /* behind ovenArt (we'll raise ovenArt next) */
  filter: drop-shadow(0 10px 14px rgba(0,0,0,0.10));
}

/* make the cart feel like it's inside the oven (slightly muted) */
.bagelCart.oven .cart{
  background: rgba(255,255,255,0.72);
  border-color: rgba(75,52,41,0.10);
  box-shadow: 0 10px 22px rgba(0,0,0,0.08);
}

.ovenTop {
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: rgba(255,255,255,0.20);
  border-bottom: 1px solid rgba(75,52,41,0.16);
}

.knob {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: rgba(255,255,255,0.65);
  border: 1px solid rgba(75,52,41,0.18);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.10);
}

/* Door */
.ovenDoor {
  position: relative;
  height: calc(110px - 28px);
  display: grid;
  place-items: center;
  background: rgba(255,255,255,0.10);
}

/* Window */
.ovenWindow {
  width: 90px;
  height: 54px;
  border-radius: 12px;
  background: rgba(0,0,0,0.20);
  border: 1px solid rgba(75,52,41,0.22);
  box-shadow: inset 0 10px 18px rgba(0,0,0,0.20);
  position: relative;
  overflow: hidden;
}

/* Handle */
.ovenHandle {
  position: absolute;
  right: 16px;
  top: 20px;
  width: 34px;
  height: 10px;
  border-radius: 999px;
  background: rgba(255,255,255,0.55);
  border: 1px solid rgba(75,52,41,0.18);
}

.belt{
  background:
    linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0.25)),
    #F2E7D7;

  border: 1px solid rgba(75,52,41,0.10);
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.4),
    0 8px 20px rgba(75,52,41,0.08);
}

/* 🔥 HEAT WAVES (oven air distortion) */
.heatWaves {
  position: absolute;
  left: 50%;
  top: 125px;                 /* sits inside oven window */
  transform: translateX(-50%);
  width: 140px;
  height: 90px;
  pointer-events: none;
  z-index: 50;               /* above oven, below bagel */
  
  background:
    repeating-linear-gradient(
      0deg,
      rgba(255, 190, 80, 0.18) 0px,
      rgba(255, 190, 80, 0.18) 6px,
      rgba(255, 190, 80, 0.06) 12px,
      rgba(255, 190, 80, 0.00) 18px
    );

  filter: blur(1px);
  opacity: 0.85;

  animation: heatRise 1.6s ease-in-out infinite;
}

/* upward wavy motion */
@keyframes heatRise {
  0% {
    transform: translateX(-50%) translateY(6px) skewX(0deg);
    opacity: 0.65;
  }
  50% {
    transform: translateX(-50%) translateY(-4px) skewX(1.5deg);
    opacity: 1;
  }
  100% {
    transform: translateX(-50%) translateY(6px) skewX(0deg);
    opacity: 0.65;
  }
}

/* vignette + tiny noise feel */
.belt::after{
  content:"";
  position:absolute;
  inset:0;
  border-radius:22px;
  pointer-events:none;
  background:
    radial-gradient(circle at 50% 55%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.06) 100%),
    repeating-linear-gradient(
      45deg,
      rgba(0,0,0,0.02) 0px,
      rgba(0,0,0,0.02) 2px,
      rgba(0,0,0,0.00) 2px,
      rgba(0,0,0,0.00) 6px
    );
  opacity:0.65;
}

.bagelSvgReal{
  animation: bagelBob 2.6s ease-in-out infinite;
}
@keyframes bagelBob{
  0%{ transform: translateY(0); }
  50%{ transform: translateY(-1.5px); }
  100%{ transform: translateY(0); }
}

/* Flame glow inside window when active */
.ovenFlame {
  position: absolute;
  left: 50%;
  bottom: -10px;
  transform: translateX(-50%);
  width: 120px;
  height: 90px;
  background: radial-gradient(circle at 50% 65%, rgba(244,165,28,0.55), rgba(244,165,28,0) 60%);
  filter: blur(1px);
  animation: flamePulse 0.7s ease-in-out infinite;
  opacity: 0.95;
}

@keyframes flamePulse {
  0% { transform: translateX(-50%) translateY(0) scale(1); opacity: 0.85; }
  50% { transform: translateX(-50%) translateY(-2px) scale(1.03); opacity: 1; }
  100% { transform: translateX(-50%) translateY(0) scale(1); opacity: 0.85; }
}

/* Warm glow behind oven when active */
.ovenGlow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle at 50% 70%, rgba(244,165,28,0.35), rgba(244,165,28,0) 65%);
  filter: blur(10px);
  z-index: -1;
}

/* Make the oven feel “hot” when active */
.ovenBox.hot {
  border-color: rgba(244,165,28,0.45);
  box-shadow: 0 16px 34px rgba(244,165,28,0.16), 0 14px 28px rgba(0,0,0,0.10);
}

.belt::before{
  content:"";
  position:absolute;
  inset:-40px;
  pointer-events:none;
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.20) 50%,
    rgba(255,255,255,0) 100%
  );
  transform: translateX(-35%);
  animation: sweep 4.5s ease-in-out infinite;
  opacity: 0.55;
}
@keyframes sweep{
  0%{ transform: translateX(-45%); }
  50%{ transform: translateX(45%); }
  100%{ transform: translateX(-45%); }
}
.page{
  min-height: 100vh;
  background: linear-gradient(
    180deg,
    #F7F1E7 0%,
    #EFE5D6 100%
  );
}

.beltStripes{
  opacity: 0.18;

  background: repeating-linear-gradient(
    90deg,
    rgba(75,52,41,0.05) 0px,
    rgba(75,52,41,0.05) 14px,
    rgba(75,52,41,0.015) 14px,
    rgba(75,52,41,0.015) 30px
  );
}

.belt::after{
  content:"";
  position:absolute;
  inset:0;
  border-radius:22px;
  pointer-events:none;

  background:
    radial-gradient(
      circle at 50% 40%,
      rgba(244,179,22,0.08),
      transparent 70%
    );

  opacity:0.7;
}


/* stations */
.stations {
  position: absolute;
  inset: 0;
}
.station {
  position: absolute;
  top: 28px;
  transform: translateX(-50%);
  width: 180px;
  text-align: center;
}
.stationTop {
  display: flex;
  justify-content: center;
}
.pill {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: rgba(255,255,255,0.8);
  box-shadow: 0 8px 18px rgba(0,0,0,0.06);
  font-weight: 1000;
}
.station .dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(75,52,41,0.28);
}
.station.done .dot {
  background: rgba(0, 140, 70, 0.65);
}
.station.active .dot {
  background: rgba(244, 179, 22, 0.95);
  box-shadow: 0 0 0 6px rgba(244,179,22,0.18);
}
.station.oven.active .pill {
  border-color: rgba(244, 165, 28, 0.55);
  box-shadow: 0 10px 26px rgba(244,165,28,0.18);
}

.stationBase{
  position: relative;     /* ✅ anchor oven absolute children */
  min-height: 150px;      /* ✅ room for oven */
  margin-top: 12px;
  display: grid;
  place-items: center;
}

.post {
  width: 12px;
  height: 56px;
  border-radius: 12px;
  background: rgba(75,52,41,0.18);
}
.platform {
  width: 120px;
  height: 14px;
  border-radius: 999px;
  background: rgba(75,52,41,0.16);
  margin-top: -2px;
}

/* oven heat shimmer */
.heat {
  position: absolute;
  left: 50%;
  top: 88px;
  transform: translateX(-50%);
  width: 128px;
  height: 86px;
  border-radius: 18px;
  background: radial-gradient(circle at 50% 40%, rgba(244,165,28,0.35), rgba(244,165,28,0) 65%);
  filter: blur(0.2px);
  opacity: 0.95;
}
.heat::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 18px;
  background: repeating-linear-gradient(
    0deg,
    rgba(255,255,255,0.12) 0px,
    rgba(255,255,255,0.12) 6px,
    rgba(255,255,255,0.02) 6px,
    rgba(255,255,255,0.02) 12px
  );
  mix-blend-mode: multiply;
  animation: heatWobble 1.3s ease-in-out infinite;
  opacity: 0.8;
}
@keyframes heatWobble {
  0% { transform: translateY(0) skewX(0deg); }
  50% { transform: translateY(-2px) skewX(1.2deg); }
  100% { transform: translateY(0) skewX(0deg); }
}

/* bagel cart */
.bagelCart {
  position: absolute;
  bottom: 34px;
  transform: translateX(-50%);
  transition: left 0.52s cubic-bezier(0.2, 0.9, 0.2, 1.05);
  will-change: left;
}
.bagelCart.moving .cart { filter: blur(0px); }
.bagelCart.bounce { animation: pop 0.42s ease; }
@keyframes pop {
  0% { transform: translateX(-50%) translateY(0); }
  45% { transform: translateX(-50%) translateY(-6px); }
  100% { transform: translateX(-50%) translateY(0); }
}

.cart {
  position: relative;
  width: 104px;
  height: 74px;
  border-radius: 18px;
  border: 1px solid rgba(75,52,41,0.18);
  background: rgba(255,255,255,0.92);
  box-shadow: 0 14px 30px rgba(0,0,0,0.10);
  display: grid;
  place-items: center;
}
.cartTop {
  position: absolute;
  top: -10px;
  width: 84px;
  height: 18px;
  border-radius: 999px;
  background: rgba(75,52,41,0.10);
  border: 1px solid rgba(75,52,41,0.12);
}

/* bagel */
.bagel {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 999px;
  background: radial-gradient(circle at 35% 35%, #ffd39a, #e6a35a 70%);
  border: 1px solid rgba(75,52,41,0.20);
  box-shadow: inset 0 10px 18px rgba(255,255,255,0.22);
}
.bagelInner {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 18px;
  height: 18px;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  background: rgba(75,52,41,0.22);
  box-shadow: inset 0 6px 12px rgba(0,0,0,0.18);
}
.seeds .seed {
  position: absolute;
  width: 4px;
  height: 2px;
  border-radius: 999px;
  background: rgba(255,255,255,0.75);
  opacity: 0.8;
}
.seeds .seed:nth-child(1) { left: 8px; top: 12px; transform: rotate(14deg); }
.seeds .seed:nth-child(2) { left: 14px; top: 7px; transform: rotate(-18deg); }
.seeds .seed:nth-child(3) { left: 26px; top: 10px; transform: rotate(22deg); }
.seeds .seed:nth-child(4) { left: 36px; top: 16px; transform: rotate(-8deg); }
.seeds .seed:nth-child(5) { left: 9px; top: 28px; transform: rotate(-22deg); }
.seeds .seed:nth-child(6) { left: 35px; top: 30px; transform: rotate(18deg); }
.seeds .seed:nth-child(7) { left: 22px; top: 38px; transform: rotate(-12deg); }
.seeds .seed:nth-child(8) { left: 12px; top: 38px; transform: rotate(10deg); }
.seeds .seed:nth-child(9) { left: 38px; top: 10px; transform: rotate(-10deg); }
.seeds .seed:nth-child(10){ left: 30px; top: 40px; transform: rotate(16deg); }

/* wheels */
.wheels {
  position: absolute;
  bottom: -10px;
  left: 14px;
  right: 14px;
  display: flex;
  justify-content: space-between;
}
.wheel {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 2px solid rgba(75,52,41,0.35);
  background: rgba(255,255,255,0.9);
  box-shadow: 0 6px 14px rgba(0,0,0,0.10);
}
.bagelCart.moving .wheel { animation: spin 0.25s linear infinite; }
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* motion blur trail */
.trail {
  position: absolute;
  left: 18px;
  bottom: 10px;
  width: 72px;
  height: 34px;
  border-radius: 18px;
  background: linear-gradient(90deg, rgba(244,179,22,0.0), rgba(244,179,22,0.25), rgba(244,179,22,0.0));
  filter: blur(6px);
  opacity: 0.95;
  animation: trailPulse 0.25s ease-in-out infinite;
}
@keyframes trailPulse {
  0% { opacity: 0.55; }
  50% { opacity: 1; }
  100% { opacity: 0.55; }
}

/* crumbs */
.crumbs {
  position: absolute;
  left: 30px;
  top: 6px;
  width: 60px;
  height: 50px;
  pointer-events: none;
}
.crumb {
  position: absolute;
  width: 6px;
  height: 4px;
  border-radius: 6px;
  background: rgba(230, 163, 90, 0.95);
  border: 1px solid rgba(75,52,41,0.18);
  transition: transform 0.52s ease, opacity 0.4s ease;
}

/* status text */
.statusText {
  margin-top: 14px;
  display: grid;
  gap: 6px;
}
.bigStatus {
  display: flex;
  align-items: center;
  gap: 10px;
}
.badge {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 999px;
  font-weight: 1000;
  border: 1px solid rgba(75,52,41,0.14);
  background: rgba(75,52,41,0.03);
}
.badge.ordered { background: rgba(75,52,41,0.05); }
.badge.preparing { background: rgba(26,115,232,0.10); border-color: rgba(26,115,232,0.22); }
.badge.oven { background: rgba(244,165,28,0.16); border-color: rgba(244,165,28,0.30); }
.badge.ready { background: rgba(0,140,70,0.12); border-color: rgba(0,140,70,0.22); }
.smallStatus { font-weight: 900; opacity: 0.8; }

/* demo */
.demo {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(75,52,41,0.12);
}
.demoTitle {
  font-weight: 1000;
  opacity: 0.75;
  margin-bottom: 10px;
}
.demoBtns {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.demoBtn {
  border: 1px solid rgba(75,52,41,0.14);
  background: #fff;
  border-radius: 14px;
  padding: 10px 12px;
  cursor: pointer;
  font-weight: 900;
  box-shadow: 0 8px 18px rgba(0,0,0,0.06);
}
.demoBtn:hover {
  border-color: rgba(244,179,22,0.55);
  transform: translateY(-1px);
}

/* responsive */
@media (max-width: 980px) {
  .page { grid-template-columns: 1fr; }
  .sidebar { border-right: none; border-bottom: 1px solid rgba(75,52,41,0.12); }
}
</style>
