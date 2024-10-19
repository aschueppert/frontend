<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

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
      console.log(e);
      return;
    }
  } else {
    try {
      await fetchy(`/api/drafts/select/${props.draft._id}`, "PATCH", { body: { id: props.draft._id, content: content } });
    } catch (e) {
      console.log(e);
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

.content_button.selected {
  background-color: #08a4c7; /* Color for selected items */
  color: white; /* Text color for selected items */
}

.content_button.unselected {
  background-color: lightgray; /* Color for unselected items */
  color: black; /* Text color for unselected items */
}
</style>
