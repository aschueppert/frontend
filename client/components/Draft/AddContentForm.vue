<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

// Props and Emits
const props = defineProps(["draft"]);
const emit = defineEmits(["addContent", "refreshDrafts"]);

// Reactive references
const url = ref("");

// Function to add a member
const addContent = async (url: string) => {
  try {
    await fetchy(`/api/drafts/add/${props.draft._id}`, "PATCH", { body: { id: props.draft._id, url: url } });
  } catch (e) {
    console.log(e);
    return;
  }
  emit("addContent");
  emit("refreshDrafts");
};
</script>

<template>
  <main>
    <h3>Add Content:</h3>
    <input v-model="url" id="url" placeholder="Add image URL" required />
    <form @submit.prevent="addContent(url)">
      <li><button class="btn-small pure-button primary pure-button" type="submit" id="submit">Add</button></li>
      <li><button class="btn-small pure-button" @click="emit('addContent')">Cancel</button></li>
    </form>
  </main>
</template>

<style scoped></style>
