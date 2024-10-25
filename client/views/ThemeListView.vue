<script setup lang="ts">
import ThemeListComponent from "@/components/Post/ThemeListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <ThemeListComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
