<script setup>

// 判斷token狀況
import { useQuery, useMutation } from '@vue/apollo-composable';
import UsersGQL from "../graphql/Users";
import { logIn, logOut, toTWDate } from '../methods/User';
import router from '../router';

const { mutate: getchecktoken, onDone: getchecktokenOnDone } = useMutation(UsersGQL.CHECKTOKEN);
getchecktokenOnDone(result => {
  if (!result.data.checktoken) {
    logOut();
  }else{
    console.log("goto main");
    router.push("/main");
  }
});
getchecktoken();

</script>
<template>

</template>
