<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { defineEmits, defineProps, onMounted, ref } from "vue";
import ScrollComponent from "../ScrollComponent.vue";
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
  <main>
    <div class="image-container">
      <div v-for="item_id in props.save.items" :key="item_id" class="post-item">
        <div v-if="items[item_id] !== undefined">
          <ScrollComponent :content="items[item_id].content" />
        </div>
        <div v-else>Loading...</div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.post-item {
  flex: 0 1 calc(50% - 1em); /* Flex-grow: 0; Flex-shrink: 1; Flex-basis: 50% minus gap */
}

.header {
  font-size: 30px;
  padding-top: 0.3em;
  padding-bottom: 0.3em;
  background-color: var(--blue);
  color: white;
}
</style>
