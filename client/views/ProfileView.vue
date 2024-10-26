<script setup lang="ts">
import FollowingComponent from "@/components/Follow/FollowingComponent.vue";
import UserPostListComponent from "@/components/Post/UserPostListComponent.vue";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "../stores/user";
import { fetchy } from "../utils/fetchy";

const { currentUsername } = storeToRefs(useUserStore());
const currentRoute = useRoute();

// Reactive following lists
const following = ref<Array<Record<string, string>>>([]);
const user_following = ref<Array<Record<string, string>>>([]);

async function getFollowing() {
  try {
    const followingResults = await fetchy(`/api/follow/${currentRoute.params.username}`, "GET", {});
    following.value = followingResults;
  } catch (e) {
    console.error("Error fetching following:", e);
  }
}

async function getUserFollowing() {
  try {
    const followingResults = await fetchy(`/api/follow/${currentUsername.value}`, "GET", {});
    user_following.value = followingResults;
  } catch (e) {
    console.error("Error fetching user following:", e);
  }
}

async function getAllFollowing() {
  await getFollowing();
  await getUserFollowing();
}

// Watch for changes in route params to fetch new data when the username changes
watch(() => currentRoute.params.username, getAllFollowing);

// Initial fetch
getAllFollowing();
</script>

<template>
  <main>
    <div>
      <FollowingComponent :following="following" :username="currentRoute.params.username" :user_following="user_following" @refreshFollows="getAllFollowing" />
    </div>
    <UserPostListComponent :username="currentRoute.params.username" />
  </main>
</template>

<style scoped></style>
