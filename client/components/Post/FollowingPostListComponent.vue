<script setup lang="ts">
import { fetchy } from "../../utils/fetchy";
import { onBeforeMount, ref } from "vue";
import PostComponent from "@/components/Post/PostComponent.vue";

const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);

async function getPosts() {
  let postResults;
  console.log("getting posts");
  try {
    postResults = await fetchy(`/api/posts/following`, "GET", {});
  } catch (_) {
    console.log(_);
    return;
  }
  posts.value = postResults;
}

onBeforeMount(async () => {
  await getPosts();
  loaded.value = true;
});
</script>

<template>
  <section class="posts" v-if="loaded && posts.length !== 0">
    <article v-for="post in posts" :key="post._id">
      <PostComponent :post="post" @refreshPosts="getPosts" />
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
  border: 3px solid var(--yellow);
  padding: 1em;
}
.approved {
  border-color: var(--green);
}

.posts {
  padding: 1em;
}
</style>
