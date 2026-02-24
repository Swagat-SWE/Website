<template>
  <div class="layout">
    <Transition >
      <div v-if="loading" class="loader">
        <img src="/EinstineLoad (1).gif" alt="Loading..." class="loader-gif" />
      </div>
    </Transition>

    <NuxtPage />
    <SiteFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from '#app'
import SiteFooter from "~/components/SiteFooter.vue"

const loading = ref(false)
const router = useRouter()

router.beforeEach(() => {
  loading.value = true
})

router.afterEach(() => {
  setTimeout(() => {
    loading.value = false
  }, 400)
})
</script>

<style>
body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  font-weight: 500;
}

.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.loader {
  position: fixed;
  inset: 0;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 6px solid #eee;
  border-top: 6px solid #000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
