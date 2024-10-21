<script setup lang="ts">
import { defineEmits, defineProps, onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import ScrollComponent from "../ScrollComponent.vue";
const props = defineProps(["event"]);
const emit = defineEmits(["refreshEvents"]);

let post = ref({ content: [] }); // Initialize post with a default structure

const rsvp = async () => {
  try {
    await fetchy(`/api/events/rsvp/${props.event._id}`, "POST");
  } catch (error) {
    console.error("Error in RSVP:", error);
    return;
  }
  emit("refreshEvents");
};

const getPost = async () => {
  try {
    const response = await fetchy(`/api/post/${props.event.info}`, "GET");
    return response;
  } catch (error) {
    console.error("Error fetching post:", error);
    return { content: [] }; // Return an empty structure if there's an error
  }
};

onBeforeMount(async () => {
  post.value = await getPost();
});
</script>

<template>
  <main>
    <section>
      <p>Hosts: {{ props.event.hosts.join(", ") }}</p>
      <p>Attendees: {{ props.event.attendees.join(", ") }}</p>
      <p>Location: {{ props.event.location }}</p>
    </section>
    <section>
      <ScrollComponent :content="post.content" />
    </section>

    <button @click="rsvp">RSVP</button>
  </main>
</template>

<style scoped>
main {
  padding: 5%;
}
</style>
