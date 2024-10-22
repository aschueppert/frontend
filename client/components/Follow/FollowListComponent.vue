<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import FollowComponent from "./FollowComponent.vue";
import FollowUserForm from "./FollowUserForm.vue";
const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let following = ref<Array<Record<string, string>>>([]);

async function getFollowing() {
  let followingResults;
  try {
    followingResults = await fetchy("/api/follows", "GET", {});
  } catch (e) {
    return;
  }
  following.value = followingResults;
}

onBeforeMount(async () => {
  await getFollowing();
  loaded.value = true;
});
</script>

<template>
  <!-- Section displaying the list of accounts following -->
  <main v-if="isLoggedIn">
    <h2>Follow User:</h2>
    <FollowUserForm @refreshFollows="getFollowing" />
    <h2>Following</h2>
    <section v-if="loaded && following.length !== 0">
      <article v-for="follow in following" :key="follow._id">
        <FollowComponent :follow="follow" @refreshFollows="getFollowing" />
      </article>
    </section>
    <p v-else-if="loaded">Following no users</p>
    <p v-else>Loading...</p>
  </main>
</template>

<style scoped></style>
