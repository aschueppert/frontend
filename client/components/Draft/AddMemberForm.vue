<script setup lang="ts">
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";
import { ref } from "vue";

// Props and Emits
const props = defineProps(["draft"]);
const emit = defineEmits(["addMember", "refreshDrafts"]);

// Reactive references
const username = ref("");

// Function to add a member
const addMember = async (username) => {
  try {
    await fetchy(`/api/drafts/${props.draft._id}`, "PATCH", { body: { id: props.draft._id, member: username.value } });
  } catch (e) {
    return;
  }
  emit("addMember", username.value);
  emit("refreshDrafts");
};
</script>

<template>
  <form @submit.prevent="addMember">
    <p class="members">Members: {{ props.draft.members.join(", ") }}</p>
    <textarea v-model="username" id="username" placeholder="Add Member" required></textarea>
    <div class="base">
      <menu>
        <li><button class="btn-small pure-button-primary pure-button" type="submit">Add</button></li>
        <li><button class="btn-small pure-button" @click="emit('addMember')">Cancel</button></li>
      </menu>
      <p v-if="props.draft.dateCreated !== props.draft.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.draft.dateUpdated) }}</p>
      <p v-else class="timestamp">Created on: {{ formatDate(props.draft.dateCreated) }}</p>
    </div>
  </form>
</template>

<style scoped>
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

.members {
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
</style>
