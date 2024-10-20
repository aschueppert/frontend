<script setup lang="ts">
import { computed, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

// Props and Emits
const props = defineProps(["post"]);
const emit = defineEmits(["setTheme", "refreshPosts"]);

// Reactive references
const themes = [
  "event",
  "news",
  "music",
  "theatre",
  "art",
  "sports",
  "food",
  "fashion",
  "technology",
  "politics",
  "science",
  "health",
  "education",
  "travel",
  "lifestyle",
  "television",
  "film",
  "literature",
  "comics",
  "games",
  "hobbies",
  "crafts",
  "pets",
  "gardening",
  "sports",
];

// Reactive references
const selectedTheme = ref(""); // Reactive reference for the selected user
let users = ref<Array<Record<string, string>>>([]);
const searchTerm = ref("");

// Function to select a user
const selectTheme = (theme: string) => {
  selectedTheme.value = theme; // Set the selected user
};

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

// Function to cancel selection
const cancelSelection = () => {
  selectedTheme.value = ""; // Clear the selected user
  searchTerm.value = ""; // Clear the search term
  emit("setTheme");
  emit("refreshPosts");
};

// Computed filtered list of users based on search term
const filteredThemes = computed(() => {
  return themes.filter(
    (theme) => theme && theme.toString().toLowerCase().includes(searchTerm.value.toLowerCase()), // Ensure username is defined
  );
});
</script>

<template>
  <div class="page">
    <h3>Themes</h3>
    <input v-model="searchTerm" id="theme" placeholder="Search available themes" />
    <ul v-if="filteredThemes.length > 0" class="item-list">
      <button v-for="theme in filteredThemes.slice(0, 6)" :key="theme" class="btn-small pure-button" :class="{ selected: selectedTheme === theme.toString() }" @click="selectTheme(theme.toString())">
        {{ theme }}
      </button>
    </ul>
    <form @submit.prevent="setTheme(selectedTheme)">
      <li><button class="btn-small pure-button primary" type="submit" :disabled="!selectedTheme">Set</button></li>
      <li><button type="button" class="btn-small pure-button" @click="cancelSelection">Cancel</button></li>
    </form>
  </div>
</template>

<style scoped></style>
