<script setup>
import { useQuery } from "@vue/apollo-composable";
import { computed } from "@vue/reactivity";
import { ref } from "vue";
import UsersGQL from "../graphql/Users";

const { result } = useQuery(
  UsersGQL.GETALLUSERs
);

// const userid=ref('1');
// const { result } = useQuery(
//   UsersGQL.GETUSER,
//   () => ({
//     userId: parseInt(userid.value)
//   })
// );

// const name = computed(() => { return result.getUserById });
  // function selectUser(id) {
  //   variables.value = {
  //     userId: parseInt(id),
  //   }
  // }

</script>

<template>
  <input type="text" v-model="userid" />
  <ul>
    <li v-for="user in result.allusers">{{ user.user_name }}</li>
  </ul>
</template>
