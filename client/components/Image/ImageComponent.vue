<script setup lang="ts">
import { defineProps } from "vue";
const props = defineProps(["image"]);
console.log(props.image.url);
</script>

<template>
  <h3>{{ props.image.name }}</h3>
  <img :src="props.image.url" alt="image" class="square-image" />
</template>

<style scoped></style>
