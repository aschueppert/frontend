<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const content = ref("");
const emit = defineEmits(["refreshDrafts"]);

const createDraft = async (content: string) => {
  try {
    await fetchy("/api/drafts", "POST", {
      body: { content },
    });
  } catch (_) {
    return;
  }
  emit("refreshDrafts");
  emptyForm();
};

const emptyForm = () => {
  content.value = "";
};
</script>

<template>
  <form @submit.prevent="createDraft(content)">
    <label for="content">Draft Contents:</label>
    <textarea id="content" v-model="content" placeholder="Create a Draft!" required> </textarea>
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
