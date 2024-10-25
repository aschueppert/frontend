<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import PostComponentNoButtons from "../Post/PostComponentNoButtons.vue";
let setting = ref("");
let saving = ref("");
const loaded = ref(false);
const props = defineProps(["name"]);
let save = ref<Array<Record<string, string>>>([]);
const items = ref<{ [key: string]: any }>({});
const emit = defineEmits(["refreshPosts", "getThemePosts"]);

async function getSaveItems() {
  console.log(props.name);
  let itemResults;
  try {
    itemResults = await fetchy(`/api/saved/${props.name}`, "GET", {});
  } catch (e) {
    console.log(e);
    return;
  }
  console.log(itemResults.items);
  save.value = itemResults.items;
}
async function getItem(item_id: string) {
  console.log(item_id);
  try {
    const item = await fetchy(`/api/post/${item_id}`, "GET", {});
    console.log(item);
    return item;
  } catch (e) {
    console.error(`Failed to fetch item ${item_id}:`, e);
    return null;
  }
}

onBeforeMount(async () => {
  await getSaveItems();
  console.log(save.value);
  for (let item of save.value) {
    let item_id = item.toString();
    // Fetch the item and store it in the reactive items object
    items.value[item_id] = await getItem(item_id);
  }
  loaded.value = true;
});
</script>

<template>
  <h3 class="header">Save: {{ props.name }}</h3>
  <section v-if="loaded && items.length !== 0">
    <article v-for="item in items" :key="item._id">
      <PostComponentNoButtons :post="item" @refreshPosts="getSaveItems" />
    </article>
  </section>

  <!-- Message when no posts are found -->
  <p v-else-if="loaded">No posts yet. Make your own!</p>

  <!-- Loading message -->
  <p v-else>Loading...</p>
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
