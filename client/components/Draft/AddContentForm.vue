<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

// Props and Emits
const props = defineProps(["draft"]);
const emit = defineEmits(["addContent", "refreshDrafts"]);

// Reactive references
const name = ref("");

// Function to add a member
const addContent = async (name: string) => {
  console.log(name);
  try {
    await fetchy(`/api/drafts/add/${props.draft._id}`, "PATCH", { body: { id: props.draft._id, name: name } });
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
    <textarea v-model="name" id="name" placeholder="Add Content" required></textarea>
    <form @submit.prevent="addContent(name)">
      <li><button class="btn-small pure-button-primary pure-button" type="submit" id="submit">Add</button></li>
      <li><button class="btn-small pure-button" @click="emit('addContent')">Cancel</button></li>
    </form>
  </main>
</template>

<style scoped></style>
