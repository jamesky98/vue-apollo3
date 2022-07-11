<template>
  <div>
    <form @submit.prevent="userlogin()">
      <h3>登入</h3>
      <div class="form-group">
        <label>員工編號</label>
        <input type="text" class="form-control form-control-lg" v-model="user_name" />
      </div>
      <div class="form-group">
        <label>密碼</label>
        <input type="password" class="form-control form-control-lg" v-model="user_password" />
      </div>
      <p>{{ token }}</p>
      <button type="submit" class="btn btn-dark btn-lg btn-block">登入</button>
    </form>
  </div>
</template>

<script setup>
import { useQuery, useMutation } from '@vue/apollo-composable';
import UsersGQL from "../graphql/Users";
import { ref } from 'vue';

// 傳遞參數
const user_name=ref('');
const user_password = ref('');
const token = ref('');
// 執行查詢
const { mutate: userlogin, onDone } = useMutation(
  UsersGQL.LOGINMU,
  () => (
    {
      variables: {
        username: user_name.value,
        userpassword: user_password.value
      }
    }),
);

onDone(result => {
  console.log(result.data);
  // console.log(LOGINMU); 
  token.value = result.data.login.token;
});


</script>
