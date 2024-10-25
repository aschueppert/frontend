<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { defineProps, onBeforeMount, ref } from "vue";
let props = defineProps(["username"]);
const { isLoggedIn } = storeToRefs(useUserStore());

const { currentUsername } = storeToRefs(useUserStore());
const loaded = ref(false);
let following = ref<Array<Record<string, string>>>([]);

const emit = defineEmits(); // Define emits for the component

const user_following = ref<Array<Record<string, string>>>([]);

async function getFollowing() {
  let followingResults;
  console.log(props.username);
  try {
    followingResults = await fetchy(`/api/follow/${props.username}`, "GET", {});
  } catch (e) {
    return;
  }
  following.value = followingResults;
}

// Fetch the list of users that the logged-in user is following
async function getUserFollowing() {
  try {
    const followingResults = await fetchy(`/api/follow/${currentUsername.value}`, "GET", {});
    user_following.value = followingResults;
  } catch (e) {
    console.error("Error fetching user following:", e);
  }
}

// Follow a user
const followUser = async (followingUser: string) => {
  try {
    await fetchy(`/api/follows`, "POST", { body: { username: followingUser } });
    emit("refreshFollows");
  } catch (e) {
    console.error("Error following user:", e);
  }
};

onBeforeMount(async () => {
  await getFollowing();
  await getUserFollowing();
  loaded.value = true;
});
</script>

<template>
  <!-- Section displaying the list of accounts following -->
  <div v-if="isLoggedIn">
    <section v-if="loaded">
      <div class="column">
        <router-link class="link" :to="{ name: 'Following', params: { username: props.username } }"> Following: {{ following.length }} </router-link>
        <button
          v-if="props.username != currentUsername && !user_following.some((user: any) => user.following === props.username)"
          class="btn-small pure-button primary small"
          @click="() => followUser(props.username)"
        >
          Follow
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.small {
  width: 6em;
}
</style>
