<!-- app/pages/tracking.vue -->
<template>
  <div class="page">
    <!-- Left Sidebar -->
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
          <div class="subtitle">Your bagel is on the belt. We’ll update you live 🥯</div>
        </div>

        <button class="cartBtn" type="button" @click="navigateTo('/checkout')">
          ← Back to Checkout
        </button>
      </header>

      <section class="card">
        <div class="cardHeader">
          <h2>Order Status</h2>
          <div class="orderId">Order #EB-{{ orderId }}</div>
        </div>

        <!-- PREMIUM BELT TRACK (glass + blobs + neon beam + moving belt stripes + cart) -->
        <div class="trackShell">
          <!-- Apple-ish blurred blobs -->
          <div class="blobs" aria-hidden="true">
            <span class="blob b1" />
            <span class="blob b2" />
            <span class="blob b3" />
          </div>

          <!-- Belt / Track -->
          <div class="belt" ref="trackEl">
            <!-- frosted glass overlay -->
            <div class="glass" aria-hidden="true"></div>

            <!-- moving belt stripes (under everything) -->
            <div class="beltStripes" aria-hidden="true"></div>

            <!-- neon progress beam -->
            <div class="beam" :style="beamStyle" />

            <!-- segment lines between stations -->
            <div class="segments" aria-hidden="true">
              <span class="seg s1" />
              <span class="seg s2" />
              <span class="seg s3" />
            </div>

            <!-- Stations -->
            <div
              v-for="(s, i) in STATIONS"
              :key="s.key"
              class="station"
              :class="{
                active: i === statusIndex,
                done: i < statusIndex,
                oven: s.key === 'oven',
              }"
              :style="stationStyle(i)"
            >
              <!-- ✅ If this is the oven station, render better Einstein-style oven behind -->
              <template v-if="s.key === 'oven'">
                <div class="ovenBackdrop" aria-hidden="true"></div>

                <div class="ovenFx" aria-hidden="true">
                  <div class="embers" />
                  <div class="heat" />
                </div>

                <div class="ovenArt" aria-hidden="true">
                  <div class="ovenGlow" />
                  <div class="ovenEmbers" />
                  <svg class="ovenSvg" viewBox="0 0 180 160" fill="none">
                    <!-- Outer toaster-oven body -->
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

                    <!-- Little Einstein “E” badge (subtle) -->
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
              </template>

              <!-- checkpoint -->
              <div class="checkpointWrap">
                <div class="checkpoint">
                  <span class="inner" />
                </div>

                <!-- pulse rings -->
                <div class="rings" aria-hidden="true">
                  <span class="ring r1" />
                  <span class="ring r2" />
                  <span class="ring r3" />
                </div>

                <!-- shockwave when we land here -->
                <div class="shock" :class="{ boom: shockAt === i }" aria-hidden="true" />
              </div>

              <!-- label pill (kept above oven visuals by z-index) -->
              <div class="labelPill">
                <span class="dot" />
                <span class="label">{{ s.label }}</span>
              </div>
            </div>

            <!-- Bagel Cart (moves along the belt) -->
            <div
              class="bagelCart"
              :class="{
                moving: isMoving,
                oven: currentKey === 'oven',
                ready: currentKey === 'ready',
                bounce: doBounce
              }"
              :style="cartStyle"
              aria-label="Bagel cart"
            >
              <!-- motion smear glow -->
              <div class="cartGhost" aria-hidden="true"></div>

              <div class="cart">
                <div class="cartTop" />

                <!-- Bagel (high quality SVG from your modern version) -->
                <div class="bagel">
                  <svg class="bagelSvg" viewBox="0 0 128 128" width="74" height="74" role="img" aria-label="Bagel">
                    <defs>
                      <radialGradient id="bg" cx="35%" cy="30%" r="70%">
                        <stop offset="0%" stop-color="#ffe3b8" />
                        <stop offset="55%" stop-color="#f3b26a" />
                        <stop offset="100%" stop-color="#c8782f" />
                      </radialGradient>

                      <radialGradient id="rim" cx="45%" cy="35%" r="70%">
                        <stop offset="0%" stop-color="#fff0d6" />
                        <stop offset="55%" stop-color="#f3c089" />
                        <stop offset="100%" stop-color="#b66322" />
                      </radialGradient>

                      <radialGradient id="hole" cx="50%" cy="45%" r="65%">
                        <stop offset="0%" stop-color="#c8742b" />
                        <stop offset="100%" stop-color="#7a3b0f" />
                      </radialGradient>

                      <filter id="softShadow" x="-40%" y="-40%" width="180%" height="180%">
                        <feDropShadow dx="0" dy="8" stdDeviation="7" flood-color="rgba(0,0,0,0.25)" />
                      </filter>

                      <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
                        <feGaussianBlur stdDeviation="3.5" result="b" />
                        <feColorMatrix
                          in="b"
                          type="matrix"
                          values="
                            1 0 0 0 0.1
                            0 1 0 0 0.0
                            0 0 1 0 0.0
                            0 0 0 0.9 0
                          "
                          result="g"
                        />
                        <feMerge>
                          <feMergeNode in="g" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>

                      <linearGradient id="shine" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="rgba(255,255,255,0.65)" />
                        <stop offset="45%" stop-color="rgba(255,255,255,0.0)" />
                      </linearGradient>

                      <filter id="grain" x="-20%" y="-20%" width="140%" height="140%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n" />
                        <feColorMatrix type="saturate" values="0" />
                        <feComponentTransfer>
                          <feFuncA type="table" tableValues="0 0.08" />
                        </feComponentTransfer>
                        <feBlend in="SourceGraphic" in2="n" mode="multiply" />
                      </filter>
                    </defs>

                    <g filter="url(#softShadow)">
                      <path
                        d="M64 14
                          C34 14 14 34 14 64
                          C14 94 34 114 64 114
                          C94 114 114 94 114 64
                          C114 34 94 14 64 14Z"
                        fill="url(#bg)"
                      />

                      <path
                        d="M64 18
                          C36 18 18 36 18 64
                          C18 92 36 110 64 110
                          C92 110 110 92 110 64
                          C110 36 92 18 64 18Z"
                        fill="url(#rim)"
                        opacity="0.55"
                      />

                      <path
                        d="M64 42
                          C52 42 42 52 42 64
                          C42 76 52 86 64 86
                          C76 86 86 76 86 64
                          C86 52 76 42 64 42Z"
                        fill="url(#hole)"
                        opacity="0.95"
                      />

                      <path
                        d="M34 40
                          C40 28 54 22 66 22
                          C76 22 86 26 94 34
                          C80 32 68 40 58 50
                          C50 58 44 68 42 80
                          C34 70 30 54 34 40Z"
                        fill="url(#shine)"
                        opacity="0.55"
                      />

                      <g filter="url(#grain)" opacity="0.95">
                        <circle cx="44" cy="46" r="3.2" fill="#f8eddc" />
                        <circle cx="82" cy="44" r="2.8" fill="#f8eddc" />
                        <circle cx="92" cy="66" r="3.1" fill="#f8eddc" />
                        <circle cx="38" cy="78" r="2.9" fill="#f8eddc" />
                        <circle cx="60" cy="96" r="2.6" fill="#f8eddc" />
                        <circle cx="78" cy="92" r="2.5" fill="#f8eddc" />
                        <circle cx="30" cy="60" r="2.2" fill="#f8eddc" />
                      </g>
                    </g>

                    <g filter="url(#glow)" opacity="0.65">
                      <path
                        d="M64 16
                          C35 16 16 35 16 64
                          C16 93 35 112 64 112
                          C93 112 112 93 112 64
                          C112 35 93 16 64 16Z"
                        fill="rgba(255,178,64,0.35)"
                      />
                    </g>
                  </svg>
                </div>

                <div class="wheels" aria-hidden="true">
                  <span class="wheel" />
                  <span class="wheel" />
                </div>
              </div>

              <!-- tiny trail when moving -->
              <div v-if="isMoving" class="trail" aria-hidden="true"></div>
            </div>

            <!-- particles layer -->
            <div class="particles" aria-hidden="true">
              <span v-for="p in particles" :key="p.id" class="p" :class="p.kind" :style="p.style" />
            </div>
          </div>

          <!-- status text -->
          <div class="statusPanel">
            <div class="statusPill">
              <span class="statusDot" :class="currentKey" />
              <span class="statusTitle">{{ STATIONS[statusIndex].label }}</span>
            </div>
            <p class="statusSub">{{ statusMessage }}</p>

            <!-- demo tester -->
            <div class="demoLine">
              <div class="demoTitle">Demo tester (delete later)</div>
              <div class="demoBtns">
                <button class="demoBtn" @click="setStatus('ordered')">Ordered</button>
                <button class="demoBtn" @click="setStatus('preparing')">Preparing</button>
                <button class="demoBtn oven" @click="setStatus('oven')">In the Oven</button>
                <button class="demoBtn ready" @click="setStatus('ready')">Ready</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onBeforeUnmount, ref, watch } from "vue";

