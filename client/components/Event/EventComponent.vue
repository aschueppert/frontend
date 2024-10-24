<script setup lang="ts">
import { defineEmits, defineProps, onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import ScrollComponent from "../ScrollComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
const props = defineProps(["event"]);
const emit = defineEmits(["refreshEvents"]);

const { currentUsername } = storeToRefs(useUserStore());

let post = ref({ content: [] }); // Initialize post with a default structure

const rsvp = async () => {
  try {
    await fetchy(`/api/events/rsvp/${props.event._id}`, "PATCH", { body: { event_id: props.event._id } });
  } catch (e) {
    return;
  }
  emit("refreshEvents");
};

const getPost = async () => {
  try {
    const response = await fetchy(`/api/post/${props.event.info}`, "GET");
    return response;
  } catch (e) {
    return;
  }
};

onBeforeMount(async () => {
  post.value = await getPost();
});
</script>

<template>
  <main>
    <p>Hosts: {{ props.event.hosts.join(", ") }}</p>
    <p>Attendees: {{ props.event.attendees.join(", ") }}</p>
    <p>Location: {{ props.event.location }}</p>
    <ScrollComponent :content="post.content" />
    <menu><button v-if="!props.event.attendees.toString().includes(currentUsername.toString())" class="btn-small pure-button primary" @click="rsvp">RSVP Yes</button></menu>
  </main>
</template>

<style scoped>
p {
  margin-bottom: 0.2em;
}
</style>
