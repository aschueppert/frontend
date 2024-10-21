<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import EventComponent from "./EventComponent.vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let events = ref<Array<Record<string, string>>>([]);

async function getEvents() {
  let eventResults;
  try {
    eventResults = await fetchy("/api/events", "GET", {});
    events.value = eventResults;
  } catch (e) {
    console.log(e);
    return;
  }
}

async function rsvp() {
  try {
    await fetchy("/api/events/rsvp", "POST", {});
  } catch (e) {
    console.log(e);
    return;
  }
}
onBeforeMount(async () => {
  await getEvents();
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <h2>Drafts:</h2>
  </section>

  <section v-if="loaded && events.length !== 0">
    <article v-for="event in events" :key="event._id">
      <EventComponent :event="event" />
    </article>
  </section>

  <!-- Message when no drafts are found -->
  <section v-else-if="loaded">No Events found</section>

  <!-- Loading message -->
  <section v-else>Loading...</section>
</template>

<style scoped>
article {
  position: relative;
  background-color: var(--base-bg);
  border: 3px solid var(--base-border);
  border-radius: 1em;
  margin: 1em;
  display: flex;
  flex-direction: column;
}
</style>
