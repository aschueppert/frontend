<script setup lang="ts">
import CreateImageForm from "@/components/Image/CreateImageForm.vue";
import ImageComponent from "@/components/Image/ImageComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
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
    <h2>Images:</h2>
  </section>

  <!-- Section displaying images in a grid -->
  <section class="images-grid" v-if="loaded && images.length !== 0">
    <div v-for="(image, index) in images" :key="index" class="image-item">
      <ImageComponent :image="image" />
    </div>
  </section>

  <!-- Message when no images are found -->
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
  grid-template-columns: repeat(2, 1fr);
  gap: 1em;
  padding: 1em;
}

.image-item {
  display: flex;
  flex-direction: column; /* Stack images vertically */
  align-items: center; /* Center items horizontally */
}
</style>
