<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { defineEmits, defineProps, onBeforeMount, ref } from "vue";

const { currentUsername } = storeToRefs(useUserStore());
const props = defineProps(["username"]);
const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
const following = ref<Array<Record<string, string>>>([]);
const user_following = ref<Array<Record<string, string>>>([]);

const emit = defineEmits(); // Define emits for the component

// Fetch the list of users that the specified user is following
async function getFollowing() {
  try {
    const followingResults = await fetchy(`/api/follow/${props.username}`, "GET", {});
    following.value = followingResults;
  } catch (e) {
    console.error("Error fetching following:", e);
  }
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

// Unfollow a user
const deleteFollowing = async (followingUser: string) => {
  try {
    await fetchy(`/api/follows/${followingUser}`, "DELETE");
    following.value = following.value.filter((f) => f.following !== followingUser); // Remove unfollowed user from the list
    emit("refreshFollows");
  } catch (e) {
    console.error("Error unfollowing user:", e);
  }
};

// Follow a user
const followUser = async (followingUser: string) => {
  try {
    await fetchy(`/api/follows`, "POST", { body: { username: followingUser } });
    user_following.value.push({ following: followingUser }); // Add followed user to the user_following list
    emit("refreshFollows");
  } catch (e) {
    console.error("Error following user:", e);
  }
};

// Fetch the following lists on component mount
onBeforeMount(async () => {
  await getFollowing();
  await getUserFollowing();
  loaded.value = true;
});
</script>

<template>
  <main v-if="isLoggedIn">
    <section v-if="loaded && following.length > 0">
      <div class="header">
        <router-link class="link back" :to="{ name: 'Posts', params: { username: props.username } }"><</router-link>
        <h1>{{ props.username }}</h1>
        <p class="link invisible">></p>
      </div>
      <h1>Following</h1>
      <div v-for="follow in following" :key="follow._id" class="follow-container">
        <router-link class="link" :to="{ name: 'Posts', params: { username: follow.following } }">
          {{ follow.following }}
        </router-link>
        <button v-if="props.username === currentUsername" class="button-error btn-small pure-button follow" @click="() => deleteFollowing(follow.following)">Unfollow</button>
        <div v-else>
          <button v-if="!user_following.some((user: any) => user.following === follow.following)" class="primary btn-small pure-button follow" @click="() => followUser(follow.following)">
            Follow
          </button>
          <button v-else class="btn-small pure-button follow">Following</button>
        </div>
      </div>
    </section>
    <p v-else-if="loaded">Following no users</p>
    <p v-else>Loading...</p>
  </main>
</template>

<style scoped>
p {
  margin: 0em;
}
h1 {
  text-align: center;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0.2em;
  padding-right: 0.2em;
}
.invisible {
  color: white;
}
.h1 {
  text-align: center;
}
.follow-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.5em; /* Add padding for spacing */
}
.following {
  font-weight: bold;
  font-size: 1.2em;
}
.link {
  font-size: 1.5em;
}
button.follow {
  width: 130px;
  text-align: center;
}
</style>
