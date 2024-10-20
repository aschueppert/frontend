<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { defineEmits, defineProps, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["post"]);
const emit = defineEmits(["refreshPosts", "setTheme", "savePost"]);
const { currentUsername } = storeToRefs(useUserStore());

// State to track the current image index
const currentImageIndex = ref(0);
const deletePost = async () => {
  try {
    await fetchy(`/api/posts/delete/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts");
};

const approvePost = async () => {
  try {
    await fetchy(`/api/posts/approve/${props.post._id}`, "PATCH", { body: { id: props.post._id } });
  } catch {
    return;
  }
  emit("refreshPosts");
};

// Functions to navigate between images
const nextImage = () => {
  if (currentImageIndex.value < props.post.content.length - 1) {
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
  <div class="base">
    <div class="members-block">
      Members:&nbsp;
      <p class="members" v-for="(item, index) in props.post.approvers" :key="index" :style="{ color: props.post.approved.includes(item) ? 'green' : 'inherit' }">
        {{ item }}<span v-if="index < props.post.approvers.length - 1">,</span>
      </p>
    </div>
    <h4>Theme: {{ props.post.theme }}</h4>

    <div class="image-container">
      <div class="image-slider">
        <!-- Add smaller, transparent overlay buttons -->
        <button class="nav-button prev" @click="prevImage" v-if="currentImageIndex > 0">&lt;</button>
        <!-- Show current image -->
        <img class="square-image" :src="props.post.content[currentImageIndex]" alt="Image description" />
        <button class="nav-button next" @click="nextImage" v-if="currentImageIndex < props.post.content.length - 1">&gt;</button>
      </div>
    </div>

    <div class="buttons">
      <article v-if="props.post.approvers.map(String).includes(String(currentUsername))" class="button-menu">
        <!-- Group for the first two buttons (left) -->
        <div class="button-group-left">
          <button v-if="!props.post.approved.map(String).includes(String(currentUsername))" class="btn-small pure-button green" @click="approvePost">
            <i class="fas fa-check"></i>
          </button>
          <button class="button-error btn-small pure-button" @click="deletePost">
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <!-- Group for the second two buttons (right) -->
        <div class="button-group-right">
          <button class="btn-small pure-button" @click="emit('setTheme', props.post._id)">
            <i class="fas fa-palette"></i>
          </button>
          <button class="btn-small pure-button" @click="emit('savePost', props.post._id)">
            <i class="fas fa-bookmark"></i>
          </button>
        </div>
      </article>
    </div>

    <article class="timestamp">
      <p v-if="props.post.dateCreated !== props.post.dateUpdated">{{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else>{{ formatDate(props.post.dateCreated) }}</p>
    </article>
  </div>
</template>
<style scoped>
.base {
  padding: 5%;
}

p {
  padding: 0em;
}

.members-block {
  display: flex;
  flex-wrap: wrap;
  font-weight: bold;
  font-size: 1.2em;
}

.members {
  display: inline-block;
  margin-right: 5px;
}

h4 {
  margin-bottom: 1em;
}

.image-container {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
  border-radius: 1em;
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

  width: 50px; /* Set a fixed width */
  height: 50px; /* Set a fixed height */
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

.button-menu {
  display: flex;
  justify-content: space-between; /* Ensures space between button groups */
  width: 100%; /* Make sure the button container spans the full width */
}
.buttons {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5em;
  margin-top: 5%;
  font-size: 1.5em;
}

.button-group-left,
.button-group-right {
  display: flex;
  gap: 0.3em; /* Add some space between the buttons */
}

.button-group-left {
  justify-content: flex-start; /* Aligns the first group to the left */
}

.button-group-right {
  justify-content: flex-end; /* Aligns the second group to the right */
  margin-left: auto; /* Pushes the right group to the right side */
}
article {
  gap: 5%;
}

i {
  margin: 0; /* Remove margins around the icon */
  padding: 0;
  gap: 0;
}
</style>
