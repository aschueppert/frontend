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
    await fetchy(`/follows/${props.follow.following}`, "DELETE");
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
  width: 100%; /* Or adjust the width as needed */
  padding: 0.5em; /* Add padding for spacing */
  box-sizing: border-box; /* Include padding and border in width calculation */
}
.following {
  font-weight: bold;
  font-size: 1.2em;
}

button {
  white-space: nowrap; /* Prevent button text from wrapping */
  padding: 0.5em 1em; /* Ensure the button has proper padding */
  font-size: 1em;
}
</style>
