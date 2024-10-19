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
const currentImageIndex = ref(0); // Track the current image index

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

function nextImage() {
  if (currentImageIndex.value < images.value.length - 1) {
    currentImageIndex.value++;
  }
}

function prevImage() {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
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

  <!-- Section displaying the slider -->
  <section class="image-slider" v-if="loaded && images.length !== 0">
    <ImageComponent :image="images[currentImageIndex]" />

    <!-- Navigation buttons for previous and next -->
    <div class="slider-controls">
      <button @click="prevImage" :disabled="currentImageIndex === 0"><</button>
      <button @click="nextImage" :disabled="currentImageIndex === images.length - 1">></button>
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

.image-slider {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.slider-controls {
  display: flex;
  justify-content: center;
  width: 30px;
  margin-top: 1em;
}

button {
  padding: 0.5em 1em;
  font-size: 1rem;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

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
