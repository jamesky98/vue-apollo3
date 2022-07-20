<script setup>
import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from '@/components/HelloWorld.vue'
import router from './router'
import { useQuery } from '@vue/apollo-composable';
import UsersGQL from "./graphql/Users";
// 判斷token狀況
const { onResult:getchecktoken } = useQuery(UsersGQL.CHECKTOKEN);

getchecktoken(result => {
  if (!result.data.checktoken) {
    localStorage.removeItem('AUTH_TOKEN');
    localStorage.removeItem('USER_ID');
    localStorage.removeItem('USER_NAME');
    router.push('/login');
  } else {
    router.push('/');
  }
});

</script>

<template>
  <RouterView />
</template>

<style>





/* @import '@/assets/base.css'; */
@import 'datatables.net-dt';
@import 'datatables.net-bs5';
@import 'datatables.net-searchbuilder-bs5';
html, body, #app{
  height: 100%;
}
#app {
  font-family: 'Noto Sans TC','cwTeXYen', Roboto, Helvetica, Arial, sans-serif;
}

</style>
