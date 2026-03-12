<template>
  <div>
    <button
      type="button"
      class="darkToggle"
      @click="toggleDark"
    >
      {{ isDark ? "Light Mode" : "Dark Mode" }}
    </button>

    <NuxtPage />
    <SiteFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import SiteFooter from "~/components/SiteFooter.vue"

const isDark = ref(false)

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
  const saved = localStorage.getItem("darkMode")
  if (saved !== null) {
    isDark.value = JSON.parse(saved)
    applyDarkMode(isDark.value)
  }
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&display=swap');

html, body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  font-weight: 500;
}

.darkToggle {
  top: 72px;
  right: 16px;
  z-index: 9999;
  border: 1px solid rgba(75, 52, 41, 0.14);
  background: #ffffff;
  color: #2c1b12;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.dark .darkToggle {
  background: #241f1b;
  color: #f4ede3;
  border-color: rgba(255, 255, 255, 0.12);
}

@media (max-width: 720px) {
  .darkToggle {
    top: auto;
    bottom: 16px;
    right: 16px;
    padding: 9px 12px;
    font-size: 14px;
  }
}
</style>