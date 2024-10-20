<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import AddMemberForm from "../Draft/AddMemberForm.vue";
import FollowComponent from "./FollowComponent.vue";
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
  <section class="page" v-if="isLoggedIn">
    <h2>Follow User:</h2>
    <AddMemberForm @refreshDrafts="getFollowing" />
    <h2>Following</h2>
    <section v-if="loaded && following.length !== 0">
      <article v-for="follow in following" :key="follow._id">
        <div class="items">
          <FollowComponent :follow="follow" @refreshFollows="getFollowing" />
        </div>
      </article>
    </section>

    <!-- Message when no drafts are found -->
    <p v-else-if="loaded">Following no users</p>

    <!-- Loading message -->
    <p v-else>Loading...</p>
  </section>
</template>

<style scoped>
.items {
  padding: 0.5em; /* Padding withing blue borders */
}

section,
p {
  margin: 0 auto;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  border: 3px solid var(--base-border);
  margin-bottom: 1em;
  margin-top: 1em;
}

.page {
  padding: 1em; /*not right along edge*/
  gap: 1em;
}
</style>
