<template>
  <div class="page">
    <h1 class="title">Customer Reviews</h1>

    <div v-if="loading" class="loading">Loading reviews...</div>

    <div v-else-if="reviews.length === 0" class="empty">
      No reviews yet 😔
    </div>

    <div v-else class="reviewList">
      <div v-for="r in reviews" :key="r.id" class="card">
        
        <!-- ⭐ Stars -->
        <div class="stars">
          <span v-for="n in 5" :key="n">
            {{ n <= r.rating ? "★" : "☆" }}
          </span>
        </div>

        <!-- 👤 Name -->
        <div class="name">
          {{ r.user?.username || r.guestName || "Anonymous" }}
        </div>

        <!-- 💬 Comment -->
        <div v-if="r.comment" class="comment">
          "{{ r.comment }}"
        </div>

        <!-- 🕒 Time -->
        <div class="time">
          {{ formatDate(r.createdAt) }}
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useApi } from "~/composables/useApi"

const api = useApi()

const reviews = ref([])
const loading = ref(true)

function formatDate(date) {
  return new Date(date).toLocaleString()
}

async function loadReviews() {
  try {
    const res = await api.get("/api/reviews")

    if (res?.ok) {
      reviews.value = res.reviews
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadReviews()
})
</script>

<style scoped>
.page {
  padding: 20px;
}

.title {
  font-size: 28px;
  font-weight: 900;
  margin-bottom: 20px;
}

.loading,
.empty {
  text-align: center;
  margin-top: 40px;
  font-weight: 600;
  color: #666;
}

.reviewList {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card {
  padding: 16px;
  border-radius: 14px;
  border: 1px solid #ddd;
  background: #fff;
  box-shadow: 0 8px 20px rgba(0,0,0,0.05);
}

.stars {
  font-size: 20px;
  color: #f4b316;
  margin-bottom: 6px;
}

.name {
  font-weight: 800;
  margin-bottom: 6px;
}

.comment {
  font-style: italic;
  margin-bottom: 6px;
}

.time {
  font-size: 12px;
  color: #777;
}
</style>