<script setup lang="ts">
import PostComponent from "@/components/Post/PostComponent.vue";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);
let setting = ref("");
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
  <div>
    <section v-if="loaded && posts.length !== 0">
      <article v-for="post in posts" :key="post._id" :class="{ approved: post.status === 'Approved' }">
        <div class="overlap-container">
          <div v-if="setting === post._id" class="overlay"></div>
          <PostComponent :post="post" @refreshPosts="getPosts" />
        </div>
      </article>
    </section>

    <!-- Message when no posts are found -->
    <p v-else-if="loaded">No Posts found</p>

    <!-- Loading message -->
    <p v-else>Loading...</p>
  </div>
</template>

<style scoped>
.overlap-container {
  position: relative; /* Set this to relative to contain absolutely positioned elements */
  overflow: hidden;
}
.approved {
  border-color: var(--green);
}
</style>
