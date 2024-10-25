<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { defineEmits, defineProps } from "vue";
import ScrollComponent from "../ScrollComponent.vue";
const props = defineProps(["post"]);
const emit = defineEmits(["refreshPosts", "setTheme", "savePost", "createEvent"]);
const { currentUsername } = storeToRefs(useUserStore());
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
