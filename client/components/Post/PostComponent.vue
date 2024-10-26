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
      <p class="members" v-for="(item, index) in props.post.approvers" :key="index">
        <router-link class="link" :style="{ color: props.post.approved.toString().includes(item.toString()) ? 'green' : 'inherit' }" :to="{ name: 'Posts', params: { username: item } }">
          {{ item }}
        </router-link>
      </p>
    </div>
    <p>
      Theme: <router-link class="link" :to="{ name: 'Theme', params: { themeName: props.post.theme } }"> {{ props.post.theme }} </router-link>
    </p>
    <p v-if="props.post.status === 'Not Approved'">Status: {{ props.post.status }}</p>
    <p class="small-note" v-if="props.post.status === 'Not Approved'">Note: All members needs to approve post for it to be viewable by others</p>

    <ScrollComponent :content="props.post.content" />
    <p>{{ props.post.comment }}</p>
    <menu class="separate">
      <menu v-if="props.post.approvers.map(String).includes(String(currentUsername))">
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

i {
  font-size: 2em;
}
</style>
