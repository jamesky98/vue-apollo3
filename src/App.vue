<script setup>
import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from '@/components/HelloWorld.vue'
import router from './router'

if (!localStorage.getItem("AUTH_TOKEN")){
  
  router.push('/login');
}else{
  router.push('/');
}

</script>

<template>
  <RouterView />
</template>

<style>


/* @import '@/assets/base.css'; */
@import 'datatables.net-dt';
@import 'datatables.net-bs5';
html, body, #app{
  height: 100%;
}
#app {
  font-family: 'Noto Sans TC','cwTeXYen', Roboto, Helvetica, Arial, sans-serif;
}

</style>