/**
 * orderStatus shared state across pages
 * ordered | preparing | oven | ready
 */
const orderStatus = useState("orderStatus", () => "ordered");

const STATIONS = [
  { key: "ordered", label: "Ordered" },
  { key: "preparing", label: "Preparing" },
  { key: "oven", label: "In the Oven" },
  { key: "ready", label: "Ready for pickup" },
];

const statusIndex = computed(() => {
  const idx = STATIONS.findIndex((s) => s.key === orderStatus.value);
  return idx < 0 ? 0 : idx;
});

const currentKey = computed(() => STATIONS[statusIndex.value]?.key || "ordered");

const statusMessage = computed(() => {
  switch (currentKey.value) {
    case "ordered":
      return "We got it. You’re officially in the system.";
    case "preparing":
      return "Our crew is building your bagel masterpiece.";
    case "oven":
      return "It’s getting that warm, toasted glow. Almost there.";
    case "ready":
      return "Ready for pickup! Pull up and claim your bagel 🥯";
    default:
      return "Tracking your order…";
  }
});

const orderId = ref(
  Math.random().toString(16).slice(2, 8).toUpperCase() + "-" + Math.floor(Math.random() * 999999)
);

/** Track measurement */
const trackEl = ref(null);
const trackW = ref(0);
const trackH = ref(0);

