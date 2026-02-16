<template>
  <NuxtPage />
  <SiteFooter />
</template>

<script setup>
import SiteFooter from "~/components/SiteFooter.vue"
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&display=swap');

/* GLOBAL FONT CONTROL */
html, body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  font-weight: 500;
}
</style>
