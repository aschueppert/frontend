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
  url.value = "";
  name.value = "";
};
</script>

<template>
  <input id="url" v-model="url" placeholder="Image URL" required />
  <input id="name" v-model="name" placeholder="Image Name" required />
  <form @submit.prevent="createImage(url, name)">
    <button type="submit" class="pure-button-primary pure-button" id="submit">Create Image</button>
  </form>
</template>

<style scoped></style>