function measure() {
  const el = trackEl.value;
  if (!el) return;
  const r = el.getBoundingClientRect();
  trackW.value = r.width;
  trackH.value = r.height;
}
function onResize() {
  measure();
}

onMounted(() => {
  measure();
  window.addEventListener("resize", onResize);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", onResize);
});

/** Rail geometry (slight arc, like your premium version) */
const padX = 64;
const railY = computed(() => Math.max(122, Math.min(190, trackH.value * 0.55)));
const arcAmp = 22;

function stationX(i) {
  const usable = Math.max(0, trackW.value - padX * 2);
  const step = usable / (STATIONS.length - 1);
  return padX + step * i;
}
function stationY(i) {
  const t = i / (STATIONS.length - 1);
  const curve = Math.sin(t * Math.PI); // 0..1..0
  return railY.value - curve * arcAmp;
}
function stationStyle(i) {
  return { left: `${stationX(i)}px`, top: `${stationY(i)}px` };
}

/** Neon beam fills up to current station */
const beamStyle = computed(() => {
  const i = statusIndex.value;
  if (!trackW.value) return { width: "0px" };
  const x = stationX(i);
  const w = Math.max(0, x - padX);
  return { width: `${w}px` };
});

/** Bagel cart movement (translate like premium code) */
const isMoving = ref(false);
const doBounce = ref(false);
const shockAt = ref(-1);

