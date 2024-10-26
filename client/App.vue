<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const { currentUsername } = storeToRefs(useUserStore());
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {}
});
</script>

<template>
  <head>
    <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
  </head>
  <header>
    <!-- Top section for the logo -->
    <div class="top-bar">
      <div class="title">
        <div v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Home' }">
            <h1 class="logo">moodBoard</h1>
          </RouterLink>
        </div>
        <div v-else>
          <RouterLink :to="{ name: 'Login' }">
            <h1 class="logo">moodBoard</h1>
          </RouterLink>
        </div>
      </div>
      <div class="top-nav">
        <ul>
          <li v-if="isLoggedIn">
            <RouterLink :to="{ name: 'Posts', params: { username: currentUsername } }">
              <i class="fas fa-user"></i>
            </RouterLink>
          </li>
          <li v-if="isLoggedIn">
            <RouterLink :to="{ name: 'Settings' }"><i class="fas fa-cog settings-icon"></i></RouterLink>
          </li>
          <li v-else>
            <RouterLink :to="{ name: 'Login' }"><i class="fas fa-sign-in-alt"></i></RouterLink>
          </li>
        </ul>
      </div>
    </div>

    <!-- Bottom navigation bar -->
    <nav>
      <ul>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Home' }"><i class="fas fa-home"></i></RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'ThemeList' }"><i class="fas fa-palette"></i></RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Drafts' }"><i class="fas fa-plus" id="bordered-icon"></i></RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Events' }"><i class="fas fa-calendar"></i></RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Saved' }"><i class="fas fa-bookmark"></i></RouterLink>
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
@import "./assets/main.css";
* {
  font-family: var(--base-font);
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Top bar for the logo */
.top-bar {
  padding: 1em 1em;
  background-color: white;
  border-bottom: 3px solid #fc7000;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
  height: 70px; /* Set a specific height for the top bar */
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  padding: 10px 1em; /* Add padding to the top */
  background-color: white;
  display: flex;
  align-items: center; /* Center items vertically */
  border-top: 3px solid #fc7000;
  position: fixed;
  bottom: 0;
  width: 100%;
  justify-content: center;
  box-sizing: border-box;
  height: 70x;
  z-index: 100;
}

a {
  font-size: medium;
  color: #fc7000;
  text-decoration: none;
}

nav a {
  font-size: 2em;
}
.top-nav a {
  font-size: 2em;
}

ul {
  list-style-type: none;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1.5em;
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
  padding-bottom: 80px;
}

/* Toast styling */
.toast {
  position: fixed;
  top: 70px; /* Shifted below the top bar */
  width: 100%;
  text-align: center;
  padding: 1em;
}
#bordered-icon {
  display: inline-flex; /* Align items */
  justify-content: center; /* Center icon */
  align-items: center; /* Center icon */
  border: 3px solid #fc7000; /* Add a border */
  border-radius: 5px; /* Optional: rounded corners */
  background-color: white; /* Optional: background color */
}
</style>
