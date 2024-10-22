<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

// Props and Emits
const props = defineProps(["post"]);
const emit = defineEmits(["savePost", "refreshPosts"]);

// Reactive references
const selectedName = ref(""); // Reactive reference for the selected user
let saveNames = ref<Array<{ name: string }>>([]); // Ensure saveNames contains objects with "name" property
const searchTerm = ref("");

// Fetch saved group names
const getSaveNames = async () => {
  let response;
  try {
    response = await fetchy(`/api/save/names`, "GET", {});
    saveNames.value = response;
  } catch (e) {
    console.log(e);
    return;
  }
  emit("refreshPosts");
};

// Function to select a user
const selectName = (name: string) => {
  selectedName.value = name; // Set the selected user
};

// Save the selected post with the given name
const savePost = async (name: string) => {
  try {
    await fetchy(`/api/save`, "PATCH", { body: { _id: props.post._id, name: name } });
  } catch {
    return;
  }
  emit("savePost");
  emit("refreshPosts");
};

// Cancel the selection
const cancelSelection = () => {
  selectedName.value = ""; // Clear the selected user
  searchTerm.value = ""; // Clear the search term
  emit("savePost");
  emit("refreshPosts");
};

// Computed filtered list of users based on search term
const filteredNames = computed(() => {
  return saveNames.value.filter(
    (name) => name && name.toString().toLowerCase().includes(searchTerm.value.toLowerCase()), // Ensure username is defined
  );
});

onMounted(async () => {
  await getSaveNames();
});
</script>

<template>
  <main>
    <h3>Save Names</h3>
    <input v-model="searchTerm" id="name" placeholder="Search available saved group names" />
    <ul v-if="filteredNames.length > 0" class="item-list">
      <button v-for="name in filteredNames.slice(0, 6)" :key="name.name" class="btn-small pure-button" :class="{ selected: selectedName === name.toString() }" @click="selectName(name.toString())">
        {{ name }}
      </button>
    </ul>
    <form @submit.prevent="savePost(selectedName)">
      <li><button class="btn-small pure-button primary" type="submit" :disabled="!selectedName">Save</button></li>
      <li><button type="button" class="btn-small pure-button" @click="cancelSelection">Cancel</button></li>
    </form>
  </main>
</template>

<style scoped></style>
