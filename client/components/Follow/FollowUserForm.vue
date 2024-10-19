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

<style scoped>
form {
  background-color: var(--base-bg);
  border: 3px solid var(--blue);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;

  max-width: 100%; /* Ensure the form does not overflow the page */
}
#submit {
  background-color: #08a4c7;
  color: white;
  max-width: 100%;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
  width: 100%; /* Make sure the textarea takes up available width */
  box-sizing: border-box;
}
</style>
