<template>
  <div class="wrap">
    <div class="card">
      <h1 class="title">Create account</h1>

      <!-- USERNAME -->
      <label class="label">Username</label>
      <input
        v-model="username"
        class="input"
        placeholder="10 characters max"
        autocomplete="username"
        maxlength="10"
        @input="onUsernameInput"
      />

      <p v-if="usernameTooLong" class="hintErr">
        Limit exceeded: username max 10 characters.
      </p>

      <p v-else-if="usernameBadChars" class="hintErr">
        Only letters, numbers, underscore.
      </p>
      
      <p v-else-if="usernameTrim && usernameTrim.length < 3" class="hintErr">
        Username must be at least 3 characters.
      </p>


      <!-- PASSWORD -->
      <label class="label">Password</label>

      <div class="passwordWrap">
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          class="input passwordInput"
          placeholder="12 characters max"
          autocomplete="new-password"
          maxlength="12"
          @input="onPasswordInput"
        />

        <span class="eye" @click="showPassword = !showPassword">
          {{ showPassword ? "🙈" : "👁️" }}
        </span>
      </div>

      <p v-if="passwordTooLong" class="hintErr">
        Limit exceeded: password max 12 characters.
      </p>

      <!-- BUTTON -->
      <button
        class="primary"
        :disabled="disableCreate"
        @click="register"
      >
        {{ loading ? "Creating account..." : "Create account" }}
      </button>

      <p v-if="err" class="err">{{ err }}</p>

      <p class="footer">
        Already have an account?
        <NuxtLink to="/login" class="link">Sign in</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useApi } from "~/composables/useApi";

const api = useApi();

const username = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const err = ref("");

const USERNAME_MAX = 10;
const PASSWORD_MAX = 12;

const usernameTrim = computed(() => username.value.trim());

const usernameTooLong = computed(() => username.value.length > USERNAME_MAX);
const passwordTooLong = computed(() => password.value.length > PASSWORD_MAX);
const usernameBadChars = computed(
  () => username.value.length > 0 && !/^[a-zA-Z0-9_]*$/.test(username.value)
);


const disableCreate = computed(() => {
  if (!usernameTrim.value) return true;
  if (usernameTrim.value.length < 3) return true; // matches backend
  if (password.value.length < 1) return true;
  if (usernameTooLong.value || passwordTooLong.value) return true;
  if (usernameBadChars.value) return true;
  return loading.value;
});

// extra-safe: if user pastes huge text, we cut it
function onUsernameInput() {
  if (username.value.length > USERNAME_MAX) {
    username.value = username.value.slice(0, USERNAME_MAX);
  }
}

function onPasswordInput() {
  if (password.value.length > PASSWORD_MAX) {
    password.value = password.value.slice(0, PASSWORD_MAX);
  }
}

async function register() {
  err.value = "";
  loading.value = true;

  try {
    // final check before API
    if (usernameTooLong.value) throw new Error("Limit exceeded: username max 10 characters.");
    if (passwordTooLong.value) throw new Error("Limit exceeded: password max 12 characters.");
    if (usernameTrim.value.length < 3) throw new Error("Username must be at least 3 characters.");
    if (usernameBadChars.value) throw new Error("Only letters, numbers, underscore.");

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
</script>

<style scoped>
.wrap {
  min-height: 100vh;
  background: linear-gradient(135deg, #f6f0e8, #eae2d7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.card {
  width: 100%;
  max-width: 750px;
  padding: 100px 100px;
  background: #ffffff;
  border-radius: 22px;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.title {
  font-size: 32px;
  font-weight: 1000;
  margin-bottom: 30px;
}

.label {
  display: block;
  margin: 18px 0 6px;
  font-weight: 900;
}

.input {
  width: 100%;
  box-sizing: border-box;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  outline: none;
  transition: 0.2s ease;
}

.input:focus {
  border-color: #f4b316;
  box-shadow: 0 0 0 6px rgba(244, 179, 22, 0.2);
}

/* password wrapper */
.passwordWrap {
  position: relative;
  width: 100%;
}

.passwordInput {
  padding-right: 55px;
}

/* eye */
.eye {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 18px;
  opacity: 0.65;
  user-select: none;
  transition: 0.2s ease;
}

.eye:hover {
  opacity: 1;
}

.primary {
  width: 100%;
  margin-top: 26px;
  padding: 14px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #f4b316, #e5a600);
  font-weight: 1000;
  cursor: pointer;
  transition: 0.2s ease;
}

.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 15px 35px rgba(244, 179, 22, 0.3);
}

.primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.hintErr {
  margin: 8px 0 0;
  color: #b00020;
  font-weight: 900;
  font-size: 12px;
}

.err {
  margin-top: 14px;
  color: #b00020;
  font-weight: 900;
}

.footer {
  margin-top: 28px;
  font-weight: 800;
  opacity: 0.75;
}

.link {
  font-weight: 1000;
  text-decoration: underline;
  color: #111;
}
</style>
