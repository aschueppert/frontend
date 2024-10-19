<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

// Props and Emits
const emit = defineEmits(["refreshFollows"]);

// Reactive references
const username = ref("");

// Function to add a member
const followUser = async (username: string) => {
  try {
    await fetchy(`/api/follows`, "POST", { body: { username: username } });
  } catch (e) {
    console.log(e);
    return;
  }
  emit("refreshFollows");
  emptyForm();
};

const emptyForm = () => {
  username.value = "";
};
</script>

<template>
  <form @submit.prevent="followUser(username)">
    <textarea v-model="username" id="username" placeholder="Follow user" required></textarea>
    <div class="base">
      <button class="btn-small pure-button-primary pure-button" type="submit" id="submit">Follow</button>
    </div>
  </form>
</template>

<style scoped></style>
