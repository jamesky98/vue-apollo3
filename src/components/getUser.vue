<script setup>
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ref } from "vue";
import UsersGQL from "../graphql/Users";

const userid=ref('1');

const { result } = useQuery(
  UsersGQL.GETUSER,
  () => ({
    userId: parseInt(userid.value)
  })
);

</script>

<template>
  <input type="text" v-model="userid" />
  <!-- v-if很重要否則result第1次查不到就會一直出現錯誤，加入判斷後就可以正常查詢內容 -->
  <p v-if="result && result.getUserById">
    {{ result.getUserById.user_name }}
  </p>
</template>
