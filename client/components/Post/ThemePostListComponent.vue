<script setup lang="ts">
import PostComponent from "@/components/Post/PostComponent.vue";
import SavePostForm from "@/components/Post/SavePostForm.vue";
import SetThemeForm from "@/components/Post/SetThemeForm.vue";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";

let setting = ref("");
let saving = ref("");
const loaded = ref(false);
const props = defineProps(["theme"]);
let posts = ref<Array<Record<string, string>>>([]);

const emit = defineEmits(["refreshPosts", "getThemePosts"]);

async function getThemePosts() {
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
  console.log(saving);
  saving.value = id;
}

onBeforeMount(async () => {
  await getThemePosts();
  console.log(posts);
  loaded.value = true;
});
</script>

<template>
  <h3 class="header">{{ props.theme }}</h3>
  <section v-if="loaded && posts.length !== 0">
    <article v-for="post in posts" :key="post._id" :class="{ approved: post.status === 'Approved' }">
      <div class="overlap-container">
        <div v-if="setting === post._id || saving === post._id" class="overlay"></div>
        <PostComponent :post="post" @refreshPosts="getThemePosts" @setTheme="updateSetting" @savePost="updateSaving" />
        <SetThemeForm v-if="setting == post._id" :post="post" @refreshPosts="getThemePosts" @setTheme="updateSetting" class="overlay-form" />
        <SavePostForm v-if="saving == post._id" :post="post" @refreshPosts="getThemePosts" @savePost="updateSaving" class="overlay-form" />
      </div>
    </article>
  </section>

  <!-- Message when no posts are found -->
  <p v-else-if="loaded">No Posts found</p>

  <!-- Loading message -->
  <p v-else>Loading...</p>
</template>

<style scoped>
.header {
  font-size: 30px;
  padding-top: 0.3em;
  padding-bottom: 0.3em;
  background-color: var(--orange);
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
