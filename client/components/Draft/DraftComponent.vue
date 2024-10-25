<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { defineEmits, defineProps, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["draft"]);
const emit = defineEmits(["addMember", "addContent", "selectContent", "convertDraft", "refreshDrafts"]);
const { currentUsername } = storeToRefs(useUserStore());
const comment = ref("");
const editingComment = ref(false); // Track if the comment is being edited

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

const addComment = async () => {
  if (comment.value.trim() === "") return; // Avoid empty comments
  try {
    await fetchy(`/api/drafts/comment/${props.draft._id}`, "PATCH", { body: { id: props.draft._id, comment: comment.value } });
    comment.value = ""; // Clear the comment after adding
    editingComment.value = false; // Stop editing
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

// Handle key press event for the comment input
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    addComment();
  }
};
</script>

<template>
  <!-- Member -->
  <main>
    <div class="members">
      <p>Members:</p>
      <p v-for="(member, index) in props.draft.members" :key="index">
        <router-link class="link" :to="{ name: 'Posts', params: { username: member } }">
          {{ member }}
        </router-link>
      </p>
      <button class="btn-small pure-button add-member" @click="emit('addMember', props.draft._id)">+</button>
    </div>

    <!-- Content -->
    <div class="center-container">
      <div class="image-container">
        <p v-for="(item, index) in props.draft.contentSet" :key="index">
          <button :class="['btn-small pure-button', props.draft.selectedSet.includes(item) ? 'selected' : 'unselected']" @click="selectContent(item)">
            <img :src="item" alt="Image description" class="square-image" />
          </button>
        </p>
        <p>
          <button class="btn-small pure-button" id="add" @click="emit('addContent', props.draft._id)">+</button>
        </p>
      </div>
    </div>

    <!-- Edit Comment -->
    <div class="comment-section">
      <template v-if="editingComment">
        <input id="comment" v-model="comment" @keypress="handleKeyPress" placeholder="Add Comment" />
      </template>
      <template v-else>
        <p @click="editingComment = true">{{ props.draft.comment || "No comment yet. Click to add one." }}</p>
      </template>
    </div>

    <menu>
      <li>
        <button class="btn-small pure-button" @click="convertDraft">Post</button>
      </li>
      <li>
        <button class="button-error btn-small pure-button" @click="deleteDraft">Delete</button>
      </li>
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

.members {
  display: flex;
  align-items: center;
  gap: 0.5em; /* Space between "Members:" text and the button */
  padding-bottom: 1em;
  font-weight: bold;
  font-size: 1.2em;
  flex-wrap: wrap; /* Enable wrapping of members' names */
}

.members p {
  margin: 0;
  white-space: nowrap; /* Prevent individual names from breaking mid-word */
}

.members .link {
  overflow-wrap: break-word; /* Break long names onto the next line if necessary */
  display: inline-block;
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

.comment-section {
  margin-top: 1em; /* Spacing for the comment section */
}
.green {
  color: var(--green);
}
</style>
