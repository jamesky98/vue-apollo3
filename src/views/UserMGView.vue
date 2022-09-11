<script setup>
import Footer1 from "../components/Footer.vue";
import Navbar1 from "../components/Navbar.vue";
import { ref, reactive, onMounted, provide } from "vue";
import path, { join } from "path-browserify";
import {
  MDBInput,
  MDBTextarea,
  MDBCol,
  MDBRow,
  MDBContainer,
  MDBSelect,
  MDBDatepicker,
  MDBBtn,
  MDBPopconfirm,
  MDBIcon,
  MDBAnimation,
  MDBAlert,
  MDBModal,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBTabs,
  MDBTabNav,
  MDBTabContent,
  MDBTabItem,
  MDBTabPane,
} from 'mdb-vue-ui-kit';
import CaseGQL from "../graphql/Cases";
import jStat from "jstat";

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
  console.log(result.data.checktoken);
  if (!result.data.checktoken) {
    logOut();
  }
});
refgetCheckToken();

DataTable.use(DataTableBs5);
DataTable.use(Select);
  
// 引入案件編號
const props = defineProps({
  userName: String,
});

// Information
const infomsg = ref("");
const alert1 = ref(false);
const alertColor = ref("primary");
const updateKey = ref(0);
  
const nowUserId = ref("");
const nowUserName = ref("");
const nowUserPassword = ref("");
const nowUserEmail = ref("");
const nowUserActive = ref("");
const nowUserRole = ref("");

// 查詢User
const { onResult: getUserbyName, refetch: refgetUserbyName} = useQuery(
  UsersGQL.GETUSERBYNAME, () => ({
  userName: props.userName,
}));
getUserbyName(result=>{
  if (!result.loading && result && result.data.getUserByName) {
    let getData = result.data.getUserByName;
    nowUserId.value = getData.user_id;
    nowUserName.value = getData.user_name;
    nowUserPassword.value = getData.user_password;
    nowUserEmail.value = getData.user_mail;
    nowUserActive.value = getData.active;
    nowUserRole.value = getData.role;
  }
});
refgetUserbyName();

</script>
<template>
  <MDBAlert dismiss v-model="alert1" id="alert-primary" :color="alertColor" position="top-right" stacking width="535px"
    appendToBody autohide :delay="2000">
    {{ infomsg }}
  </MDBAlert>
  <MDBContainer fluid class="h-100 overflow-hidden">
    <MDBRow class="h-100 flex-column flex-nowrap">
      <!-- 導覽列 -->
      <Navbar1 />
      <div style="height: calc(100% - 6.5em);">
        <MDBRow style="margin-left:0;margin-right:0;" class="h-100 justify-content-between flex-md-nowrap overflow-visible">
          <!-- 左 -->
          <MDBCol md="4" class="h-100 ps-0 pe-1">
            <MDBRow style="margin-left:0;margin-right:0;height: calc(100% - 1em);" class="px-2 my-2 align-content-start overflow-auto border border-5 rounded-8 shadow-4">
              <!-- 使用者內容 -->
              <MDBCol col="8" class="my-3">
                序號：{{nowUserId}}
              </MDBCol>
              <MDBCol col="12" class="my-3">
                <MDBInput size="sm" type="text" label="員工編號" v-model="nowUserName"/>
              </MDBCol>
              
              <MDBCol col="12" class="my-3">
                <MDBInput size="sm" type="text" label="E-mail" v-model="nowUserEmail"/>
              </MDBCol>
              <MDBCol col="12" class="my-3">
                <MDBInput size="sm" type="text" label="啟用狀態" v-model="nowUserActive"/>
              </MDBCol>
              <MDBCol col="12" class="my-3">
                <MDBInput size="sm" type="text" label="權限" v-model="nowUserRole"/>
              </MDBCol>

              <MDBCol col="12" class="my-3">
                <MDBInput size="sm" type="text" label="舊密碼"/>
              </MDBCol>
              <MDBCol col="12" class="my-3">
                <MDBInput size="sm" type="text" label="變更密碼"/>
              </MDBCol>
              <MDBCol col="12" class="my-3">
                <MDBInput size="sm" type="text" label="再次確認密碼"/>
              </MDBCol>
            </MDBRow>
          </MDBCol>
          <!-- 右 -->
          <MDBCol md="8" class="h-100 ps-1 pe-0">
            <MDBRow style="margin-left:0;margin-right:0;height: calc(100% - 1em);" class="px-2 my-2 align-content-start overflow-auto border border-5 rounded-8 shadow-4">
              <!-- 進階管理內容 -->
              
            </MDBRow>
          </MDBCol>
        </MDBRow>
        

      </div>
      <!-- 頁腳 -->
      <Footer1 :msg="infomsg" />
    </MDBRow>
  </MDBContainer>
</template>
<style>
.datatable tbody tr:last-child {
  border-bottom: rgba(0,0,0,0);
  height: auto;
}
.rounded-top-5 {
  border-top-right-radius: 0.5rem !important;
  border-top-left-radius: 0.5rem !important;
}

.rounded-top-7 {
  border-top-right-radius: 1rem !important;
  border-top-left-radius: 1rem !important;
}

.rounded-bottom-5 {
  border-bottom-right-radius: 0.5rem !important;
  border-bottom-left-radius: 0.5rem !important;
}

.rounded-bottom-7 {
  border-bottom-right-radius: 1rem !important;
  border-bottom-left-radius: 1rem !important;
}

.addParamBtn{
  width: 100%;
  line-height: 0.5;
}
</style>