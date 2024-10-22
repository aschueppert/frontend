<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { defineEmits, defineProps } from "vue";
import { fetchy } from "../../utils/fetchy";
const props = defineProps(["follow"]);
const emit = defineEmits(["refreshFollows"]);
const { currentUsername } = storeToRefs(useUserStore());

const deleteFollowing = async () => {
  try {
    await fetchy(`/api/follows/${props.follow.following}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshFollows");
};
</script>

<template>
  <div class="follow-container">
    <p class="following">{{ props.follow.following }}</p>
    <button class="button-error btn-small pure-button" @click="deleteFollowing">Unfollow</button>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}
.follow-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.5em; /* Add padding for spacing */
}
.following {
  font-weight: bold;
  font-size: 1.2em;
}
</style>
