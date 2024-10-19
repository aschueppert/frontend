<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { defineEmits, defineProps, onMounted, ref } from "vue";
import PostComponent from "../Post/PostComponent.vue";
// Props and emits
const props = defineProps(["save"]);
const emit = defineEmits(["refreshSaved"]);

// Reactive object to store fetched items
const items = ref<{ [key: string]: any }>({});

// Function to fetch individual item data
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

// Fetch all items when the component is mounted
onMounted(async () => {
  for (const item_id of props.save.items) {
    // Fetch the item and store it in the reactive items object
    console.log(item_id);
    items.value[item_id] = await getItem(item_id);
  }
});
</script>

<template>
  <div class="base">
    <article v-for="item_id in props.save.items" :key="item_id" class="post-item">
      <div v-if="items[item_id] !== undefined" class="scale-down">
        <PostComponent :post="items[item_id]" />
      </div>
      <div v-else>Loading...</div>
    </article>
  </div>
</template>

<style scoped>
.base {
  display: flex; /* Enable Flexbox */
  flex-wrap: wrap; /* Allow items to wrap to the next line if needed */
  justify-content: flex-start; /* Align items to the start */
}

.post-item {
  margin: 5px; /* Add margin between items */
}
</style>
