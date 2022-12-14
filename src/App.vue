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

const ptStatusMU = JSON.stringify([
  {text: "-未選取-", value: -1},
  {text: "正常", value: "正常"},
  {text: "遺失", value: "遺失"},
  {text: "損毀", value: "損毀"},
  {text: "不適用", value: "不適用"},
  {text: "停用", value: "停用"},
]);
provide("ptStatusMU", ptStatusMU);

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
.status89{
  color: #DE3163;
}
tr.selected > td >span.status89 {
  color: white;
}

.status71{
  color: rgb(3, 211, 3);
}
.status7 {
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

.status1 {
  color: Gray;
}
tr.selected>td>span.status1 {
  color: white;
}

.nav-tabs .nav-link{
  padding: 0.75rem 1rem;
}
/* tr>td>span.typeF {
  color: #6495ED;
} */
.typeF {
  color: #6495ED;
}

tr.selected>td>span.typeF {
  color: white;
}

/* tr>td>span.typeI {
  color: #229954;
} */
.typeI {
  color: #229954;
}

tr.selected>td>span.typeI {
  color: white;
}

/* tr>td>span.typeJ {
  color: #FF7F50;
} */
.typeJ {
  color: #FF7F50;
}
.typeM{
  color: #9966ff;
}

tr.selected>td>span.typeJ {
  color: white;
}
tr.selected>td>span.typeM {
  color: white;
}

div.dataTables_filter {
  padding-top: 0.85em;
}
.img-allfluid{
  height: auto;
  max-width: 100%;
  max-height: 100%;
}

.lightboxImg .imgtitle,.lightboxImg .imgcancel,.lightboxImg button,.lightboxImg a{
  opacity: 0.8;
}

.imgtitle{
  position: absolute; 
  top: 0; 
  left: 0.2rem;
  color: white;
  background-color: rgba(0, 0, 0, 0.6);
  height: 1.5rem;
  border-radius: 0.25rem;
  font-size: 0.5rem;
  padding-left: 0.2rem;
  padding-right: 0.2rem;
}
.imgcancel{
  position: absolute; 
  top: 0; 
  right: 0.2rem;
  background-color: rgba(255, 0, 0, 0.8);
  width: 1.5rem;
  height: 1.5rem;
  text-align: center;
}
.imgcancel::before{
  content: "\2716";
  color: white;
}

.datatable tbody tr:last-child {
  border-bottom: rgba(0,0,0,0);
  height: auto;
}
.rounded-top-5 {
  border-top-right-radius: 0.5rem !important;
  border-top-left-radius: 0.5rem !important;
}

.rounded-top-7 {
  border-top-right-radius: 1rem !important;
  border-top-left-radius: 1rem !important;
}

.rounded-bottom-5 {
  border-bottom-right-radius: 0.5rem !important;
  border-bottom-left-radius: 0.5rem !important;
}

.rounded-bottom-7 {
  border-bottom-right-radius: 1rem !important;
  border-bottom-left-radius: 1rem !important;
}
</style>
