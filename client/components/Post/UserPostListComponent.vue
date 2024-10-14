<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";
import { onBeforeMount, ref } from "vue";
import SetThemeForm from "@/components/Post/SetThemeForm.vue";
import PostComponent from "@/components/Post/PostComponent.vue";

let setting = ref("");
const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);

const { currentUsername } = storeToRefs(useUserStore());

async function getPosts() {
  let postResults;
  try {
    postResults = await fetchy(`/api/posts/get/${currentUsername._value}`, "GET", {});
  } catch (_) {
    return;
  }
  posts.value = postResults;
}

function updateSetting(id: string) {
  setting.value = id;
}

onBeforeMount(async () => {
  await getPosts();
  loaded.value = true;
});
</script>

<template>
  <section class="posts" v-if="loaded && posts.length !== 0">
    <article v-for="post in posts" :key="post._id" :class="{ approved: post.status === 'Approved' }">
      <PostComponent v-if="setting !== post._id" :post="post" @refreshPosts="getPosts" @setTheme="updateSetting" />
      <SetThemeForm v-else :post="post" @refreshPosts="getPosts" @setTheme="updateSetting" />
    </article>
  </section>

  <!-- Message when no posts are found -->
  <p v-else-if="loaded">No Posts found</p>

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
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  border: 3px solid var(--yellow);
  padding: 1em;
}
.approved {
  border-color: var(--green);
}

.posts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
