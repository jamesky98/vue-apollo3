<script setup>
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { computed } from "@vue/reactivity";
import { ref, toRaw, unref } from "vue";
import UsersGQL from "../graphql/Users";

// const { result } = useQuery(gql`
//   query Allusers {
//     allusers {
//       user_name
//       user_id
//     }
//   }`);

const userid=ref('1');

const { result } = useQuery(
  gql`
  query getUserById($userId: Int!) {
    getUserById(user_id: $userId) {
      user_name
      user_mail
    }
  }
`,
  () => ({
    userId: parseInt(userid.value)
  })
);

const temp = computed(() =>{
  console.log(result.value);
  return result.value
})

// const name = computed(() => { return result.getUserById });
  // function selectUser(id) {
  //   variables.value = {
  //     userId: parseInt(id),
  //   }
  // }

</script>

<template>
  <input type="text" v-model="userid" />
  <p>{{ temp }}</p>
  <!-- <ul v-if="result && result.getUserById">
    <li v-for="user of result.getUserById">
      {{ user }}
    </li>
  </ul> -->
</template>
