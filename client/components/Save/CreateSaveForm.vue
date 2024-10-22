<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const name = ref("");
const emit = defineEmits(["refreshSaved"]);

const createSave = async (name: string) => {
  try {
    await fetchy("/api/save", "POST", {
      body: { name },
    });
  } catch (e) {
    console.log(e);
    return;
  }
  emit("refreshSaved");
  emptyForm();
};

const emptyForm = () => {
  name.value = "";
};
</script>

<template>
  <input id="name" v-model="name" placeholder="Create a Save Label!" required />
  <form @submit.prevent="createSave(name)">
    <button type="submit" class="btn-small pure-button primary">Create</button>
  </form>
</template>

<style scoped></style>
