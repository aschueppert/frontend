<script setup lang="ts">
import PostComponent from "@/components/Post/PostComponent.vue";
import SavePostForm from "@/components/Post/SavePostForm.vue";
import SetThemeForm from "@/components/Post/SetThemeForm.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { defineProps, onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import CreateEventForm from "./CreateEventForm.vue";

const { isLoggedIn } = storeToRefs(useUserStore());

let setting = ref("");
let saving = ref("");
let creating = ref("");
const props = defineProps(["theme"]);
const loaded = ref(false);
const posts = ref<Array<Record<string, string>>>([]);

async function getPosts() {
  console.log(props.theme);
  let postResults;
  try {
    postResults = await fetchy(`/api/themes/${props.theme}`, "GET", {});
  } catch (e) {
    console.log(e);
    return;
  }
  posts.value = postResults;
}

function updateSetting(id: string) {
  setting.value = id;
}

function updateSaving(id: string) {
  saving.value = id;
}

function updateCreating(id: string) {
  creating.value = id;
}

onBeforeMount(async () => {
  await getPosts();
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <h3 class="header">{{ props.theme }}</h3>
    <section v-if="loaded && posts.length !== 0">
      <article v-for="post in posts" :key="post._id" :class="{ approved: post.status === 'Approved' }">
        <div class="overlap-container">
          <!-- Overlay that darkens the background when a form is open -->
          <div v-if="setting === post._id || saving === post._id || creating === post._id" class="overlay"></div>

          <!-- Post Component with refresh -->
          <PostComponent :post="post" @refreshPosts="getPosts" @setTheme="updateSetting" @savePost="updateSaving" @createEvent="updateCreating" />

          <!-- Set Theme Form -->
          <SetThemeForm v-if="setting == post._id" :post="post" @refreshPosts="getPosts" @setTheme="updateSetting" class="overlay-form" />

          <!-- Save Post Form -->
          <SavePostForm v-if="saving == post._id" :post="post" @refreshPosts="getPosts" @savePost="updateSaving" class="overlay-form" />

          <!-- Create Event Form -->
          <CreateEventForm v-if="creating == post._id" :post="post" @refreshPosts="getPosts" @createEvent="updateCreating" class="overlay-form" />
        </div>
      </article>
    </section>

    <!-- Message when no posts are found -->
    <p v-else-if="loaded">No Posts found</p>

    <!-- Loading message -->
    <p v-else>Loading...</p>
  </section>
</template>
<style scoped>
.header {
  font-size: 30px;
  padding-top: 0.3em;
  padding-bottom: 0.3em;
  background-color: var(--blue);
  color: white;
}
.overlap-container {
  position: relative; /* Set this to relative to contain absolutely positioned elements */
  overflow: hidden;
}

.approved {
  border-color: var(--green);
}
</style>
