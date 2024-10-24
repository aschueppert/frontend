<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
// Props and Emits
const props = defineProps(["draft"]);
const emit = defineEmits(["addMember", "refreshDrafts"]);

// Reactive references
const selectedUser = ref(""); // Reactive reference for the selected user
let users = ref<Array<Record<string, string>>>([]);
const searchTerm = ref("");

// Fetch all users from the API
const getUsers = async () => {
  try {
    let usersResults = await fetchy(`/api/users`, "GET", {});
    users.value = usersResults.map((user: any) => user.username);
  } catch (e) {
    return;
  }
  emit("refreshDrafts");
};

// Function to select a user
const selectUser = (user: string) => {
  selectedUser.value = user; // Set the selected user
};

// Function to add a member
const addMember = async (user: string) => {
  console.log("Adding member:", user);
  try {
    await fetchy(`/api/drafts/${props.draft._id}`, "PATCH", { body: { id: props.draft._id, member: user } });
  } catch (e) {
    return;
  }
  emit("addMember");
  emit("refreshDrafts");
};

// Function to cancel selection
const cancelSelection = () => {
  selectedUser.value = ""; // Clear the selected user
  searchTerm.value = ""; // Clear the search term
  emit("addMember");
  emit("refreshDrafts");
};

// Computed filtered list of users based on search term
const filteredUsers = computed(() => {
  return users.value.filter(
    (username) => username && username.toString().toLowerCase().includes(searchTerm.value.toLowerCase()), // Ensure username is defined
  );
});

// Fetch users on component mount
onMounted(async () => {
  await getUsers();
});
</script>

<template>
  <main>
    <h3>Add member:</h3>
    <input v-model="searchTerm" placeholder="Search for a user" />
    <!-- Display the filtered list of users -->
    <ul v-if="filteredUsers.length > 0" class="item-list">
      <button v-for="user in filteredUsers.slice(0, 6)" :key="user.id" class="btn-small pure-button item" :class="{ selected: selectedUser === user.toString() }" @click="selectUser(user.toString())">
        {{ user }}
      </button>
    </ul>

    <p v-else>No users found</p>

    <form @submit.prevent="addMember(selectedUser)">
      <li><button class="btn-small pure-button primary" type="submit" id="submit" :disabled="!selectedUser">Add</button></li>
      <li><button type="button" class="btn-small pure-button" @click="cancelSelection">Cancel</button></li>
    </form>
  </main>
</template>

<style scoped></style>
