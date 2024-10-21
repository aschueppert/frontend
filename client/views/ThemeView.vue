<!-- ThemeView.vue -->
<script setup lang="ts">
import ThemePostListComponent from "@/components/Post/ThemePostListComponent.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const themeName = route.params.themeName; // Retrieve the theme name from the route params
</script>

<template>
  <main>
    <ThemePostListComponent :theme="themeName" />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
