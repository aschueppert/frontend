<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";
import { defineProps, defineEmits } from "vue";

const props = defineProps(["post"]);
const emit = defineEmits(["refreshPosts", "setTheme"]);
const { currentUsername } = storeToRefs(useUserStore());

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
</script>

<template>
  <div class="members-block">
    Members:&nbsp;
    <p class="members" v-for="(item, index) in props.post.approvers" :key="index" :style="{ color: props.post.approved.includes(item) ? 'green' : 'inherit' }">
      {{ item }}<span v-if="index < props.post.approvers.length - 1">,</span>
    </p>
  </div>
  <p>Theme: {{ props.post.theme }}</p>
  <div class="content">
    <li v-for="(item, index) in props.post.content" :key="index">
      <button class="content_button">
        {{ item }}
      </button>
    </li>
  </div>
  <div class="base">
    <menu v-if="props.post.approvers.map(String).includes(String(currentUsername))">
      <li><button v-if="!props.post.approved.map(String).includes(String(currentUsername))" class="btn-small pure-button" @click="approvePost">Approve</button></li>
      <li><button class="btn-small pure-button" @click="emit('setTheme', props.post._id)">Set Theme</button></li>
      <li><button class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
    </menu>
    <article class="timestamp">
      <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
    </article>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.members-block {
  display: flex; /* Makes the children (members) align side by side */
  flex-wrap: wrap;
  font-weight: bold;
  font-size: 1.2em;
  margin-right: 5px;
}
.members {
  display: inline-block;
  margin-right: 5px;
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

.contents {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
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
</style>
