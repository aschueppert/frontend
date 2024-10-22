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

onBeforeMount(async () => {
  await getEvents();
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <section v-if="loaded && events.length !== 0">
      <article v-for="event in events" :key="event._id">
        <EventComponent :event="event" @refreshEvents="getEvents" />
      </article>
    </section>
    <p v-else-if="loaded">No Events found</p>
    <p v-else>Loading...</p>
  </section>
</template>

<style scoped></style>
