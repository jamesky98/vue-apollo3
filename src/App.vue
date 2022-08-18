<script setup>
import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from '@/components/HelloWorld.vue'
import router from './router'
import { useQuery } from '@vue/apollo-composable';
import UsersGQL from "./graphql/Users";
// import { ref } from "vue";
// 判斷token狀況
// const hasToken = ref(result.data.checktoken);
const { onResult:getchecktoken } = useQuery(UsersGQL.CHECKTOKEN);

getchecktoken(result => {
  if (!result.data.checktoken) {
    localStorage.removeItem('AUTH_TOKEN');
    localStorage.removeItem('USER_ID');
    localStorage.removeItem('USER_NAME');
    localStorage.removeItem('USER_ROLE');
    localStorage.removeItem('USER_AC');
    router.push('/');
  } else {
    router.push('/main');
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
html, body, #app{
  height: 100%;
}
#app {
  font-family: 'Noto Sans TC','cwTeXYen', Roboto, Helvetica, Arial, sans-serif;
}

</style>
