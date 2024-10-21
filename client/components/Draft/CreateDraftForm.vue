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
  <textarea id="name" v-model="name" placeholder="Create a Draft!" required> </textarea>
  <form @submit.prevent="createDraft(name)">
    <button type="submit" class="btn-small pure-button primary">Create</button>
  </form>
</template>

<style scoped>
form {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
  width: 100%;
}
</style>
