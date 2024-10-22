<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import CreateSaveForm from "./CreateSaveForm.vue";
import SaveComponent from "./SaveComponent.vue";
const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let saved = ref<Array<Record<string, string>>>([]);

async function getSaved() {
  let saveResults;
  try {
    saveResults = await fetchy("/api/saved", "GET", {});
  } catch (e) {
    console.log(e);
    return;
  }
  saved.value = saveResults;
}

onBeforeMount(async () => {
  await getSaved();
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <h2>Create a Save Label:</h2>
    <CreateSaveForm @refreshSaved="getSaved" />
    <h2>Saved:</h2>
  </section>
  <section v-if="loaded && saved.length !== 0">
    <article v-for="save in saved" :key="save._id">
      <h3 class="header">{{ save.name }}</h3>
      <div class="items">
        <SaveComponent :save="save" @refreshSaved="getSaved" class="save-component" />
      </div>
    </article>
  </section>
  <section v-else-if="loaded">No saved posts found</section>

  <section v-else-if="loaded">No saved posts found</section>

  <!-- Loading message -->
  <section v-else>Loading...</section>
</template>

<style scoped>
.items {
  padding: 1em; /* Padding withing blue borders */
}

section,
p {
  margin: 0 auto;
}
section {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 0 1em;
}
</style>
