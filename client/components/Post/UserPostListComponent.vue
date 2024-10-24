<script setup lang="ts">
import PostComponent from "@/components/Post/PostComponent.vue";
import SavePostForm from "@/components/Post/SavePostForm.vue";
import SetThemeForm from "@/components/Post/SetThemeForm.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import CreateEventForm from "./CreateEventForm.vue";
const { isLoggedIn } = storeToRefs(useUserStore());

let setting = ref("");
let saving = ref("");
let creating = ref("");
const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);

const { currentUsername } = storeToRefs(useUserStore());

async function getPosts() {
  let postResults;
  try {
    postResults = await fetchy(`/api/posts/get/${currentUsername.value}`, "GET", {});
  } catch (_) {
    return;
  }
  posts.value = postResults;
}
1;

function updateSetting(id: string) {
  setting.value = id;
}

function updateSaving(id: string) {
  console.log(saving);
  saving.value = id;
}

function updateCreating(id: string) {
  console.log(saving);
  creating.value = id;
}

onBeforeMount(async () => {
  await getPosts();
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <section v-if="loaded && posts.length !== 0">
      <article v-for="post in posts" :key="post._id" :class="{ approved: post.status === 'Approved' }">
        <div class="overlap-container">
          <div v-if="setting === post._id || saving === post._id || creating === post._id" class="overlay"></div>
          <PostComponent :post="post" @refreshPosts="getPosts" @setTheme="updateSetting" @savePost="updateSaving" @createEvent="updateCreating" />
          <SetThemeForm v-if="setting == post._id" :post="post" @refreshPosts="getPosts" @setTheme="updateSetting" class="overlay-form" />
          <SavePostForm v-if="saving == post._id" :post="post" @refreshPosts="getPosts" @savePost="updateSaving" class="overlay-form" />
          <CreateEventForm v-if="creating == post._id" :post="post" @refreshPosts="getPosts" @createEvent="updateCreating" class="overlay-form" />
        </div>
      </article>
    </section>

    <!-- Message when no posts are found -->
    <p v-else-if="loaded">No Posts found. Start creating one now!</p>

    <!-- Loading message -->
    <p v-else>Loading...</p>
  </section>
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
