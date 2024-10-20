<script setup lang="ts">
import AddContentForm from "@/components/Draft/AddContentForm.vue";
import AddMemberForm from "@/components/Draft/AddMemberForm.vue";
import CreateDraftForm from "@/components/Draft/CreateDraftForm.vue";
import DraftComponent from "@/components/Draft/DraftComponent.vue";
import SelectContentForm from "@/components/Draft/SelectContentForm.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let drafts = ref<Array<Record<string, string>>>([]);
let adding = ref("");
let selecting = ref("");
let addingContent = ref("");

async function getDrafts() {
  let draftResults;
  try {
    draftResults = await fetchy("/api/drafts", "GET", {});
    drafts.value = draftResults;
  } catch (e) {
    console.log(e);
    return;
  }
}

function updateAdding(id: string) {
  adding.value = id;
}

function updateSelecting(id: string) {
  selecting.value = id;
}

function updateAddingContent(id: string) {
  addingContent.value = id;
}
onBeforeMount(async () => {
  await getDrafts();
  loaded.value = true;
});
</script>

<template>
  <!-- Section for logged-in users to create a draft -->
  <section v-if="isLoggedIn">
    <h2>Create a Draft:</h2>
    <CreateDraftForm @refreshDrafts="getDrafts" />
    <h2>Drafts:</h2>
  </section>

  <!-- Section displaying the list of drafts -->

  <section v-if="loaded && drafts.length !== 0">
    <div class="overlap-container">
      <article v-for="draft in drafts" :key="draft._id">
        <!-- Show DraftComponent if not adding/selecting the draft -->
        <div v-if="adding === draft._id" class="overlay"></div>
        <DraftComponent :draft="draft" @refreshDrafts="getDrafts" @addMember="updateAdding" @selectContent="updateSelecting" @addContent="updateAddingContent" class="drafts" />
        <!-- Show AddContentForm if adding content -->
        <AddContentForm v-if="addingContent === draft._id" :draft="draft" @refreshDrafts="getDrafts" @addContent="updateAddingContent" />
        <AddMemberForm v-else-if="adding === draft._id" :draft="draft" @refreshDrafts="getDrafts" @addMember="updateAdding" class="overlay-form" />
        <!-- Show SelectContentForm if selecting this draft for content selection -->
        <SelectContentForm v-else-if="selecting === draft._id" :draft="draft" @refreshDrafts="getDrafts" @selectContent="updateSelecting" />
      </article>
    </div>
  </section>

  <!-- Message when no drafts are found -->
  <section v-else-if="loaded">No drafts found</section>

  <!-- Loading message -->
  <section v-else>Loading...</section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding-left: 1em; /* Add left padding to the section */
  padding-right: 1em; /* Add right padding for symmetry */
}
.overlap-container {
  position: relative; /* Set this to relative to contain absolutely positioned elements */
  overflow: hidden;
}

.overlay-form {
  position: absolute; /* Position relative to the nearest positioned ancestor */
  bottom: 0; /* Align at the bottom */
  z-index: 10; /* Ensure it appears above other content */
  height: 60%;
  width: 100%;
  background-color: white; /* Background for visibility */
  padding: 1em;
  border-radius: 1em;
}
section,
p {
  margin: 0 auto;
}
.overlay {
  position: absolute; /* Position absolute to cover the article */
  top: 0; /* Align to the top */
  left: 0; /* Align to the left */
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  background-color: rgba(128, 128, 128, 0.5); /* Translucent grey */
  border-radius: 1em;
  z-index: 5; /* Position below the overlay form but above other content */
}
article {
  position: relative; /* Add relative positioning to the article */
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  border: 3px solid var(--base-border);
}

.drafts {
  padding: 1em;
}
</style>
