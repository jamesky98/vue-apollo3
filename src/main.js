import { createApp, provide, h } from "vue";
import { createPinia } from 'pinia'
import apolloClient from './apolloclient'
import { DefaultApolloClient } from "@vue/apollo-composable";
import "mdb-vue-ui-kit/css/mdb.min.css";
import App from './App.vue'
import router from './router'
import store from './store/index';

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
  render: () => h(App),
});

app.use(createPinia());
app.use(router);
app.use(store);

app.mount('#app')
