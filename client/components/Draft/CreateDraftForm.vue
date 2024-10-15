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
  } catch (_) {
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
    <button type="submit" class="pure-button-primary pure-button">Create Draft</button>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}
</style>
