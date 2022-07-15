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
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
}

</style>
