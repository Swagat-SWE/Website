<template>
  <div class="wrap">
    <!-- top right -->
    <button class="backBtn" type="button" @click="goBack">Go back to log in</button>

    <div class="card">
      <h1 class="title">Reset password</h1>

      <!-- STEP 1: username -->
      <label class="label">Enter your username</label>
      <input
        v-model="username"
        class="input"
        placeholder="Your username"
        maxlength="10"
      />

      <button class="primary" :disabled="loading || !usernameTrim" @click="checkUsername">
        {{ loading ? "Checking..." : "Continue" }}
      </button>

      <p v-if="step === 'notfound'" class="err">No account found with that username.</p>

      <!-- STEP 2: new password -->
      <div v-if="step === 'found'" class="step2">
        <label class="label">Enter your new password</label>
        <input
          v-model="newPass"
          class="input"
          type="password"
          placeholder="Max 12 characters"
          maxlength="12"
        />

        <label class="label">Confirm your new password</label>
        <input
          v-model="confirmPass"
          class="input"
          type="password"
          placeholder="Re-type password"
          maxlength="12"
        />

        <button class="primary" :disabled="disableReset" @click="resetPassword">
          {{ loading ? "Resetting..." : "Reset password" }}
        </button>

        <p v-if="localErr" class="err">{{ localErr }}</p>
      </div>

      <p v-if="done" class="ok"> Password updated. Redirecting…</p>
      <p v-if="serverErr" class="err">{{ serverErr }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useApi } from "~/composables/useApi";

const api = useApi();

const username = ref("");
const newPass = ref("");
const confirmPass = ref("");

const loading = ref(false);
const step = ref("start"); // start | found | notfound
const done = ref(false);

const serverErr = ref("");
const localErr = ref("");

const usernameTrim = computed(() => username.value.trim());

const disableReset = computed(() => {
  if (loading.value) return true;
  if (!newPass.value || !confirmPass.value) return true;
  if (newPass.value.length > 12 || confirmPass.value.length > 12) return true;
  return false;
});

function goBack() {
  navigateTo("/login");
}

async function checkUsername() {
  serverErr.value = "";
  localErr.value = "";
  done.value = false;

  loading.value = true;
  try {
    const res = await api.post("/api/auth/reset/check", {
      username: usernameTrim.value,
    });

    if (!res?.ok) throw new Error(res?.error || "Check failed");

    if (res.exists) step.value = "found";
    else step.value = "notfound";
  } catch (e) {
    serverErr.value = e?.message || "Server error";
  } finally {
    loading.value = false;
  }
}

async function resetPassword() {
  serverErr.value = "";
  localErr.value = "";

  // frontend checks
  if (newPass.value !== confirmPass.value) {
    localErr.value = "Passwords do not match.";
    return;
  }
  if (newPass.value.length < 1) {
    localErr.value = "Password required.";
    return;
  }

  loading.value = true;
  try {
    const res = await api.post("/api/auth/reset", {
      username: usernameTrim.value,
      newPassword: newPass.value,
    });

    if (!res?.ok) throw new Error(res?.error || "Reset failed");

    done.value = true;

    // refresh everything: go to login + hard reload
    setTimeout(() => {
      navigateTo("/login");
      setTimeout(() => window.location.reload(), 50);
    }, 900);
  } catch (e) {
    serverErr.value = e?.message || "Server error";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.wrap{
  min-height: 100vh;
  background: linear-gradient(135deg, #f6f0e8, #eae2d7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
}

.backBtn{
  position: absolute;
  top: 18px;
  right: 18px;
  border: 1px solid rgba(0,0,0,0.12);
  background: rgba(255,255,255,0.8);
  padding: 10px 14px;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 900;
}

.card{
  width: 100%;
  max-width: 720px;
  padding: 70px 70px;
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 25px 70px rgba(0,0,0,0.12);
  border: 1px solid rgba(0,0,0,0.08);
}

.title{
  font-size: 32px;
  font-weight: 1000;
  margin: 0 0 22px;
}

.label{
  display: block;
  margin: 16px 0 6px;
  font-weight: 900;
}

.input{
  width: 100%;
  box-sizing: border-box;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid rgba(0,0,0,0.15);
  outline: none;
}

.primary{
  width: 100%;
  margin-top: 16px;
  padding: 14px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #f4b316, #e5a600);
  font-weight: 1000;
  cursor: pointer;
}

.primary:disabled{
  opacity: 0.5;
  cursor: not-allowed;
}

.step2{
  margin-top: 18px;
  padding-top: 8px;
}

.err{
  margin-top: 12px;
  color: #b00020;
  font-weight: 900;
}

.ok{
  margin-top: 12px;
  color: #0f7a2e;
  font-weight: 900;
}
</style>
