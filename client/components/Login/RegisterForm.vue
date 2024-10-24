<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

const username = ref("");
const password = ref("");
const { createUser, loginUser, updateSession } = useUserStore();

async function register() {
  await createUser(username.value, password.value);
  await loginUser(username.value, password.value);
  void updateSession();
  void router.push({ name: "Home" });
  void router.push({ name: "Drafts" });
  void router.push({ name: "Posts" });
  void router.push({ name: "Events" });
  void router.push({ name: "Following" });
  void router.push({ name: "Saved" });
}
</script>

<template>
  <h2>Register User</h2>
  <div class="inputs">
    <input v-model.trim="username" type="text" id="aligned-name" placeholder="Username" required />
    <input type="password" v-model.trim="password" id="aligned-password" placeholder="Password" required />
  </div>
  <form @submit.prevent="register">
    <button type="submit" class="pure-button pure-button primary">Register</button>
  </form>
</template>

<style scoped>
.inputs {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
</style>
