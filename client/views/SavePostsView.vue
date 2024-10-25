<script setup lang="ts">
import SavePostListComponent from "@/components/Save/SavePostListComponent.vue";
import { useRoute } from "vue-router";
const currentRoute = useRoute();
</script>

<template>
  <main>
    <SavePostListComponent :name="currentRoute.params.name" />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
