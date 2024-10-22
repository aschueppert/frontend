<script setup lang="ts">
import AddContentForm from "@/components/Draft/AddContentForm.vue";
import AddMemberForm from "@/components/Draft/AddMemberForm.vue";
import CreateDraftForm from "@/components/Draft/CreateDraftForm.vue";
import DraftComponent from "@/components/Draft/DraftComponent.vue";
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
        <div v-if="adding === draft._id || addingContent === draft._id" class="overlay"></div>
        <DraftComponent :draft="draft" @refreshDrafts="getDrafts" @addMember="updateAdding" @selectContent="updateSelecting" @addContent="updateAddingContent" class="drafts" />
        <!-- Show AddContentForm if adding content -->
        <AddContentForm v-if="addingContent === draft._id" :draft="draft" @refreshDrafts="getDrafts" @addContent="updateAddingContent" class="overlay-form" />
        <AddMemberForm v-else-if="adding === draft._id" :draft="draft" @refreshDrafts="getDrafts" @addMember="updateAdding" class="overlay-form" />
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
  gap: 0.5em;
  padding: 0 1em;
}

.drafts {
  padding: 1em;
}
</style>
