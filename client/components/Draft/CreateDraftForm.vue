<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const url = ref("");
const emit = defineEmits(["refreshDrafts"]);

const createDraft = async (url: string) => {
  try {
    await fetchy("/api/drafts", "POST", {
      body: { url },
    });
  } catch (e) {
    console.log(e);
    return;
  }
  emit("refreshDrafts");
  emptyForm();
};

const emptyForm = () => {
  url.value = "";
};
</script>

<template>
  <input id="url" v-model="url" placeholder="Add image URL" required />
  <form @submit.prevent="createDraft(url)">
    <button type="submit" class="btn-small pure-button primary">Create</button>
  </form>
</template>

<style scoped></style>
