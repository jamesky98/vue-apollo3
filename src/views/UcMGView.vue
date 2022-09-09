<script setup>
import Footer1 from "../components/Footer.vue";
import Navbar1 from "../components/Navbar.vue";
import { ref, reactive, onMounted, provide } from "vue";
import path from "path-browserify";
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

// Information
const infomsg = ref("");
const alert1 = ref(false);
const alertColor = ref("primary");
const updateKey = ref(0);

const nowUcModuleName = ref(""); // 模組名稱
const selectUcModuleName = ref(""); // 模組列表
const nowUcModuleNameMU = ref([]);
const nowUcModuleNameDOM = ref();

const selectUcCalType = ref(""); // 校正項目列表
const nowUcCalTypeMU = ref([]);
const nowUcCalTypeDOM = ref();

const nowUcModule = reactive({uc:{}}); // 不確定度模組物件
const nowUcSection = ref(0); // 目前Section
const nowUcItem = ref(0); // 目前Item

// Section表格
let dt1;
const table1 = ref(); 
const data1 = ref([]);
const columns1 = [
  {title:"項次",render: function (data, type, row, meta ) {return meta.row;},width: "30px"},
  {title:"Section", data:"section"},
];
const tboption1 = {
  dom: 't',
  select: {style: 'single',info: false},
  order: [[0, 'asc']],
  // scrollY: '53vh',
  // scrollX: true,
  lengthChange: false,
  searching: false,
  paging: false,
  responsive: true,
};


// 加載表格選取事件
onMounted(function () {
  dt1 = table1.value.dt();
  dt1.on('select', function (e, dt, type, indexes) {
    console.log(dt.rows(indexes)[0][0]);
    nowUcSection.value = dt.rows(indexes)[0][0];
  });

});

// 取得不確定度列表
const {
  mutate: getUcList,
  onDone: getUcListOnDone,
  onError: getUcListError,
} = useMutation(CaseGQL.GETUCLIST);
getUcListOnDone((result) => {
  // 填入uclist選單
  if (!result.loading && result.data.getUclist) {
    let myArray = result.data.getUclist.map((x) => {
      return { text: x, value: x };
    });
    myArray.sort((a,b)=>{
      return (a > b)?1:-1
    }).reverse();
    nowUcModuleNameMU.value = myArray;
  }
});
getUcList();

function readUcModule(){
  if(selectUcModuleName.value){
    getUcModule();
  }
}

// 執行取得不確定度模組getUcModule
const { mutate: getUcModule, onDone: getUcModuleOnDone, onError: getUcModuleError } = useMutation(
  CaseGQL.GETUCMODULE,
  () => ({
    variables: {
      filename: selectUcModuleName.value,
    }
  })
);
getUcModuleOnDone(result=>{
  // 填入基本資料
  nowUcModule.uc = JSON.parse(result.data.getUcModule);
  nowUcModuleName.value = selectUcModuleName.value;
  // data1.value=[];
  // for (let i=0;i < nowUcModule.uc.data.length;i++){
  //   data1.value.push({
  //     index:i,
  //     section: nowUcModule.uc.data[i].section
  //   });
  // }
  
  console.log(nowUcModule.uc);
  
  // 填入Sections
  // 填入Items
});



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
            <MDBRow style="margin-left:0;margin-right:0;height: calc(100% - 1em);" class="my-2 align-content-start overflow-auto border border-5 rounded-8 shadow-4">
              <!-- Base內容 -->
              <MDBSelect size="sm" class="my-3 col-12" label="選擇不確定度模組" v-model:options="nowUcModuleNameMU"
                v-model:selected="selectUcModuleName" ref="nowUcModuleNameDOM" @change="readUcModule"/>
              <MDBCol col="12" class="mb-3">
                <MDBBtn size="sm" color="primary" @click="">新增</MDBBtn>
                <MDBBtn size="sm" color="primary" @click="">儲存</MDBBtn>
              </MDBCol>

              <MDBCol col="8" class="mb-3">
                <MDBInput size="sm" type="text" label="模組名稱" v-model="nowUcModuleName"/>
              </MDBCol>
              <MDBCol col="4" class="mb-3">
                <MDBBtn size="sm" color="primary" @click="">另存新檔</MDBBtn>
              </MDBCol>

              <MDBSelect size="sm" class="mb-3 col-8" label="校正項目" v-model:options="nowUcCalTypeMU"
                v-model:selected="selectUcCalType" ref="nowUcCalTypeDOM" />

              <MDBCol col="8" class="mb-3">
                <MDBInput size="sm" type="text" label="量測作業編號" v-model="nowUcModule.uc.prjcode"/>
              </MDBCol>

              <MDBCol col="4" class="mb-3">
                <MDBInput size="sm" type="text" label="系統評估版本" v-model="nowUcModule.uc.ver"/>
              </MDBCol>

              <MDBCol col="6" class="mb-3">
                <MDBInput size="sm" type="text" label="最小不確定度H" v-model="nowUcModule.uc.minUcH"/>
              </MDBCol>
              <MDBCol col="6" class="mb-3">
                <MDBInput size="sm" type="text" label="最小不確定度V" v-model="nowUcModule.uc.minUcV"/>
              </MDBCol>
              <MDBCol col="6" class="mb-3">
                <MDBInput size="sm" type="text" label="長度單位" v-model="nowUcModule.uc.uom"/>
              </MDBCol>

              <MDBCol md="12" class="mb-3">
                <DataTable :data="nowUcModule.uc.data" :columns="columns1" :options="tboption1" ref="table1"
                  style="font-size: smaller" class="display w-100 compact" />
              </MDBCol>
            </MDBRow>
          </MDBCol>
          <!-- 中 -->
          <MDBCol md="4" class="h-100 px-1">
            <MDBRow style="margin-left:0;margin-right:0;height: calc(100% - 1em);" class="my-2 align-content-start overflow-auto border border-5 rounded-8 shadow-4">
              <!-- Section內容 -->
              <MDBCol col="8" class="my-3">
                目前Section：{{nowUcSection}}
              </MDBCol>
              <MDBCol col="8" class="mb-3">
                <MDBInput v-if="nowUcModule.uc.data" size="sm" type="text" label="Section" v-model="nowUcModule.uc.data[nowUcSection].section"/>
              </MDBCol>
              <MDBCol col="8" class="mb-3">
                <MDBInput v-if="nowUcModule.uc.data" size="sm" type="text" label="type" v-model="nowUcModule.uc.data[nowUcSection].type"/>
              </MDBCol>
            </MDBRow>
          </MDBCol>
          <!-- 右 -->
          <MDBCol md="4" class="h-100 ps-1 pe-0">
            <MDBRow style="margin-left:0;margin-right:0;height: calc(100% - 1em);" class="my-2 align-content-start overflow-auto border border-5 rounded-8 shadow-4">
              <!-- Item內容 -->
            </MDBRow>
          </MDBCol>
        </MDBRow>
        
          <!-- <MDBCol col="12" class="h-100 overflow-auto border border-5 rounded-8 shadow-4"  style="height: calc(100% - 2rem);">
            
          </MDBCol> -->

      </div>
      <!-- 頁腳 -->
      <Footer1 :msg="infomsg" />
    </MDBRow>
  </MDBContainer>
</template>
