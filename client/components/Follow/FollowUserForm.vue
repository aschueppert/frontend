<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
// Props and Emits
const props = defineProps(["follow"]);
const emit = defineEmits(["refreshFollows", "followUser"]);

// Reactive references
const selectedUser = ref(""); // Reactive reference for the selected user
let users = ref<Array<Record<string, string>>>([]);
const searchTerm = ref("");

// Function to add a member
const followUser = async (username: string) => {
  try {
    await fetchy(`/api/follows`, "POST", { body: { username: username } });
  } catch (e) {
    console.log(e);
    return;
  }
  emit("refreshFollows");
};

// Reactive references

// Function to select a user
const selectUser = (user: string) => {
  selectedUser.value = user; // Set the selected user
};

// Function to cancel selection
const cancelSelection = () => {
  selectedUser.value = ""; // Clear the selected user
  searchTerm.value = ""; // Clear the search term
  emit("followUser");
  emit("refreshFollows");
};

// Computed filtered list of users based on search term
const filteredUsers = computed(() => {
  return users.value.filter(
    (username) => username && username.toString().toLowerCase().includes(searchTerm.value.toLowerCase()), // Ensure username is defined
  );
});

// Fetch all users from the API
const getUsers = async () => {
  try {
    let usersResults = await fetchy(`/api/users`, "GET", {});
    users.value = usersResults.map((user: any) => user.username);
  } catch (e) {
    console.log("error");
    console.log(e);
    return;
  }
  emit("refreshFollows");
};

// Fetch users on component mount
onMounted(async () => {
  await getUsers();
});
</script>

<template>
  <div class="page">
    <input v-model="searchTerm" placeholder="Search for a user" />
    <!-- Display the filtered list of users -->
    <ul v-if="filteredUsers.length > 0" class="item-list">
      <button v-for="user in filteredUsers.slice(0, 6)" :key="user.id" class="btn-small pure-button" :class="{ selected: selectedUser === user.toString() }" @click="selectUser(user.toString())">
        {{ user }}
      </button>
    </ul>

    <p v-else>No users found</p>

    <form @submit.prevent="followUser(selectedUser)">
      <li>
        <button class="btn-small pure-button-primary pure-button primary" type="submit" id="submit" :disabled="!selectedUser">Follow</button>
      </li>
      <li><button type="button" class="btn-small pure-button" @click="cancelSelection">Cancel</button></li>
    </form>
  </div>
</template>

<style scoped>
.item-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5em; /* Adjust gap between user items */
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  list-style-type: none;
}

form {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}
</style>
