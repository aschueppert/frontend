<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";
import { defineProps, defineEmits } from "vue";

const props = defineProps(["draft"]);
const emit = defineEmits(["addMember", "addContent", "selectContent", "convertDraft", "refreshDrafts"]);
const { currentUsername } = storeToRefs(useUserStore());

const deleteDraft = async () => {
  try {
    await fetchy(`/api/drafts/delete/${props.draft._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshDrafts");
};

const convertDraft = async () => {
  try {
    await fetchy(`/api/posts/convert/${props.draft._id}`, "POST", { body: { draft_id: props.draft._id } });
  } catch {
    return;
  }
  emit("refreshDrafts");
};
</script>

<template>
  <!-- Memeber-->
  <p class="members">Members: {{ props.draft.members.join(", ") }}</p>

  <!-- Content-->
  <div class="image-container">
    <p v-for="(item, index) in props.draft.contentSet" :key="index">
      <button :class="['content_button', props.draft.selectedSet.includes(item) ? 'selected' : 'unselected']">
        <img class="square-image" :src="item" alt="Image description" />
      </button>
    </p>
  </div>

  <!-- Edit-->
  <div class="base">
    <menu v-if="props.draft.members.map(String).includes(String(currentUsername))">
      <li><button class="btn-small pure-button" @click="emit('addMember', props.draft._id)">Add Member</button></li>
      <li><button class="btn-small pure-button" @click="emit('addContent', props.draft._id)">Add Content</button></li>
      <li><button class="btn-small pure-button" @click="emit('selectContent', props.draft._id)">Select Content</button></li>
    </menu>
  </div>

  <!-- Submit-->
  <div class="base">
    <menu v-if="props.draft.members.map(String).includes(String(currentUsername))">
      <li><button class="btn-small pure-button" @click="convertDraft">Post</button></li>
      <li><button class="button-error btn-small pure-button" @click="deleteDraft">Delete</button></li>
    </menu>
    <article class="timestamp">
      <p v-if="props.draft.dateCreated !== props.draft.dateUpdated">Edited on: {{ formatDate(props.draft.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.draft.dateCreated) }}</p>
    </article>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.members {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
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
