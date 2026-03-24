<template>
  <footer class="siteFooter">
    <div class="container">
      <div class="left">© {{ year }} Einstein Bros Bagels</div>
      <div class="links">
        <NuxtLink to="/privacy">Privacy Policy</NuxtLink>
        <span class="sep">•</span>
        <NuxtLink to="/terms">Terms of Use</NuxtLink>
        <button class="darkFooterBtn" @click="toggleDark">
          {{ isDark ? "☀️ Light" : "🌙 Dark" }}
        </button>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { onMounted } from 'vue'

const year = new Date().getFullYear()

const isDark = useState("darkMode", () => false)

function applyDarkMode(value) {
  if (value) {
    document.documentElement.classList.add("dark")
  } else {
    document.documentElement.classList.remove("dark")
  }
}

function toggleDark() {
  isDark.value = !isDark.value
  applyDarkMode(isDark.value)
  localStorage.setItem("darkMode", JSON.stringify(isDark.value))
}

onMounted(() => {
  applyDarkMode(isDark.value)
})
</script>

<style scoped>
.siteFooter {
  border-top: 1px solid rgba(75,52,41,0.08);
  background: linear-gradient(180deg, rgba(246,240,232,0.6), rgba(251,248,243,0.6));
  padding: 14px 16px;
  color: #4b3429;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.links {
  display: flex;
  gap: 10px;
  align-items: center;
  font-weight: 800;
}
.links a {
  color: var(--brown);
  text-decoration: none;
}
.sep {
  opacity: 0.5;
}
@media (max-width:720px){
  .container{flex-direction:column;gap:6px;text-align:center}
}

.darkFooterBtn {
  margin-left: 14px;
  padding: 6px 12px;
  border-radius: 10px;
  font-weight: 700;
  border: 1px solid rgba(75,52,41,0.2);
  background: #ffffff;
  color: #2c1b12;
  cursor: pointer;
  transition: all 0.2s ease;
}

.darkFooterBtn:hover {
  box-shadow: 0 6px 16px rgba(0,0,0,0.12);
}

html.dark .darkFooterBtn {
  background: #2b2420;
  color: #fff7ee;
  border-color: rgba(255,255,255,0.1);
}
</style>
