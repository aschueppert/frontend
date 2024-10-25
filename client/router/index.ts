import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import DraftsView from "../views/DraftsView.vue";
import EventsView from "../views/EventsView.vue";
import FollowingView from "../views/FollowingView.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import ProfileView from "../views/ProfileView.vue";
import SavedView from "../views/SavedView.vue";
import SavePostsView from "../views/SavePostsView.vue";
import SettingView from "../views/SettingView.vue";
import ThemeListView from "../views/ThemeListView.vue";
import ThemeView from "../views/ThemeView.vue";
const themes = [
  "event",
  "news",
  "music",
  "theatre",
  "art",
  "food",
  "fashion",
  "technology",
  "politics",
  "science",
  "health",
  "education",
  "travel",
  "lifestyle",
  "television",
  "film",
  "literature",
  "comics",
  "games",
  "hobbies",
  "crafts",
  "pets",
  "gardening",
  "sports",
];
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: "/",
      name: "ThemeList",
      component: ThemeListView,
      meta: { requiresAuth: true },
    },
    {
      path: "/drafts",
      name: "Drafts",
      component: DraftsView,
      meta: { requiresAuth: true },
    },
    {
      path: "/posts/:username",
      name: "Posts",
      component: ProfileView,
      props: true, // Pass route params as props
      meta: { requiresAuth: true },
    },
    {
      path: "/saved/:name",
      name: "SavedPosts",
      component: SavePostsView,
      props: true, // Pass route params as props
      meta: { requiresAuth: true },
    },
    {
      path: "/saved",
      name: "Saved",
      component: SavedView,
      meta: { requiresAuth: true },
    },
    {
      path: "/following/:username",
      name: "Following",
      component: FollowingView,
      props: true, // Pass route params as props
      meta: { requiresAuth: true },
    },
    {
      path: "/events",
      name: "Events",
      component: EventsView,
      meta: { requiresAuth: true },
    },
    {
      path: "/setting",
      name: "Settings",
      component: SettingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { requiresAuth: false },
      beforeEnter: (to, from) => {
        const { isLoggedIn } = storeToRefs(useUserStore());
        if (isLoggedIn.value) {
          return { name: "Settings" };
        }
      },
    },
    {
      path: "/theme/:themeName",
      name: "Theme",
      component: ThemeView,
      props: true, // Pass route params as props
      beforeEnter: (to, from, next) => {
        const themeName = to.params.themeName.toString();
        if (themes.includes(themeName)) {
          next(); // Proceed to the route if allowed
        } else {
          next({ name: "/not-found" }); // Redirect to "not-found" if not allowed
        }
      },
    },
    {
      path: "/not-found",
      name: "/not-found",
      component: NotFoundView,
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from) => {
  console.log(from);
  const { isLoggedIn } = storeToRefs(useUserStore());

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Login" };
  }
});

export default router;
