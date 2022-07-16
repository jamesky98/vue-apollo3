import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginUser.vue"),
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("../views/SignUpUser.vue"),
    },
    {
      path: "/docs",
      name: "docs",
      component: () => import("../views/DocMGView.vue"),
    },
    {
      path: "/cases",
      name: "cases",
      component: () => import("../views/CaseMGView.vue"),
    },
    {
      path: "/employee",
      name: "employee",
      component: () => import("../views/EmpMGView.vue"),
    },
    {
      path: "/gcps",
      name: "gcps",
      component: () => import("../views/GcpMGView.vue"),
    },
    {
      path: "/prjs",
      name: "prjs",
      component: () => import("../views/PrjMGView.vue"),
    },
    {
      path: "/items",
      name: "items",
      component: () => import("../views/ItemMGView.vue"),
    },
    {
      path: "/cust",
      name: "cust",
      component: () => import("../views/CustMGView.vue"),
    },
  ],
});

export default router
