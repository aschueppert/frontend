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
    console.log(e);
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
  <section v-if="isLoggedIn">
    <h2>Follow User:</h2>
    <FollowUserForm @refreshFollows="getFollowing" />
  </section>
  <section class="following" v-if="loaded && following.length !== 0">
    <h2>Following:</h2>
    <article v-for="follow in following" :key="follow._id">
      <FollowComponent :follow="follow" />
    </article>
  </section>

  <!-- Message when no drafts are found -->
  <p v-else-if="loaded">Following no users</p>

  <!-- Loading message -->
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  border: 3px solid var(--base-border);
  padding: 1em;
  max-width: 30%;
}

.following {
  padding: 1em;
}
</style>
