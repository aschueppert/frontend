<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { defineProps, ref } from "vue";
const { isLoggedIn } = storeToRefs(useUserStore());

const { currentUsername } = storeToRefs(useUserStore());
let following = ref<Array<Record<string, string>>>([]);

const emit = defineEmits(["refreshFollows"]); // Define emits for the component
const props = defineProps(["username", "following", "user_following"]);

// Follow a user
const followUser = async (followingUser: string) => {
  try {
    await fetchy(`/api/follows`, "POST", { body: { username: followingUser } });
    emit("refreshFollows");
  } catch (e) {
    console.error("Error following user:", e);
  }
  emit("refreshFollows");
};

const unfollowUser = async (followingUser: string) => {
  try {
    await fetchy(`/api/follows/${followingUser}`, "DELETE");
    following.value = following.value.filter((f) => f.following !== followingUser); // Remove unfollowed user from the list
    emit("refreshFollows");
  } catch (e) {
    console.error("Error unfollowing user:", e);
  }
  emit("refreshFollows");
};
</script>

<template>
  <!-- Section displaying the list of accounts following -->
  <div v-if="isLoggedIn">
    <div class="row">
      <h1>{{ props.username }}</h1>
      <router-link class="link" :to="{ name: 'Following', params: { username: props.username } }">
        <button class="btn-small pure-button">Following: {{ props.following.length }}</button></router-link
      >
      <div v-if="props.username != currentUsername">
        <button v-if="!props.user_following.some((user: any) => user.following === props.username)" class="btn-small pure-button primary small" @click="() => followUser(props.username)">
          Follow
        </button>
        <button v-else class="btn-small pure-button primary button-error" @click="() => unfollowUser(props.username)">Unfollow</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 1em;
}
</style>