const cartPos = ref({ x: 0, y: 0 });
const cartStyle = computed(() => ({
  transform: `translate(${cartPos.value.x}px, ${cartPos.value.y}px)`,
}));

async function moveCartToIndex(i) {
  await nextTick();
  measure();

  const x = stationX(i);
  const y = stationY(i);

  /**
   * We want the cart to ride the "belt floor".
   * - station is centered with translate(-50%, -50%)
   * - so we offset down so cart sits on lower part of track
   */
  const offsetX = -52; // center the cart under checkpoint
  const offsetY = 56;  // drop cart onto belt surface

  cartPos.value = { x: x + offsetX, y: y + offsetY };
}

/** Particles */
const particles = ref([]);
let pid = 1;

function spawnParticles(kind, atX, atY) {
  const now = Date.now();

  // crumbs
  const crumbCount = 14;
  for (let i = 0; i < crumbCount; i++) {
    const ang = Math.random() * Math.PI * 2;
    const dist = 10 + Math.random() * 22;
    const dx = Math.cos(ang) * dist;
    const dy = Math.sin(ang) * dist;
    const size = 3 + Math.random() * 4;
    const life = 520 + Math.random() * 260;

    particles.value.push({
      id: pid++,
      kind: "crumb",
      born: now,
      style: {
        left: `${atX}px`,
        top: `${atY}px`,
        width: `${size}px`,
        height: `${size}px`,
        "--dx": `${dx}px`,
        "--dy": `${dy}px`,
        "--life": `${life}ms`,
      },
    });
  }

  // sparks for oven / landing
  if (kind === "sparks") {
    const sparkCount = 10;
    for (let i = 0; i < sparkCount; i++) {
      const dx = 18 + Math.random() * 44;
      const dy = -10 + Math.random() * 20;
      const w = 12 + Math.random() * 16;
      const h = 2 + Math.random() * 2.5;
      const life = 520 + Math.random() * 240;

      particles.value.push({
        id: pid++,
        kind: "streak",
        born: now,
        style: {
          left: `${atX}px`,
          top: `${atY}px`,
          width: `${w}px`,
          height: `${h}px`,
          "--dx": `${dx}px`,
          "--dy": `${dy}px`,
          "--life": `${life}ms`,
        },
      });
    }
  }

  // cleanup
  setTimeout(() => {
    const cutoff = Date.now() - 1500;
    particles.value = particles.value.filter((p) => p.born > cutoff);
  }, 1700);
}

/** Initialize */
onMounted(async () => {
  await nextTick();
  measure();
  await moveCartToIndex(statusIndex.value);
});

/** Watch changes */
watch(statusIndex, async (newIdx, oldIdx) => {
  if (newIdx === oldIdx) return;

  isMoving.value = true;
  doBounce.value = false;

  await moveCartToIndex(newIdx);

  shockAt.value = newIdx;

  const cx = stationX(newIdx);
  const cy = stationY(newIdx);

  // crumbs always
  spawnParticles("crumbs", cx, cy + 64);

  // sparks mainly when oven or landing
  if (STATIONS[newIdx]?.key === "oven" || STATIONS[newIdx]?.key === "ready") {
    spawnParticles("sparks", cx, cy + 64);
  }

  // bounce at the end
  setTimeout(() => (shockAt.value = -1), 520);
  setTimeout(() => {
    isMoving.value = false;
    doBounce.value = true;
    setTimeout(() => (doBounce.value = false), 420);
  }, 680);
});

function setStatus(key) {
  orderStatus.value = key;
}
</script>

