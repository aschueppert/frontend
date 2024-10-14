<script setup lang="ts">
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";
import { ref } from "vue";

// Props and Emits
const props = defineProps(["post"]);
const emit = defineEmits(["setTheme", "refreshPosts"]);

// Reactive references
const theme = ref("");

// Function to add a member
const setTheme = async (theme) => {
  try {
    await fetchy(`/api/posts/theme/${props.post._id}`, "PATCH", { body: { id: props.post._id, theme: theme } });
  } catch (e) {
    return;
  }
  emit("setTheme");
  emit("refreshPosts");
};
</script>

<template>
  <form @submit.prevent="setTheme(theme)">
    <textarea v-model="theme" id="theme" placeholder="Set Theme" required></textarea>
    <div class="base">
      <menu>
        <li><button class="btn-small pure-button-primary pure-button" type="submit">Set</button></li>
        <li><button class="btn-small pure-button" @click="emit('setTheme')">Cancel</button></li>
      </menu>
      <p v-if="props.post.dateCreated !== props.post.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else class="timestamp">Created on: {{ formatDate(props.post.dateCreated) }}</p>
    </div>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 1.5em;
  border-radius: 4px;
  padding: 0.5;
  resize: none;
}

p {
  margin: 0em;
}

.members {
  font-weight: bold;
  font-size: 1.2em;
}

.theme {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}
.username {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}
menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}
</style>
