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
  emit("refreshDrafts");
};
</script>
<template>
  <!-- Memeber-->
  <main>
    <div class="members-row">
      <p class="members">Members: {{ props.draft.members.join(", ") }}</p>
      <button class="btn-small pure-button add-member" @click="emit('addMember', props.draft._id)">+</button>
    </div>

    <!-- Content-->
    <div class="image-container">
      <p v-for="(item, index) in props.draft.contentSet" :key="index">
        <button :class="['btn-small pure-button', props.draft.selectedSet.includes(item) ? 'selected' : 'unselected']" @click="selectContent(item)">
          <img :src="item" alt="Image description" class="square-image" />
        </button>
      </p>
      <p><button class="btn-small pure-button" id="add" @click="emit('addContent', props.draft._id)">+</button></p>
    </div>

    <!-- Edit-->
    <menu class="button-menu">
      <li><button class="btn-small pure-button item" @click="convertDraft">Post</button></li>
      <li><button class="button-error btn-small pure-button item" @click="deleteDraft">Delete</button></li>
    </menu>
    <div class="timestamp">
      <p v-if="props.draft.dateCreated !== props.draft.dateUpdated">{{ formatDate(props.draft.dateUpdated) }}</p>
      <p v-else>{{ formatDate(props.draft.dateCreated) }}</p>
    </div>
  </main>
</template>
<style scoped>
p {
  gap: 0em;
}

.members-row {
  display: flex;
  align-items: center;
  gap: 0.5em; /* Small gap between text and button */
  padding-bottom: 1em;
}

.members {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 0.5em; /* Reduced gap between buttons */
}

#add {
  height: 120px; /* Match this with image button size */
  width: 120px; /* Match this with image button size */
  font-size: 60px; /* You might want to adjust this for better fit */
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-member {
  width: 5em;
  height: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
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