<style scoped>
:root {
  --cream: #f6f0e8;
  --cream2: #fbf8f3;
  --brown: #4b3429;

  --cardShadow: 0 10px 30px rgba(0, 0, 0, 0.08);

  --neon: rgba(120, 220, 255, 0.95);
  --neon2: rgba(120, 255, 206, 0.9);
  --glow: rgba(120, 220, 255, 0.35);

  --oven: rgba(255, 142, 40, 0.95);
  --ovenGlow: rgba(255, 124, 25, 0.35);

  --ease-spring: cubic-bezier(0.18, 0.9, 0.22, 1.15);
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
  margin-bottom: 18px;
  gap: 14px;
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
  margin-bottom: 14px;
}
.orderId {
  font-weight: 900;
  opacity: 0.65;
}

/* Track Shell */
.trackShell {
  position: relative;
  padding: 16px;
  border-radius: 18px;
  border: 1px solid rgba(75, 52, 41, 0.10);
  background: linear-gradient(180deg, rgba(255,255,255,0.75), rgba(255,255,255,0.55));
  overflow: hidden;
}

/* Blobs */
.blobs {
  position: absolute;
  inset: -40px;
  filter: blur(18px);
  opacity: 0.55;
  pointer-events: none;
}
.blob {
  position: absolute;
  width: 360px;
  height: 360px;
  border-radius: 999px;
  mix-blend-mode: multiply;
  animation: floaty 9s ease-in-out infinite;
}
.b1 { left: 6%; top: 20%; background: rgba(120, 220, 255, 0.38); animation-duration: 10s; }
.b2 { left: 42%; top: 0%; background: rgba(255, 185, 90, 0.30); animation-duration: 12s; }
.b3 { left: 72%; top: 26%; background: rgba(160, 255, 210, 0.26); animation-duration: 11s; }
@keyframes floaty {
  0% { transform: translate3d(0,0,0) scale(1); }
  50% { transform: translate3d(18px,-12px,0) scale(1.06); }
  100% { transform: translate3d(0,0,0) scale(1); }
}

/* Belt base (glass + stripe motion) */
.belt {
  position: relative;
  height: 260px;
  border-radius: 18px;
  border: 1px solid rgba(75, 52, 41, 0.10);
  overflow: hidden;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.75),
    0 16px 50px rgba(0,0,0,0.06);
  background:
    linear-gradient(180deg, rgba(255,255,255,0.75), rgba(255,255,255,0.35));
}

/* frosted glass overlay */
.glass {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 30%, rgba(255,255,255,0.40), rgba(255,255,255,0) 55%),
    radial-gradient(circle at 80% 70%, rgba(255,255,255,0.25), rgba(255,255,255,0) 60%),
    repeating-linear-gradient(
      90deg,
      rgba(0,0,0,0.03) 0px,
      rgba(0,0,0,0.03) 6px,
      rgba(255,255,255,0.0) 6px,
      rgba(255,255,255,0.0) 16px
    );
  opacity: 0.9;
  pointer-events: none;
}

/* Belt moving vertical stripes (conveyor motion) */
.beltStripes {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    90deg,
    rgba(75,52,41,0.06) 0px,
    rgba(75,52,41,0.06) 14px,
    rgba(75,52,41,0.02) 14px,
    rgba(75,52,41,0.02) 28px
  );
  opacity: 0.32;
  animation: beltMove 1.05s linear infinite;
  pointer-events: none;
}
@keyframes beltMove {
  from { transform: translateX(0); }
  to { transform: translateX(-56px); }
}

/* Neon beam */
.beam {
  position: absolute;
  left: 64px;
  top: 54%;
  height: 8px;
  transform: translateY(-50%);
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(120, 220, 255, 0.0), rgba(120, 220, 255, 0.95), rgba(120, 255, 206, 0.85));
  box-shadow:
    0 0 0 1px rgba(120, 220, 255, 0.10),
    0 0 22px rgba(120, 220, 255, 0.35),
    0 0 52px rgba(120, 255, 206, 0.18);
  transition: width 0.8s var(--ease-spring);
  z-index: 2;
}

