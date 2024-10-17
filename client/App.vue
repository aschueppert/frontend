<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <head>
    <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;700&display=swap" rel="stylesheet" />
  </head>
  <header>
    <!-- Top section for the logo -->
    <div class="top-bar">
      <div class="title">
        <RouterLink :to="{ name: 'Home' }">
          <h1 class="logo">moodBoard</h1>
        </RouterLink>
      </div>
    </div>

    <!-- Bottom navigation bar -->
    <nav>
      <ul>
        <li>
          <RouterLink :to="{ name: 'Home' }" :class="{ underline: currentRouteName == 'Home' }">Home</RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'Drafts' }" :class="{ underline: currentRouteName == 'Drafts' }">Drafts</RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'Posts' }" :class="{ underline: currentRouteName == 'Posts' }">Posts</RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'Images' }" :class="{ underline: currentRouteName == 'Images' }">Images</RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Settings' }" :class="{ underline: currentRouteName == 'Settings' }">Settings</RouterLink>
        </li>
        <li v-else>
          <RouterLink :to="{ name: 'Login' }" :class="{ underline: currentRouteName == 'Login' }">Login</RouterLink>
        </li>
      </ul>
    </nav>
    <article v-if="toast !== null" class="toast" :class="toast.style">
      <p>{{ toast.message }}</p>
    </article>
  </header>
  <RouterView />
</template>

<style scoped>
@import "./assets/toast.css";

* {
  font-family: var(--base-font);
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Top bar for the logo */
.top-bar {
  padding: 1em 2em;
  background-color: white;
  border-bottom: 3px solid #fc7000;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
  height: 70px; /* Set a specific height for the top bar */
}

h1 {
  font-size: 2em;
  margin: 0;
}

.logo {
  font-family: "Comfortaa", sans-serif;
  font-weight: 700;
  font-size: 2em;
  color: #fc7005;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

img {
  height: 2em;
}

/* Bottom navigation bar */
nav {
  padding: 0.5em 1em;
  background-color: white;
  display: flex;
  align-items: center;
  border-top: 3px solid #fc7000;
  position: fixed;
  bottom: 0;
  width: 100%;
  justify-content: center;
  box-sizing: border-box;
  overflow: hidden;
  height: 60px;
  z-index: 100;
}

a {
  font-size: medium;
  color: black;
  text-decoration: none;
}

ul {
  list-style-type: none;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 0.8em;
  flex-wrap: wrap;
}

.underline {
  text-decoration: underline;
}

/* Add padding to the content area to push it below the fixed top bar */
body,
main,
.content {
  padding-top: 70px; /* This should match the height of the top bar */
  padding-bottom: 70px;
}

/* Toast styling */
.toast {
  position: fixed;
  top: 70px; /* Shifted below the top bar */
  width: 100%;
  text-align: center;
  padding: 1em;
}
</style>
