import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/login",
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
      path: "/ucedit",
      name: "ucedit",
      component: () => import("../views/UcMGView.vue"),
      props: true,
    },
    {
      path: "/useredit",
      name: "useredit",
      component: () => import("../views/UserMGView.vue"),
      props: (route) => route.query,
    },
    {
      path: "/sicltab01",
      name: "sicltab01",
      component: () => import("../components/table/SiclTab01.vue"),
      props: (route) => route.query,
      meta: {
        title: "校正作業管理表",
      },
    },
    {
      path: "/sicltab02",
      name: "sicltab02",
      component: () => import("../components/table/SiclTab02.vue"),
      props: (route) => route.query,
      meta: {
        title: "校正申請表",
      },
    },
    {
      path: "/sicltab03",
      name: "sicltab03",
      component: () => import("../components/table/SiclTab03.vue"),
      props: (route) => route.query,
      meta: {
        title: "校正申請表",
      },
    },
    {
      path: "/sicltab04",
      name: "sicltab04",
      component: () => import("../components/table/SiclTab04.vue"),
      props: (route) => route.query,
      meta: {
        title: "校正申請表",
      },
    },
    {
      path: "/sicltab05",
      name: "sicltab05",
      component: () => import("../components/table/SiclTab05.vue"),
      props: (route) => route.query,
      meta: {
        title: "計算成果表",
      },
    },
    {
      path: "/sicltab06",
      name: "sicltab06",
      component: () => import("../components/table/SiclTab06.vue"),
      props: (route) => route.query,
      meta: {
        title: "不確定度計算表",
      },
    },
    {
      path: "/sicltab07",
      name: "sicltab07",
      component: () => import("../components/table/SiclTab07.vue"),
      props: (route) => route.query,
      meta: {
        title: "作業紀錄表",
      },
    },
    {
      path: "/sicltab08",
      name: "sicltab08",
      component: () => import("../components/table/SiclTab08.vue"),
      props: (route) => route.query,
      meta: {
        title: "不確定度計算表",
      },
    },
    {
      path: "/sicltab09",
      name: "sicltab09",
      component: () => import("../components/table/SiclTab09.vue"),
      props: (route) => route.query,
      meta: {
        title: "計算成果表",
      },
    },
    {
      path: "/sicltab10",
      name: "sicltab10",
      component: () => import("../components/table/SiclTab10.vue"),
      props: (route) => route.query,
      meta: {
        title: "作業紀錄表",
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
