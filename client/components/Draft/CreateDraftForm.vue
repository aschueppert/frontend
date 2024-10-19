<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const name = ref("");
const emit = defineEmits(["refreshDrafts"]);

const createDraft = async (name: string) => {
  try {
    await fetchy("/api/drafts", "POST", {
      body: { name },
    });
  } catch (e) {
    console.log(e);
    return;
  }
  emit("refreshDrafts");
  emptyForm();
};

const emptyForm = () => {
  name.value = "";
};
</script>

<template>
  <form @submit.prevent="createDraft(name)">
    <label for="name">Draft Contents:</label>
    <textarea id="name" v-model="name" placeholder="Create a Draft!" required> </textarea>
    <button type="submit" class="btn-small pure-button" id="submit">Create Draft</button>
  </form>
</template>

<style scoped></style>