/* Segment lines */
.segments {
  position: absolute;
  left: 64px;
  right: 64px;
  top: 54%;
  height: 1px;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 2;
}
.seg {
  position: absolute;
  top: 0;
  width: 1px;
  height: 40px;
  transform: translateY(-20px);
  background: rgba(75, 52, 41, 0.12);
  box-shadow: 0 0 0 1px rgba(255,255,255,0.35);
}
.s1 { left: 33.33%; }
.s2 { left: 66.66%; }
.s3 { left: 88.88%; opacity: 0; }

/* Station */
.station {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 190px;
  text-align: center;
  z-index: 6;
}

/* Label pill */
.labelPill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(75, 52, 41, 0.12);
  background: rgba(255,255,255,0.65);
  backdrop-filter: blur(8px);
  box-shadow: 0 10px 26px rgba(0,0,0,0.06);
  font-weight: 1000;
  position: relative;
  z-index: 7; /* keep labels above oven */
}
.labelPill .dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(75, 52, 41, 0.18);
  box-shadow: 0 0 0 3px rgba(75,52,41,0.06);
}
.station.done .labelPill .dot {
  background: rgba(120, 255, 206, 0.9);
  box-shadow: 0 0 0 3px rgba(120,255,206,0.16);
}
.station.active .labelPill .dot {
  background: rgba(120, 220, 255, 0.95);
  box-shadow: 0 0 0 3px rgba(120,220,255,0.18);
}
.station.oven.active .labelPill .dot {
  background: rgba(255, 142, 40, 0.95);
  box-shadow: 0 0 0 3px rgba(255, 142, 40, 0.18);
}

