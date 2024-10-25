<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

let username = ref("");
let currentPassword = ref("");
let newPassword = ref("");

const { updateUserUsername, updateUserPassword, updateSession } = useUserStore();

async function updateUsername() {
  await updateUserUsername(username.value);
  await updateSession();
  username.value = "";
}

async function updatePassword() {
  await updateUserPassword(currentPassword.value, newPassword.value);
  await updateSession();
  currentPassword.value = newPassword.value = "";
}
</script>

<template>
  <h2>Update user details</h2>
  <legend>Change your username</legend>
  <div class="inputs">
    <input type="text" placeholder="New username" v-model="username" required />
    <form @submit.prevent="updateUsername" class="pure-form">
      <button type="submit" class="btn-small pure-button primary full">Update username</button>
    </form>
  </div>

  <legend>Change your password</legend>
  <div class="inputs">
    <input placeholder="Old password" v-model="currentPassword" required />
    <input placeholder="New password" v-model="newPassword" required />
    <form @submit.prevent="updatePassword" class="pure-form">
      <button type="submit" class="btn-small pure-button primary full">Update password</button>
    </form>
  </div>
</template>
<style scoped>
.inputs {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
</style>
