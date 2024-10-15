<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const url = ref("");
const name = ref("");
const emit = defineEmits(["refreshImages"]);

const createImage = async (url: string, name: string) => {
  try {
    await fetchy("/api/images", "POST", {
      body: { url: url, name: name },
    });
  } catch (e) {
    console.log(e);
    return;
  }
  emit("refreshImages");
  emptyForm();
};

const emptyForm = () => {
  content.value = "";
};
</script>

<template>
  <form @submit.prevent="createImage(url, name)">
    <textarea id="url" v-model="url" placeholder="Image URL" required> </textarea>
    <textarea id="name" v-model="name" placeholder="Image Name" required> </textarea>
    <button type="submit" class="pure-button-primary pure-button">Create Image</button>
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
  height: 3em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}
</style>
