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
  <div class="page">
    <p class="members">Members: {{ props.draft.members.join(", ") }} <button class="btn-small pure-button" @click="emit('addMember', props.draft._id)">+</button></p>

    <!-- Content-->
    <div class="image-container">
      <p v-for="(item, index) in props.draft.contentSet" :key="index">
        <button class="btn-small pure-button" :class="{ selected: props.draft.selectedSet.includes(item) }">
          <img class="square-image" :src="item" alt="Image description" />
        </button>
      </p>
      <p><button class="btn-small pure-button" id="add" @click="emit('addContent', props.draft._id)">+</button></p>
    </div>

    <!-- Edit-->
    <menu v-if="props.draft.members.map(String).includes(String(currentUsername))" class="button-menu">
      <li><button class="btn-small pure-button item" @click="emit('selectContent', props.draft._id)">Select Content</button></li>
      <li><button class="btn-small pure-button item" @click="convertDraft">Post</button></li>
      <li><button class="button-error btn-small pure-button item" @click="deleteDraft">Delete</button></li>
    </menu>
    <article class="timestamp">
      <p v-if="props.draft.dateCreated !== props.draft.dateUpdated">{{ formatDate(props.draft.dateUpdated) }}</p>
      <p v-else>{{ formatDate(props.draft.dateCreated) }}</p>
    </article>
  </div>
</template>
<style scoped>
p {
  gap: 0em;
}

.members {
  font-weight: bold;
  font-size: 1.2em;
}

.page {
  padding: 0.5em;
}
menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 0.5em; /* Reduced gap between buttons */
}

#add {
  height: 113px; /* Match this with image button size */
  width: 100px; /* Match this with image button size */
  font-size: 60px; /* You might want to adjust this for better fit */
  align-items: center;
  object-fit: cover;
}

.image-container {
  margin-bottom: 1em;
}

.base {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1em;
}
</style>
