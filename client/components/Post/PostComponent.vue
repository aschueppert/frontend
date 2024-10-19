<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { defineEmits, defineProps, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["post"]);
const emit = defineEmits(["refreshPosts", "setTheme"]);
const { currentUsername } = storeToRefs(useUserStore());

// State to track the current image index
const currentImageIndex = ref(0);
const saveNames = ref<string[]>([]);
const selectedName = ref<string | null>(null); // Initialize selectedName
const showDropdown = ref(false); // Control dropdown visibility
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

const savePost = async () => {
  try {
    await fetchy(`/api/save`, "PATCH", { body: { _id: props.post._id, name: selectedName.value } });
  } catch {
    return;
  }
  emit("refreshPosts");
};
const getSaveNames = async () => {
  let response;
  try {
    response = await fetchy(`/api/save/names`, "GET", {});
    saveNames.value = response;
  } catch {
    return;
  }
  emit("refreshPosts");
};

getSaveNames();
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
  <div class="members-block">
    Members:&nbsp;
    <p class="members" v-for="(item, index) in props.post.approvers" :key="index" :style="{ color: props.post.approved.includes(item) ? 'green' : 'inherit' }">
      {{ item }}<span v-if="index < props.post.approvers.length - 1">,</span>
    </p>
  </div>

  <p>Theme: {{ props.post.theme }}</p>

  <div class="image-container">
    <div class="image-slider">
      <!-- Add smaller, transparent overlay buttons -->
      <button class="nav-button prev" @click="prevImage" v-if="currentImageIndex > 0">&lt;</button>
      <!-- Show current image -->
      <img class="square-image" :src="props.post.content[currentImageIndex]" alt="Image description" />
      <button class="nav-button next" @click="nextImage" v-if="currentImageIndex < props.post.content.length - 1">&gt;</button>
    </div>
  </div>

  <div class="base">
    <article v-if="props.post.approvers.map(String).includes(String(currentUsername))" class="button-menu">
      <button v-if="!props.post.approved.map(String).includes(String(currentUsername))" class="btn-small pure-button" @click="approvePost">Approve</button>
      <button class="btn-small pure-button" @click="emit('setTheme', props.post._id)">Set Theme</button>
      <button class="button-error btn-small pure-button" @click="deletePost">Delete</button>
    </article>

    <div>
      <button class="btn-small pure-button" @click="showDropdown = !showDropdown"><i class="fas fa-bookmark"></i></button>
      <!-- Toggle dropdown visibility -->
      <div v-if="showDropdown">
        <select v-model="selectedName" @change="savePost">
          <option disabled value="">Select a save label</option>
          <option v-for="(name, index) in saveNames" :key="index" :value="name">{{ name }}</option>
        </select>
      </div>
    </div>
    <article class="timestamp">
      <p v-if="props.post.dateCreated !== props.post.dateUpdated">{{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else>{{ formatDate(props.post.dateCreated) }}</p>
    </article>
  </div>
</template>
<style scoped>
p {
  margin: 0em;
}

.members-block {
  display: flex;
  flex-wrap: wrap;
  font-weight: bold;
  font-size: 1.2em;
  margin-right: 5px;
}

.members {
  display: inline-block;
  margin-right: 5px;
}

.image-container {
  position: relative;
  width: 100%;
  max-width: 600px; /* Adjust max-width as needed */
  margin: 0 auto; /* Center the image container */
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
  flex-direction: row;
  gap: 0.3em;
  align-items: flex-start;
}

.base {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5em;
}

article {
  gap: 1em;
}
</style>
