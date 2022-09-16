<script setup>
import Footer1 from "../components/Footer.vue";
import Navbar1 from "../components/Navbar.vue";
import { ref, reactive, onMounted, provide } from "vue";
import path, { join } from "path-browserify";
import {
  MDBInput,
  MDBCol,
  MDBRow,
  MDBContainer,
  MDBBtn,
  MDBTabs,
  MDBTabNav,
  MDBTabItem,
  MDBTabContent,
  MDBTabPane,
} from 'mdb-vue-ui-kit';

import DataTable from 'datatables.net-vue3';
import DataTableBs5 from 'datatables.net-bs5';
import Select from 'datatables.net-select';
import { computed } from "@vue/reactivity";

// 判斷token狀況
import { useQuery, useMutation } from '@vue/apollo-composable';
import UsersGQL from "../graphql/Users";
import { logIn, logOut, toTWDate } from '../methods/User';
import router from '../router';
const { onResult: getchecktoken, refetch: refgetCheckToken } = useQuery(UsersGQL.CHECKTOKEN);
getchecktoken(result => {
  if (!result.data.checktoken) {
    logOut();
  }
});
refgetCheckToken();

DataTable.use(DataTableBs5);
DataTable.use(Select);

// 取得權限==========Start
// const myUserId = ref("");
const myUserName = ref("");
// const myUserName2 = ref("");
// const myUserEmail = ref("");
// const myUserActive = ref(false);
const myUserRole = ref("");

const { onResult: getNowUser, refetch: refgetNowUser } = useQuery(UsersGQL.GETNOWUSER);
getNowUser(result => {
  if (!result.loading && result && result.data.getNowUser) {
    let getData = result.data.getNowUser;
    // myUserId.value = getData.user_id;
    myUserName.value = getData.user_name;
    // myUserName2.value = getData.user_name2;
    // myUserEmail.value = getData.user_mail;
    // myUserActive.value = (getData.active===1)?true:false;
    myUserRole.value = getData.role;
  }
});
refgetNowUser();
const rGroup = computed(() => {
  let result = [];
  // rGroup[0]最高權限
  // rGroup[1]技術主管專用
  // rGroup[2]技術人員專用(非己不可改)
  // rGroup[3]最低權限
  // rGroup[4]完全開放
  switch (myUserRole.value) {
    case 0:
      if (myUserName.value === nowUserName.value) {
        result = [false, false, false, false, true];
      } else {
        result = [false, false, false, false, false];
      }
      break;
    case 1:
      if (myUserName.value === nowUserName.value) {
        result = [false, false, true, true, true];
      } else {
        result = [false, false, false, false, false];
      }
      break;
    case 2:
      result = [false, true, false, true, true];
      break;
    case 3:
      result = [true, true, true, true, true];
      break;
  }
  return result;
});
// 取得權限==========End

// Information
const infomsg = ref("");
const alert1 = ref(false);
const alertColor = ref("primary");
const NavItem = ref("employee");
provide("NavItem", NavItem);
const updateKey = ref(0);

let dt1;
const table1 = ref(); 
const data1 = ref([]);
const columns1 = [
  { title: "索引", data: "id", defaultContent: "-" },
  { title: "員工編號", data: "name", defaultContent: "-" },
  { title: "姓名", data: "name2", defaultContent: "-" },
];
const tboption1 = {
  dom: 'tif',
  select: {
    style: 'single',
    info: false
  },
  order: [[0, 'asc']],
  scrollY: '34vh', 
  scrollX: true,
  lengthChange: false,
  searching: true,
  paging: false,
  responsive: true,
  language: {
    info: '共 _TOTAL_ 筆資料', 
  }
};

</script>
<template>
  <MDBContainer fluid class="h-100">
    <MDBRow class="d-flex flex-md-column h-100">
      <!-- 導覽列 -->
      <Navbar1 />
      <!-- 主體 -->
      <MDBRow style="margin-left:0;margin-right:0;height: calc(100% - 6.5em);" class="align-content-between">

          <MDBCol col="12" class="my-2 bg-light overflow-auto border border-5 rounded-8 shadow-4" style="height: calc(50% - 0.75rem)">
            <MDBRow class="h-100">
              <MDBCol col="5" class="h-100">
                <DataTable :data="data1" :columns="columns1" :options="tboption1" ref="table1" style="font-size: smaller"
                  class="display w-100 compact" />
              </MDBCol>
              <MDBCol col="7" class="h-100 border-start">
                
              </MDBCol>
            </MDBRow>
          </MDBCol>
          <MDBCol col="12" class="my-2 bg-light overflow-auto border border-5 rounded-8 shadow-4" style="height: calc(50% - 0.75rem)">
            <MDBRow class="h-100">
              <MDBCol col="6" class="h-100"></MDBCol>
              <MDBCol col="6" class="h-100 border-start"></MDBCol>
            </MDBRow>
          </MDBCol>

      </MDBRow>
      <!-- 頁腳 -->
      <Footer1 :msg="infomsg" />
    </MDBRow>
  </MDBContainer>
</template>
