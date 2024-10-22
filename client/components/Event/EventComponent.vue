<script setup lang="ts">
import { defineEmits, defineProps, onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import ScrollComponent from "../ScrollComponent.vue";
const props = defineProps(["event"]);
const emit = defineEmits(["refreshEvents"]);

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
    <h4>Hosts: {{ props.event.hosts.join(", ") }}</h4>
    <h4>Attendees: {{ props.event.attendees.join(", ") }}</h4>
    <h4>Location: {{ props.event.location }}</h4>
    <ScrollComponent :content="post.content" />
    <menu><button class="btn-small pure-button" @click="rsvp">RSVP</button></menu>
  </main>
</template>

<style scoped></style>
