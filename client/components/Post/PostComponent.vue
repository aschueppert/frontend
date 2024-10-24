<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { defineEmits, defineProps } from "vue";
import { fetchy } from "../../utils/fetchy";
import ScrollComponent from "../ScrollComponent.vue";

const props = defineProps(["post"]);
const emit = defineEmits(["refreshPosts", "setTheme", "savePost", "createEvent"]);
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
  <main>
    <div class="members-block">
      <p>Members:&nbsp;</p>
      <p class="members" v-for="(item, index) in props.post.approvers" :key="index" :style="{ color: props.post.approved.includes(item) ? 'green' : 'inherit' }">
        {{ item }}<span v-if="index < props.post.approvers.length - 1">,</span>
      </p>
    </div>
    <p>Theme: {{ props.post.theme }}</p>
    <p>Status: {{ props.post.status }}</p>
    <p class="small-note" v-if="props.post.status === 'Not Approved'">Note: All members need to approve post for it to be viewable by others</p>

    <ScrollComponent :content="props.post.content" />
    <p>{{ props.post.comment }}</p>
    <menu class="separate" v-if="props.post.approvers.map(String).includes(String(currentUsername))">
      <menu>
        <button v-if="!props.post.approved.map(String).includes(String(currentUsername))" class="btn-small pure-button green" @click="approvePost">
          <i class="fas fa-check"></i>
        </button>
        <button class="btn-small pure-button" @click="emit('createEvent', props.post._id)">
          <i class="fas fa-calendar"></i>
        </button>
        <button class="btn-small pure-button" @click="emit('setTheme', props.post._id)">
          <i class="fas fa-palette"></i>
        </button>
        <button class="button-error btn-small pure-button" @click="deletePost">
          <i class="fas fa-trash"></i>
        </button>
      </menu>

      <menu>
        <button class="btn-small pure-button" @click="emit('savePost', props.post._id)">
          <i class="fas fa-bookmark"></i>
        </button>
      </menu>
    </menu>

    <div class="timestamp">
      <p>{{ formatDate(props.post.dateUpdated !== props.post.dateCreated ? props.post.dateUpdated : props.post.dateCreated) }}</p>
    </div>
  </main>
</template>

<style scoped>
p {
  margin-bottom: 0.5em;
}
.members-block {
  display: flex;
  flex-wrap: wrap;
  font-weight: bold;
  font-size: 1.2em;
}

.members {
  margin-right: 5px;
}
.small-note {
  font-size: 0.7em;
  font-style: italic;
}
</style>
