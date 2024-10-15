<script setup lang="ts">
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";
import { ref } from "vue";

// Props and Emits
const props = defineProps(["draft"]);
const emit = defineEmits(["addMember", "refreshDrafts"]);

// Reactive references
const member = ref("");

// Function to add a member
const addMember = async (member: string) => {
  console.log("adding memeber");
  try {
    console.log(member);
    await fetchy(`/api/drafts/${props.draft._id}`, "PATCH", { body: { id: props.draft._id, member: member } });
  } catch (e) {
    console.log("error");
    console.log(e);
    return;
  }
  emit("addMember");
  emit("refreshDrafts");
};
</script>

<template>
  <form @submit.prevent="addMember(member)">
    <p class="members">Members: {{ props.draft.members.join(", ") }}</p>
    <textarea v-model="member" id="member" placeholder="Add Member" required></textarea>
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
</style>
