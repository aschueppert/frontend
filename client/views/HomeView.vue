<script setup lang="ts">
import FollowingPostListComponent from "@/components/Post/FollowingPostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>Home Page</h1>
    <img src="https://drive.google.com/thumbnail?id=1z1IeEFSy05Obh_SHncbbE8PYH3opf8uC" alt="bunny1" />
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
    </section>
    <FollowingPostListComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
