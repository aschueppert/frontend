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
  } catch (e) {
    console.log(e);
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
  <section class="images-grid" v-if="loaded && images.length !== 0">
    <article v-for="image in images" :key="image._id" class="image-item">
      <ImageComponent :image="image" />
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
p {
  margin: 0 auto;
  max-width: 60em;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1em;
  padding: 1em;
}

.image-item {
  background-color: var(--base-bg);
  border-radius: 1em;
  padding: 1em;
  border: 3px solid var(--base-border);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
