<script setup>

// 判斷token狀況
import { useQuery } from '@vue/apollo-composable';
import UsersGQL from "../graphql/Users";
import { logIn, logOut, toTWDate } from '../methods/User';
import router from '../router';
const { onResult: getchecktoken, refetch: refgetCheckToken } = useQuery(UsersGQL.CHECKTOKEN);
getchecktoken(result => {
  console.log("checktoken");
  if (!result.data.checktoken) {
    logOut();
  }else{
    console.log("goto main");
    router.push("/main");
  }
});
refgetCheckToken();

</script>
<template>

</template>
