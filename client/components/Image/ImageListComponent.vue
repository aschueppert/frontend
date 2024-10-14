<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import CreateImageForm from "@/components/Image/CreateImageForm.vue";
import ImageComponent from "@/components/Image/ImageComponent.vue";
const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let images = ref<Array<Record<string, string>>>([]);

async function getImages() {
  let imageResults;
  try {
    imageResults = await fetchy("/api/images", "GET", {});
  } catch (_) {
    return;
  }
  images.value = imageResults;
}

onBeforeMount(async () => {
  await getImages();
  loaded.value = true;
});
</script>

<template>
  <!-- Section for logged-in users to create a draft -->
  <section v-if="isLoggedIn">
    <h2>Add Image:</h2>
    <CreateImageForm @refreshImages="getImages" />
  </section>

  <!-- Section displaying the list of drafts -->
  <section class="images" v-if="loaded && images.length !== 0">
    <article v-for="image in images" :key="image._id">
      <ImageComponent :image="image" @refreshImages="getImages" />
    </article>
  </section>

  <!-- Message when no drafts are found -->
  <p v-else-if="loaded">No images found</p>

  <!-- Loading message -->
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  border: 3px solid var(--base-border);
  padding: 1em;
}

.images {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
