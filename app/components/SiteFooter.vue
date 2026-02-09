<template>
  <footer class="siteFooter">
    <div class="container">
      <div class="left">© {{ year }} Einstein Bros Bagels</div>
      <div class="links">
        <NuxtLink to="/privacy">Privacy Policy</NuxtLink>
        <span class="sep">•</span>
        <NuxtLink to="/terms">Terms of Use</NuxtLink>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
const year = new Date().getFullYear()
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
</style>
