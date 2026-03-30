<template>
  <div class="profileWrap">
    <div class="profileCard">

    <!-- Delete Confirmation Modal -->
    <transition name="fade">
      <div v-if="showDeleteModal" class="modalOverlay">
        <div class="modalCard">
    
          <div class="modalIcon">
            ⚠️
          </div>
    
          <h2 class="modalTitle">Delete Account?</h2>
    
          <p class="modalText">
            This action is permanent. Your account and all data will be removed.
          </p>
    
          <div class="modalActions">
            <button class="cancelBtn" @click="cancelDelete">
              Cancel
            </button>
    
            <button class="confirmBtn" @click="confirmDelete" :disabled="deleting">
              {{ deleting ? "Deleting..." : "Yes, Delete" }}
            </button>
          </div>
    
        </div>
      </div>
    </transition>


      <!-- Top Bar -->
      <div class="topRow">
        <h1 class="title">My Profile</h1>

        <button class="backBtn" @click="goHome">
          Back to Main Page
        </button>
      </div>

      <!-- Info Rows -->
      <div class="row">
        <span class="label">Username</span>
        <span class="value">{{ user?.username }}</span>
      </div>

      <div class="row">
        <span class="label">Account Type</span>
        <span class="value">{{ accountType }}</span>
      </div>

      <div class="row">
        <span class="label">Location</span>
        <span class="value">{{ location }}</span>
      </div>

      <div class="row">
        <span class="label">Password</span>
        <span class="value">********</span>
      </div>


      <!-- Actions -->
      <div class="actions">
        <button class="primaryBtn" @click="goChangePassword">
          Change Password
        </button>

        <button class="dangerBtn" @click="deleteAccount">
          Delete Account
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useApi } from "~/composables/useApi"

const showDeleteModal = ref(false);
const deleting = ref(false);

const api = useApi();

function deleteAccount() {
  showDeleteModal.value = true;
}

function cancelDelete() {
  showDeleteModal.value = false;
}

async function confirmDelete() {
  deleting.value = true;

  try {
   const data = await api.del("/api/auth/delete");

    if (data.ok) {
      setTimeout(() => {
        window.location.href = "/";
      }, 800);
    } else {
      throw new Error("Delete failed");
    }

  } catch (e) {
    deleting.value = false;
    showDeleteModal.value = false;
    alert("Something went wrong. Try again.");
  }
}

const user = ref(null)
const accountType = ref("User")
const memberSince = ref("")
const location = ref("Dubuque, Iowa")

onMounted(async () => {
  const data = await api.get("/api/me");

  if (data.ok && data.user) {
    user.value = data.user;
  } else {
    navigateTo("/login");
  }
});


function goHome() {
  navigateTo("/")
}

function goChangePassword() {
  navigateTo("/reset")
}
</script>

<style scoped>
.profileWrap {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f6f0e8;
  padding: 40px;
}

.profileCard {
  width: 100%;
  max-width: 650px;
  background: white;
  border-radius: 22px;
  padding: 50px;
  box-shadow: 0 25px 70px rgba(0,0,0,0.12);
}

/* Top Row */
.topRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.title {
  font-size: 30px;
  font-weight: 1000;
  margin: 0;
}

.backBtn {
  padding: 10px 16px;
  border-radius: 14px;
  border: 1px solid rgba(0,0,0,0.15);
  background: #fff;
  font-weight: 900;
  cursor: pointer;
  transition: 0.2s ease;
}

.backBtn:hover {
  border-color: #f4b316;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}

/* Info Rows */
.row {
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid rgba(0,0,0,0.08);
}

.label {
  font-weight: 800;
  opacity: 0.7;
}

.value {
  font-weight: 1000;
}

/* Actions */
.actions {
  margin-top: 30px;
  display: flex;
  gap: 16px;
}

.primaryBtn {
  flex: 1;
  padding: 14px;
  border-radius: 14px;
  border: none;
  background: #0a84ff;
  color: white;
  font-weight: 900;
  cursor: pointer;
}

.primaryBtn:hover {
  background: #0071e3;
}

.dangerBtn {
  flex: 1;
  padding: 14px;
  border-radius: 14px;
  border: none;
  background: #b00020;
  color: white;
  font-weight: 900;
  cursor: pointer;
}

.dangerBtn:hover {
  background: #8e001a;
}

/* ===== Premium Modal ===== */

.modalOverlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  backdrop-filter: blur(8px);
  display: grid;
  place-items: center;
  z-index: 9999;
}

.modalCard {
  width: min(420px, 92vw);
  background: rgba(255, 255, 255, 0.95);
  border-radius: 22px;
  padding: 32px 28px;
  text-align: center;
  box-shadow: 0 30px 80px rgba(0,0,0,0.2);
  animation: popIn 0.2s ease-out;
}

.modalIcon {
  font-size: 32px;
  margin-bottom: 14px;
}

.modalTitle {
  font-size: 22px;
  font-weight: 1000;
  margin-bottom: 10px;
}

.modalText {
  font-size: 14px;
  opacity: 0.7;
  margin-bottom: 26px;
}

.modalActions {
  display: flex;
  gap: 14px;
  justify-content: center;
}

.cancelBtn {
  flex: 1;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid rgba(0,0,0,0.1);
  background: white;
  font-weight: 900;
  cursor: pointer;
  transition: 0.2s ease;
}

.cancelBtn:hover {
  background: #f5f5f5;
}

.confirmBtn {
  flex: 1;
  padding: 12px;
  border-radius: 14px;
  border: none;
  background: #d90429;
  color: white;
  font-weight: 900;
  cursor: pointer;
  transition: 0.2s ease;
}

.confirmBtn:hover {
  background: #b00020;
}

/* Animations */
@keyframes popIn {
  from {
    transform: scale(0.96);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