/* Checkpoint */
.checkpointWrap {
  position: relative;
  display: grid;
  place-items: center;
  z-index: 7;
}
.checkpoint {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  border: 1px solid rgba(75, 52, 41, 0.12);
  background: rgba(255,255,255,0.75);
  backdrop-filter: blur(10px);
  box-shadow:
    0 0 0 6px rgba(120, 220, 255, 0.10),
    0 12px 24px rgba(0,0,0,0.08);
  position: relative;
}
.checkpoint .inner {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: rgba(75, 52, 41, 0.18);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.station.done .checkpointestor .inner,
.station.done .checkpoint .inner { background: rgba(120, 255, 206, 0.95); }
.station.active .checkpoint .inner { background: rgba(120, 220, 255, 0.95); }
.station.oven.active .checkpoint .inner { background: rgba(255, 142, 40, 0.95); }

/* Ring waves */
.rings {
  position: absolute;
  inset: -24px;
  pointer-events: none;
  opacity: 0.0;
}
.station.active .rings { opacity: 1; }
.ring {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  border: 2px solid rgba(120, 220, 255, 0.32);
  animation: ring 1.6s ease-out infinite;
}
.r2 { animation-delay: 0.35s; opacity: 0.8; }
.r3 { animation-delay: 0.7s; opacity: 0.65; }
.station.oven.active .ring { border-color: rgba(255, 142, 40, 0.30); }
@keyframes ring {
  0% { transform: scale(0.4); opacity: 0.0; }
  20% { opacity: 0.9; }
  100% { transform: scale(1.25); opacity: 0.0; }
}

/* Shock */
.shock {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 999px;
  opacity: 0;
  border: 2px solid rgba(120, 220, 255, 0.55);
  transform: scale(0.3);
}
.shock.boom { animation: boom 0.55s ease-out 1; }
.station.oven .shock { border-color: rgba(255, 142, 40, 0.55); }
@keyframes boom {
  0% { opacity: 0; transform: scale(0.3); }
  18% { opacity: 1; }
  100% { opacity: 0; transform: scale(3.2); }
}

/* Oven visuals (better, bigger, “Einstein toaster oven”) */
.ovenBackdrop{
  position:absolute;
  left:50%;
  top:-40px;
  transform:translateX(-50%);
  width:220px;
  height:160px;
  border-radius: 22px;
  background: radial-gradient(circle at 50% 55%, rgba(255,142,40,0.18), rgba(255,142,40,0) 70%);
  filter: blur(10px);
  opacity: 0;
  transition: opacity 260ms ease;
  z-index: 3;
  pointer-events:none;
}
.station.oven.active .ovenBackdrop{ opacity: 1; }

.ovenFx {
  position: absolute;
  left: 50%;
  top: -54px;
  transform: translateX(-50%);
  width: 210px;
  height: 150px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.35s ease;
  z-index: 4;
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
.heat {
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
  top:-34px;
  transform:translateX(-50%);
  width:180px;
  height:160px;
  pointer-events:none;
  opacity:0.20;
  transition: opacity 260ms ease, transform 260ms ease;
  z-index: 5;
}
.station.oven.active .ovenArt{
  opacity:1;
  transform:translateX(-50%) translateY(-2px);
}
.ovenGlow{
  position:absolute;
  inset:-18px -24px -16px -24px;
  border-radius:26px;
  background:
    radial-gradient(circle at 45% 65%, rgba(255,142,40,0.42), rgba(255,142,40,0) 65%),
    radial-gradient(circle at 70% 55%, rgba(255,80,20,0.22), rgba(255,80,20,0) 70%);
  filter: blur(12px);
  opacity:0.7;
}
.station.oven.active .ovenGlow{
  animation: ovenGlowPulse 1.6s ease-in-out infinite;
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

/* Bagel Cart */
.bagelCart {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 9;
  width: 110px;
  height: 88px;
  will-change: transform;
  transition: transform 0.8s var(--ease-spring);
  filter: drop-shadow(0 16px 22px rgba(0,0,0,0.18));
}
.bagelCart.moving {
  filter:
    drop-shadow(0 16px 22px rgba(0,0,0,0.18))
    drop-shadow(0 0 18px rgba(120, 220, 255, 0.18));
}
.bagelCart.oven.moving {
  filter:
    drop-shadow(0 16px 22px rgba(0,0,0,0.18))
    drop-shadow(0 0 24px rgba(255, 142, 40, 0.22));
}
.bagelCart.ready {
  filter:
    drop-shadow(0 16px 22px rgba(0,0,0,0.18))
    drop-shadow(0 0 26px rgba(120, 255, 206, 0.18));
}
.bagelCart.bounce { animation: pop 0.42s ease; }
@keyframes pop {
  0% { transform: translate(var(--tx,0), var(--ty,0)); }
  45% { transform: translate(var(--tx,0), calc(var(--ty,0) - 6px)); }
  100% { transform: translate(var(--tx,0), var(--ty,0)); }
}

/* cart smear */
.cartGhost {
  position: absolute;
  inset: 0;
  border-radius: 22px;
  opacity: 0;
  background: radial-gradient(circle at 40% 35%, rgba(255,255,255,0.25), rgba(255,255,255,0) 65%);
  filter: blur(8px);
}
.bagelCart.moving .cartGhost {
  opacity: 1;
  animation: smear 0.6s ease-in-out infinite;
}
@keyframes smear {
  0% { transform: translateX(-2px) scale(1.02); opacity: 0.35; }
  50% { transform: translateX(4px) scale(1.06); opacity: 0.18; }
  100% { transform: translateX(-2px) scale(1.02); opacity: 0.35; }
}

.cart {
  position: relative;
  width: 110px;
  height: 78px;
  border-radius: 20px;
  border: 1px solid rgba(75,52,41,0.16);
  background: rgba(255,255,255,0.90);
  box-shadow: 0 14px 30px rgba(0,0,0,0.10);
  display: grid;
  place-items: center;
}
.cartTop {
  position: absolute;
  top: -10px;
  width: 88px;
  height: 18px;
  border-radius: 999px;
  background: rgba(75,52,41,0.10);
  border: 1px solid rgba(75,52,41,0.12);
}
.bagel { transform: translateY(-2px); }
.bagelSvg {
  display: block;
  transform-origin: 50% 50%;
  animation: bob 2.4s ease-in-out infinite;
}
@keyframes bob {
  0% { transform: translateY(0) rotate(-1deg); }
  50% { transform: translateY(-5px) rotate(1deg); }
  100% { transform: translateY(0) rotate(-1deg); }
}

/* wheels */
.wheels {
  position: absolute;
  bottom: -12px;
  left: 16px;
  right: 16px;
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

/* tiny trail */
.trail {
  position: absolute;
  left: 12px;
  bottom: 10px;
  width: 78px;
  height: 34px;
  border-radius: 18px;
  background: linear-gradient(90deg, rgba(244,179,22,0.0), rgba(120, 220, 255, 0.25), rgba(120,255,206,0.0));
  filter: blur(6px);
  opacity: 0.95;
  animation: trailPulse 0.25s ease-in-out infinite;
}
@keyframes trailPulse {
  0% { opacity: 0.55; }
  50% { opacity: 1; }
  100% { opacity: 0.55; }
}

/* Particles */
.particles {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
}
.p {
  position: absolute;
  border-radius: 999px;
  opacity: 0.95;
  transform: translate(0,0);
  animation: fly var(--life) ease-out forwards;
  box-shadow: 0 10px 18px rgba(0,0,0,0.08);
}
.p.crumb { background: radial-gradient(circle at 30% 30%, #ffe7c6, #d68a3a); }
.p.streak {
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(255, 205, 140, 0.0), rgba(255, 170, 70, 0.85), rgba(255,255,255,0.55));
  box-shadow: 0 0 16px rgba(255, 160, 60, 0.18);
}
@keyframes fly {
  to { transform: translate(var(--dx), var(--dy)); opacity: 0; filter: blur(0.5px); }
}

/* Status panel */
.statusPanel { margin-top: 14px; padding: 12px 2px 0; }
.statusPill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(75, 52, 41, 0.12);
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(10px);
  box-shadow: 0 14px 30px rgba(0,0,0,0.06);
}
.statusDot {
  width: 12px; height: 12px; border-radius: 999px;
  background: rgba(75,52,41,0.2);
  box-shadow: 0 0 0 4px rgba(75,52,41,0.06);
}
.statusDot.ordered,
.statusDot.preparing { background: rgba(120, 220, 255, 0.95); box-shadow: 0 0 0 4px rgba(120,220,255,0.14); }
.statusDot.oven { background: rgba(255, 142, 40, 0.95); box-shadow: 0 0 0 4px rgba(255,142,40,0.14); }
.statusDot.ready { background: rgba(120, 255, 206, 0.95); box-shadow: 0 0 0 4px rgba(120,255,206,0.14); }
.statusTitle { font-weight: 1000; letter-spacing: 0.2px; }
.statusSub { margin: 10px 0 0; font-weight: 900; opacity: 0.78; }

/* Demo */
.demoLine { margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(75, 52, 41, 0.12); }
.demoTitle { font-weight: 900; opacity: 0.7; margin-bottom: 10px; }
.demoBtns { display: flex; gap: 10px; flex-wrap: wrap; }
.demoBtn {
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: #fff;
  border-radius: 12px;
  padding: 8px 10px;
  cursor: pointer;
  font-weight: 900;
  box-shadow: 0 10px 24px rgba(0,0,0,0.06);
  transition: transform 0.08s ease, box-shadow 0.08s ease;
}
.demoBtn:hover { transform: translateY(-1px); box-shadow: 0 14px 32px rgba(0,0,0,0.10); }
.demoBtn.oven { border-color: rgba(255, 142, 40, 0.25); }
.demoBtn.ready { border-color: rgba(120, 255, 206, 0.25); }

/* Responsive */
@media (max-width: 980px) {
  .page { grid-template-columns: 220px 1fr; }
}
@media (max-width: 720px) {
  .page { grid-template-columns: 1fr; }
  .sidebar { border-right: none; border-bottom: 1px solid rgba(75,52,41,0.12); }
  .belt { height: 290px; }
  .station { width: 160px; }
}
</style>
