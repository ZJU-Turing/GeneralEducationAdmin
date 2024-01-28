import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";

const routes = [
    { path: "/", name: "home", component: HomeView },
    { path: "/admin", name: "admin", component: () => import("@/views/AdminView.vue") },
];

const router = createRouter({
    routes,
    history: createWebHistory(import.meta.env.BASE_URL),
    scrollBehavior(_, __, savedPosition) {
        if (savedPosition) return savedPosition;
        else return { left: 0, top: 0, behavior: "smooth" };
    },
});

export default router;
