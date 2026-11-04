import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
import TaskSectionLayout from "@/layouts/TaskSectionLayout.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: MainLayout,
      children: [
        {
          path: "",
          redirect: { name: "today" },
        },
        {
          path: "tasks",
          component: TaskSectionLayout,
          children: [
            {
              path: "",
              redirect: { name: "today" },
            },
            {
              path: "today",
              name: "today",
              component: () => import("@/views/Today.vue"),
            },
            {
              path: "week",
              name: "week",
              component: () => import("@/views/Week.vue"),
            },
            {
              path: "trash",
              name: "trash",
              component: () => import("@/views/Trash.vue"),
            },
          ],
        },
        {
          path: "settings",
          name: "settings",
          component: () => import("@/views/Setting.vue"),
        },
        {
          path: "calendar",
          name: "calendar",
          component: () => import("@/views/Calendar.vue"),
        },
      ],
    },
  ],
});

export default router;
