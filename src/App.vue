<script setup>
// import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from '@/components/HelloWorld.vue'
// import router from './router'
// import { useQuery } from '@vue/apollo-composable';
// import UsersGQL from "./graphql/Users";
// import { logIn, logOut, toTWDate } from './methods/User';
import { ref, provide, inject } from "vue";
// 判斷token狀況
// const hasToken = ref(result.data.checktoken);
// const { onResult:getchecktoken } = useQuery(UsersGQL.CHECKTOKEN);
// getchecktoken(result => {
//   if (!result.data.checktoken) {
//     logOut();
//   } else {
//     // router.push('/main');
//   }
// });
const publicPath = ref(import.meta.env.VITE_GRAPHQL_PUBLIC);
provide("publicPath", publicPath);

</script>

<template>
  <RouterView />
</template>

<style>

@import 'datatables.net-dt';
@import 'datatables.net-bs5';
@import "@fortawesome/fontawesome-free/css/all.min.css";
/* @import "./assets/cwtexyen.css";
@import "./assets/Roboto.css";
@import "./assets/notosanstc.css"; */


html, body, #app{
  height: 100%;
}
#app {
  /* font-family: Roboto, Helvetica, Arial, sans-serif; */
  font-family: 'Noto Sans TC','cwTeXYen', Roboto, Helvetica, Arial, sans-serif;
}
.hiddenSpinner {
  display: none;
}
.datatable tbody tr:last-child {
  border-bottom: rgba(0, 0, 0, 0);
  height: auto;
}
tr > td > span.status89{
  color: #DE3163;
}
tr.selected > td >span.status89 {
  color: white;
}

tr>td>span.status7 {
  color: green;
}
tr.selected>td>span.status7 {
  color: white;
}

tr>td>span.status6 {
  color: #F39C12;
}
tr.selected>td>span.status6 {
  color: white;
}

tr>td>span.status45 {
  color: #6495ED;
}
tr.selected>td>span.status45 {
  color: white;
}

tr>td>span.status23 {
  color: #FF7F50;
}
tr.selected>td>span.status23 {
  color: white;
}

tr>td>span.status1 {
  color: Gray;
}
tr.selected>td>span.status1 {
  color: white;
}

.nav-tabs .nav-link{
  padding: 0.75rem 1rem;
}
tr>td>span.typeF {
  color: #6495ED;
}

tr.selected>td>span.typeF {
  color: white;
}

tr>td>span.typeI {
  color: #229954;
}

tr.selected>td>span.typeI {
  color: white;
}

tr>td>span.typeJ {
  color: #FF7F50;
}

tr.selected>td>span.typeJ {
  color: white;
}
div.dataTables_filter {
  padding-top: 0.85em;
}

</style>
