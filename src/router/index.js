import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("../views/LoginUser.vue"),
    },
    {
      path: "/main",
      name: "main",
      component: () => import("../views/main.vue"),
      props: true,
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
      props: true,
    },
    {
      path: "/cases",
      name: "cases",
      component: () => import("../views/CaseMGView.vue"),
      props: true,
    },
    {
      path: "/employee",
      name: "employee",
      component: () => import("../views/EmpMGView.vue"),
      props: true,
    },
    {
      path: "/gcps",
      name: "gcps",
      component: () => import("../views/GcpMGView.vue"),
      props: true,
    },
    {
      path: "/prjs",
      name: "prjs",
      component: () => import("../views/PrjMGView.vue"),
      props: true,
    },
    {
      path: "/items",
      name: "items",
      component: () => import("../views/ItemMGView.vue"),
      props: true,
    },
    {
      path: "/cust",
      name: "cust",
      component: () => import("../views/CustMGView.vue"),
      props: true,
    },
    {
      path: "/sicltab01",
      name: "sicltab01",
      component: () => import("../views/SiclTab01.vue"),
      props: (route) => route.query,
      meta: {
        title: "校正作業管理表",
      },
    },
    {
      path: "/sicltab02",
      name: "sicltab02",
      component: () => import("../views/SiclTab02.vue"),
      props: (route) => route.query,
      meta: {
        title: "校正申請表",
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

export default router
