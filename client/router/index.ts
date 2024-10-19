import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import DraftsView from "../views/DraftsView.vue";
import FollowingView from "../views/FollowingView.vue";
import HomeView from "../views/HomeView.vue";
import ImagesView from "../views/ImagesView.vue";
import LoginView from "../views/LoginView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import ProfileView from "../views/ProfileView.vue";
import SavedView from "../views/SavedView.vue";
import SettingView from "../views/SettingView.vue";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/drafts",
      name: "Drafts",
      component: DraftsView,
    },
    {
      path: "/posts",
      name: "Posts",
      component: ProfileView,
    },
    {
      path: "/saved",
      name: "Saved",
      component: SavedView,
    },
    {
      path: "/following",
      name: "Following",
      component: FollowingView,
    },
    {
      path: "/images",
      name: "Images",
      component: ImagesView,
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
        console.log(to, from);
        const { isLoggedIn } = storeToRefs(useUserStore());
        if (isLoggedIn.value) {
          return { name: "Settings" };
        }
      },
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
