<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import CreateDraftForm from "@/components/Draft/CreateDraftForm.vue";
import DraftComponent from "@/components/Draft/DraftComponent.vue";
import AddMemberForm from "@/components/Draft/AddMemberForm.vue";
import AddContentForm from "@/components/Draft/AddContentForm.vue";
import SelectContentForm from "@/components/Draft/SelectContentForm.vue";
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
  } catch (_) {
    return;
  }
  drafts.value = draftResults;
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
  </section>

  <!-- Section displaying the list of drafts -->
  <section class="drafts" v-if="loaded && drafts.length !== 0">
    <article v-for="draft in drafts" :key="draft._id">
      <!-- Show DraftComponent if not adding/selecting the draft -->
      <DraftComponent
        v-if="adding !== draft._id && selecting !== draft._id && addingContent !== draft._id"
        :draft="draft"
        @refreshDrafts="getDrafts"
        @addMember="updateAdding"
        @selectContent="updateSelecting"
        @addContent="updateAddingContent"
      />

      <!-- Show AddMemberForm if adding this draft for adding members -->
      <AddMemberForm v-else-if="adding === draft._id" :draft="draft" @refreshDrafts="getDrafts" @addMember="updateAdding" />

      <!-- Show AddMemberForm if adding this draft for adding members -->
      <AddContentForm v-else-if="addingContent === draft._id" :draft="draft" @refreshDrafts="getDrafts" @addContent="updateAddingContent" />

      <!-- Show SelectContentForm if selcting this draft for content selection -->
      <SelectContentForm v-else :draft="draft" @refreshDrafts="getDrafts" @selectContent="updateSelecting" />
    </article>
  </section>

  <!-- Message when no drafts are found -->
  <p v-else-if="loaded">No drafts found</p>

  <!-- Loading message -->
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  border: 3px solid var(--base-border);
  padding: 1em;
}

.drafts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
