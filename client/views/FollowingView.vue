<script setup lang="ts">
import FollowListComponent from "@/components/Follow/FollowListComponent.vue";
import { useRoute } from "vue-router";
const currentRoute = useRoute();
</script>

<template>
  <main>
    <FollowListComponent :username="currentRoute.params.username" />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
