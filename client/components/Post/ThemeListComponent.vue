<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
const { isLoggedIn } = storeToRefs(useUserStore());
const emit = defineEmits(["refreshPosts", "navigatePosts"]);
// Reactive references
const themes = [
  "event",
  "news",
  "music",
  "theatre",
  "art",
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
  <main>
    <h2 class="title">Choose a Theme:</h2>

    <!-- Search bar remains at the top -->
    <input v-model="searchTerm" class="search-bar" placeholder="Search available themes" />

    <!-- Scrollable list of themes -->
    <div class="scrollable-list">
      <ul v-if="filteredThemes.length > 0" class="items">
        <li v-for="theme in filteredThemes" :key="theme">
          <router-link class="link" :to="{ name: 'Theme', params: { themeName: theme } }">
            <button class="btn-small pure-button item theme-item">{{ theme }}</button>
          </router-link>
        </li>
      </ul>
    </div>
  </main>
</template>

<style scoped>
.page {
  display: flex;
  padding: 1em;
  flex-direction: column;
  height: calc(100vh-10em); /* Full viewport height */
  overflow: hidden; /* Prevent the entire page from scrolling */
}

.search-bar {
  padding: 0.5em;
  font-size: medium;
  width: 100%;
  margin-bottom: 1em;
  position: sticky; /* Keeps the search bar at the top */
  top: 0; /* Fixed at the top */
  background-color: white; /* Ensure background stays consistent */
  z-index: 1; /* Make sure it's above scrollable content */
}

.scrollable-list {
  overflow-y: auto;
  flex-grow: 1; /* Expand to take remaining space in the flex container */
  max-height: calc(100vh - 10em); /* Subtract height to account for search bar and padding */
}

.items {
  display: flex;
  flex-wrap: wrap; /* Allow items to wrap to the next row */
  gap: 1.45em;
  list-style-type: none;
  padding: 0;
  margin: 0;
  align-items: center;
  justify-content: center;
}

.theme-item {
  width: 140px;
  height: 130px;
  font-size: 1.3em;
  text-align: center;
}

.link {
  text-decoration: none;
}
</style>
