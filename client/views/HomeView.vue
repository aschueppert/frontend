<script setup lang="ts">
import FollowingPostListComponent from "@/components/Post/FollowingPostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <FollowingPostListComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
