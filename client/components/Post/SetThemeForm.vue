<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

// Props and Emits
const props = defineProps(["post"]);
const emit = defineEmits(["setTheme", "refreshPosts"]);

// Reactive references
const theme = ref("");

// Function to add a member
const setTheme = async (theme: string) => {
  try {
    await fetchy(`/api/posts/theme/${props.post._id}`, "PATCH", { body: { id: props.post._id, theme: theme } });
  } catch (e) {
    console.log(e);
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
</style>
