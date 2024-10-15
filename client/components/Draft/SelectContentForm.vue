<script setup lang="ts">
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";
import { ref } from "vue";

// Props and Emits
const props = defineProps(["draft"]);
const emit = defineEmits(["selectContent", "deselectContent", "refreshDrafts"]);

// Reactive references
const content = ref("");

// Function to select content
const selectContent = async (content: string) => {
  if (props.draft.selectedSet.includes(content)) {
    try {
      await fetchy(`/api/drafts/deselect/${props.draft._id}`, "PATCH", { body: { id: props.draft._id, content: content } });
    } catch (e) {
      return;
    }
  } else {
    try {
      await fetchy(`/api/drafts/select/${props.draft._id}`, "PATCH", { body: { id: props.draft._id, content: content } });
    } catch (e) {
      return;
    }
  }

  emit("selectContent");
  emit("refreshDrafts");
};
</script>

<template>
  <!-- Select Content Form -->
  <form @submit.prevent="selectContent(content)">
    <p class="members">Members: {{ props.draft.members.join(", ") }}</p>
    <div class="image-container">
      <p v-for="(item, index) in props.draft.contentSet" :key="index">
        <button :class="['content_button', props.draft.selectedSet.includes(item) ? 'selected' : 'unselected']" @click.prevent="selectContent(item)">
          <img :src="item" alt="Image description" class="square-image" />
        </button>
      </p>
    </div>

    <div class="base">
      <menu>
        <li><button class="btn-small pure-button" @click="emit('selectContent')">Cancel</button></li>
      </menu>
      <p v-if="props.draft.dateCreated !== props.draft.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.draft.dateUpdated) }}</p>
      <p v-else class="timestamp">Created on: {{ formatDate(props.draft.dateCreated) }}</p>
    </div>
  </form>
</template>

<style scoped>
.members {
  font-weight: bold;
  font-size: 1.2em;
}

form {
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 1.5em;
  border-radius: 4px;
  padding: 0.5;
  resize: none;
}

p {
  margin: 0em;
}

.contentSet {
  font-weight: bold;
  font-size: 1.2em;
}

.content {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}
.username {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}
menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.content_button {
  font-size: 1.2em;
  font-weight: bold;
  padding: 0.5em;
  border-radius: 4px;
  background-color: var(--base-bg);
  color: var(--base-text);
  border: 1px solid var(--base-border);
  cursor: pointer;
}

.content_button.selected {
  background-color: #08a4c7; /* Color for selected items */
  color: white; /* Text color for selected items */
}

.content_button.unselected {
  background-color: lightgray; /* Color for unselected items */
  color: black; /* Text color for unselected items */
}
.square-image {
  width: 100px;
  height: 100px;
  object-fit: cover; /* Ensures the image fills the square without distortion */
}
.image-container {
  display: flex; /* Use flexbox for layout */
  flex-wrap: wrap; /* Allow items to wrap if needed */
  gap: 10px; /* Space between images */
}
</style>
