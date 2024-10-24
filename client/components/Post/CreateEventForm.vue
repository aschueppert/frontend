<script setup lang="ts">
import { defineEmits, defineProps, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
// Props and Emits
const props = defineProps(["post"]);
const emit = defineEmits(["refreshPosts", "createEvent"]);
let location = ref("");
const createEvent = async (location: string) => {
  try {
    await fetchy("/api/events", "POST", { body: { post_id: props.post._id, location: location } });
  } catch {
    return;
  }
  emit("refreshPosts");
};
</script>

<template>
  <main>
    <h3>Create Event:</h3>
    <input v-model="location" placeholder="Add Location" />
    <form @submit.prevent="createEvent(location)">
      <li>
        <button class="btn-small pure-button primary" type="submit" id="submit">Create</button>
      </li>
      <li><button type="button" class="btn-small pure-button" @click="emit('createEvent')">Cancel</button></li>
    </form>
  </main>
</template>

<style scoped></style>
