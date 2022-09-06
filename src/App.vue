<script setup>
import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from '@/components/HelloWorld.vue'
import router from './router'
import { useQuery } from '@vue/apollo-composable';
import UsersGQL from "./graphql/Users";
import { logIn, logOut, toTWDate } from './methods/User';
// import { ref } from "vue";
// 判斷token狀況
// const hasToken = ref(result.data.checktoken);
const { onResult:getchecktoken } = useQuery(UsersGQL.CHECKTOKEN);
getchecktoken(result => {
  if (!result.data.checktoken) {
    logOut();
  } else {
    // router.push('/main');
  }
});

</script>

<template>
  <RouterView />
</template>

<style>

@import 'datatables.net-dt';
@import 'datatables.net-bs5';
@import 'datatables.net-searchbuilder-bs5';
@import "@fortawesome/fontawesome-free/css/all.min.css";
html, body, #app{
  height: 100%;
}
#app {
  /* font-family: Roboto, Helvetica, Arial, sans-serif; */
  font-family: 'Noto Sans TC','cwTeXYen', Roboto, Helvetica, Arial, sans-serif;
}

</style>
