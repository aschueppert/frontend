<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { defineEmits, defineProps } from "vue";
import { fetchy } from "../../utils/fetchy";

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
  <p class="members">Members: {{ props.draft.members.join(", ") }} <button class="btn-small pure-button" @click="emit('addMember', props.draft._id)">+</button></p>

  <!-- Content-->
  <div class="image-container">
    <p v-for="(item, index) in props.draft.contentSet" :key="index">
      <button :class="['content_button', props.draft.selectedSet.includes(item) ? 'selected' : 'unselected']">
        <img class="square-image" :src="item" alt="Image description" />
      </button>
    </p>
    <p><button class="content_button" id="add" @click="emit('addContent', props.draft._id)">+</button></p>
  </div>

  <!-- Edit-->
  <div class="base">
    <menu v-if="props.draft.members.map(String).includes(String(currentUsername))" class="button-menu">
      <li><button class="btn-small pure-button" @click="emit('selectContent', props.draft._id)">Select Content</button></li>
    </menu>
  </div>

  <!-- Submit-->
  <div class="base">
    <menu v-if="props.draft.members.map(String).includes(String(currentUsername))" class="button-menu">
      <li><button class="btn-small pure-button" @click="convertDraft">Post</button></li>
      <li><button class="button-error btn-small pure-button" @click="deleteDraft">Delete</button></li>
    </menu>
    <article class="timestamp">
      <p v-if="props.draft.dateCreated !== props.draft.dateUpdated">{{ formatDate(props.draft.dateUpdated) }}</p>
      <p v-else>{{ formatDate(props.draft.dateCreated) }}</p>
    </article>
  </div>
</template>
<style scoped>
p {
  margin: 0.2em 0; /* Reduced margin */
}

.members {
  font-weight: bold;
  font-size: 1.2em;
  margin-bottom: 0.5em; /* Small space between members and content */
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 0.5em; /* Reduced gap between buttons */
  padding: 0;
  margin: 0;
}

#add {
  height: 127px;
  width: 127px;
  font-size: 3em;
}

.content_button.selected {
  background-color: #08a4c7; /* Color for selected items */
  color: white; /* Text color for selected items */
}

.content_button.unselected {
  background-color: lightgray; /* Color for unselected items */
  color: black; /* Text color for unselected items */
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
  margin-bottom: 0.2em; /* Reduced margin */
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 0.5em;
}

.base {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.1em;
}

.button-menu {
  display: flex;
  flex-direction: row;
  gap: 0.1em;
}

.timestamp {
  gap: 0.1em; /* Reduced space between buttons and timestamp */
}

.base article {
  margin-left: 0;
}
</style>
