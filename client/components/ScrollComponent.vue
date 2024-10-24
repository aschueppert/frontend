<script setup lang="ts">
import { defineProps, ref } from "vue";

const props = defineProps(["content"]);

// State to track the current image index
const currentImageIndex = ref(0);

const nextImage = () => {
  if (currentImageIndex.value < props.content.length - 1) {
    currentImageIndex.value++;
  }
};

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
};
</script>

<template>
  <div class="image-container">
    <div class="image-slider">
      <button class="nav-button prev" @click="prevImage" v-if="currentImageIndex > 0">&lt;</button>
      <img class="square-image" :src="props.content[currentImageIndex]" alt="Image description" />
      <button class="nav-button next" @click="nextImage" v-if="currentImageIndex < props.content.length - 1">&gt;</button>
    </div>
  </div>
</template>
<style scoped>
.image-container {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5em;
}

.image-slider {
  position: relative;
  width: 100%; /* Full width */
  padding-bottom: 100%; /* This maintains the square aspect ratio */
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.square-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 0.5em;
  object-fit: cover; /* Ensures the image fills the square without distortion */
  box-sizing: border-box;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5); /* Transparent background */
  color: white;
  border: none;
  padding: 0.5em;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 2;
  transition: background-color 0.3s ease;

  width: 15%; /* Set a fixed width */
  height: 15%; /* Set a fixed height */
  border-radius: 50%; /* Make it circular */
  display: flex; /* Center the content */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  text-align: center;
}

.nav-button.prev {
  left: 10px; /* Position on the left */
}

.nav-button.next {
  right: 10px; /* Position on the right */
}

.nav-button:hover {
  background-color: rgba(0, 0, 0, 0.8); /* Darken on hover */
}

.nav-button:disabled {
  cursor: not-allowed;
  opacity: 0.3;
}
</style>
