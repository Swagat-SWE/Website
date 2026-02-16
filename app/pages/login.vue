<!-- app/pages/login.vue -->
<template>
  <div class="wrap">
    <div class="card">
      <!-- RIGHT: Account -->
      <section class="left">
        <h2 class="rightTitle">Sign in</h2>

        <label class="label">Username</label>
        <input 
          v-model="username" 
          class="input" 
          placeholder="10 characters max"
          maxlength="10"
        />


        <label class="label">Password</label>
        <input 
          v-model="password" 
          class="input" 
          type="password" 
          placeholder="••••••••"
          maxlength="12"
        />

        <button class="primary" :disabled="!usernameTrim || usernameTrim.length > 10 || !password || password.length > 12 || loading">
          {{ loading ? "Signing in..." : "Sign In" }}
        </button>

        <!-- ✅ show errors for login/register -->
        <p v-if="err" class="err">{{ err }}</p>

        <p class="muted">
          Don’t have an account?
          <NuxtLink to="/register" class="link">Create one</NuxtLink>
        </p>

        <p class="tiny">
          Staff? Go to <NuxtLink to="/staff" class="link">/staff</NuxtLink>
        </p>
      </section>

      <!-- LEFT: Guest -->
      <section class="right">
        <h1 class="title">Order faster with a guest account</h1>

        <button class="bigBtn" @click="guestStep = true">
          Continue as Guest
        </button>

        <div v-if="guestStep" class="guestBox">
          <label class="label">Your preferred order name:</label>
          <input v-model="guestName" class="input" placeholder="e.g., Swagat" maxlength="40" />

          <button class="primary" :disabled="!guestNameTrim || loading" @click="continueGuest">
            {{ loading ? "Saving..." : "Continue" }}
          </button>

          <p v-if="err" class="err">{{ err }}</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useApi } from "~/composables/useApi";

const api = useApi();

const username = ref("");
const password = ref("");

const guestName = ref("");
const guestStep = ref(false);

const loading = ref(false);
const err = ref("");

const usernameTrim = computed(() => username.value.trim());
const guestNameTrim = computed(() => guestName.value.trim());

async function register() {
  err.value = "";
  loading.value = true;
  try {
    const res = await api.post("/api/auth/register", {
      username: usernameTrim.value,
      password: password.value,
    });

    if (!res?.ok) throw new Error(res?.error || "Register failed");
    await navigateTo("/");
  } catch (e) {
    err.value = e?.message || "Register failed";
  } finally {
    loading.value = false;
  }
}

async function login() {
  err.value = "";
  loading.value = true;
  try {
    const res = await api.post("/api/auth/login", {
      username: usernameTrim.value,
      password: password.value,
    });

    if (!res?.ok) throw new Error(res?.error || "Login failed");
    await navigateTo("/");
  } catch (e) {
    err.value = e?.message || "Login failed";
  } finally {
    loading.value = false;
  }
}

async function continueGuest() {
  err.value = "";
  loading.value = true;
  try {
    const res = await api.post("/api/guest", { name: guestNameTrim.value });
    if (!res?.ok) throw new Error(res?.error || "Guest start failed");
    await navigateTo("/");
  } catch (e) {
    err.value = e?.message || "Guest start failed";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.wrap {
  min-height: 100vh;
  display: flex;
  background: linear-gradient(135deg, #f6f0e8, #eae2d7);
}

.card {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-radius: 0;
  box-shadow: none;
  background: #fff;
}

.left,
.right {
  padding: 80px 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title {
  font-size: 34px;
  font-weight: 900;
  margin: 0 0 6px;
}

.sub {
  margin: 0 0 18px;
  opacity: 0.75;
  font-weight: 700;
}

.bigBtn {
  width: 100%;
  padding: 16px 18px;
  border-radius: 18px;
  border: none;
  background: linear-gradient(135deg, #f4b316, #e5a600);
  color: #111;
  font-weight: 900;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.bigBtn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(244, 179, 22, 0.35);
}

.title {
  margin-bottom: 28px;
}

.guestBox {
  margin-top: 18px;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: #fff;
}

.rightTitle {
  margin: 0 0 18px;
  font-size: 26px;
  font-weight: 900;
}

.label {
  display: block;
  margin: 12px 0 6px;
  font-weight: 900;
  opacity: 0.85;
}

.input {
  width: 100%;
  padding: 12px 12px;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  outline: none;
}

.primary {
  width: 100%;
  margin-top: 14px;
  padding: 12px 14px;
  border-radius: 14px;
  border: none;
  background: #f4b316;
  font-weight: 1000;
  cursor: pointer;
}

.primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.muted {
  margin-top: 14px;
  font-weight: 800;
  opacity: 0.7;
}

.tiny {
  margin-top: 10px;
  font-size: 12px;
  opacity: 0.65;
  font-weight: 800;
}

.link {
  font-weight: 1000;
  text-decoration: underline;
  color: #111;
}

.err {
  margin-top: 10px;
  color: #b00020;
  font-weight: 900;
}

@media (max-width: 900px) {
  .card {
    grid-template-columns: 1fr;
  }
  .right {
    border-left: none;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
  }
}
</style>
