<script setup lang="ts">
import UserPostListComponent from "@/components/Post/UserPostListComponent.vue";
import FollowingComponent from "@/components/Follow/FollowingComponent.vue";
import { useRoute } from "vue-router";
const currentRoute = useRoute();
</script>

<template>
  <main>
    <h1>{{ currentRoute.params.username }}</h1>
    <div>
      <FollowingComponent :username="currentRoute.params.username" />
    </div>
    <UserPostListComponent :username="currentRoute.params.username" />
  </main>
</template>

<style scoped></style>
