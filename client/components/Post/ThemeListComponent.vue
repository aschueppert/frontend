<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
const { isLoggedIn } = storeToRefs(useUserStore());

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
const searchTerm = ref("");

// Computed filtered list of users based on search term
const filteredThemes = computed(() => {
  return themes.filter(
    (theme) => theme && theme.toString().toLowerCase().includes(searchTerm.value.toLowerCase()), // Ensure username is defined
  );
});
</script>

<template>
  <!-- Section displaying the list of accounts following -->
  <section class="page" v-if="isLoggedIn">
    <h2 class="title">Choose a Theme:</h2>
    <input v-model="searchTerm" class="search-bar" placeholder="Search available themes" />
    <ul v-if="filteredThemes.length > 0" class="items">
      <button v-for="theme in filteredThemes.slice(0, 6)" :key="theme" class="btn-small pure-button big-button">
        {{ theme }}
      </button>
    </ul>
  </section>
</template>

<style scoped>
.title {
  margin-bottom: 1em; /* Add space below the title */
}

.search-bar {
  margin-bottom: 1em; /* Add space below the search bar */
  padding: 0.5em; /* Add padding for better input styling */
  width: 100%; /* Ensure the input takes full width */
  font-size: medium; /* Set font size for the input */
}

.items {
  display: flex; /* Use flexbox for layout */
  flex-direction: column; /* Stack items in a column */
  gap: 1em; /* Space between items */
  list-style-type: none; /* Remove default list styling */
}

section,
p {
  margin: 0 auto;
}

.page {
  padding: 1em; /* Not right along edge */
}

.big-button {
  width: 100%;
  padding: 1em;
  font-size: medium;
  text-align: center;
  display: flex; /* Use flexbox for centering text */
  align-items: center; /* Vertically center text */
  justify-content: center; /* Horizontally center text */
}
</style>
