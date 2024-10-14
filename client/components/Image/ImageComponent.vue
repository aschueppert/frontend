<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps(["image"]);
console.log(props.image.url);
</script>

<template>
  <p>Name: {{ props.image.name }}</p>
  <img :src="props.image.url" alt="image" class="square-image" />
</template>

<style scoped>
p {
  margin: 0em;
}
.square-image {
  width: 100px;
  height: 100px;
  object-fit: cover; /* Ensures the image fills the square without distortion */
}
</style>
