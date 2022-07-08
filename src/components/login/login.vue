<template>
  <div class="container m-5">
    <form @submit.prevent="userLogin">
      <h3>登入</h3>

      <div class="form-group">
        <label>員工編號</label>
        <input type="text" class="form-control form-control-lg" v-model="user_id" />
      </div>

      <div class="form-group">
        <label>密碼</label>
        <input type="password" class="form-control form-control-lg" v-model="user_password" />
      </div>
      <p>{{ message }}</p>
      <button type="submit" class="btn btn-dark btn-lg btn-block">登入</button>
      <button class="btn btn-dark btn-lg btn-block">
        <router-link to="/register">
          註冊
        </router-link>
      </button>

      <!-- <p class="forgot-password text-right mt-2 mb-4">
        <router-link to="/forgot-password">忘記密碼?</router-link>
      </p> -->
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import login_mutation from '../../graphql/Users';

export default {
  setup() {
    
    const message = ref('');
    const user_id = ref('');
    const user_password = ref('');

    const { mutate: userLogin, onDone, onError } = useMutation(
      login_mutation,
      () => ({
        variables: {
          "userName": user_id,
          "userPassword": user_password
        }
      })
    );

    onDone(() => {
      message.value="登入成功"
    })

    // onError(error => {
    //   logErrorMessages(error);
    // });

    return {
      user_id,
      user_password,
      message,
      userLogin,
    }
  },
};
</script>
