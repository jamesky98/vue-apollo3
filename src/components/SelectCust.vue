<script setup>
import { ref, provide, inject, unref } from "vue";
import {
  MDBInput,  MDBSwitch,  MDBTextarea,
  MDBCol,  MDBRow,  MDBContainer,
  MDBSelect,  MDBDatepicker,  MDBBtn,  MDBBtnClose,
  MDBStepper,  MDBStepperStep,  MDBStepperHead,  MDBStepperContent,  MDBStepperForm,
  MDBModal,  MDBModalHeader,  MDBModalTitle,  MDBModalBody,  MDBModalFooter,
  MDBTabs,  MDBTabNav,  MDBTabContent,  MDBTabItem,  MDBTabPane,
} from 'mdb-vue-ui-kit';
import { useQuery, useMutation } from "@vue/apollo-composable";
import CustGQL from "../graphql/Cust";

import DataTable from "datatables.net-vue3";
import DataTableBs5 from "datatables.net-bs5";
import Select from "datatables.net-select";
import { computed } from "@vue/reactivity";
import router from "../router";
import { errorHandle, logIn, logOut, toTWDate } from "../methods/User";
import { useStore } from 'vuex'

DataTable.use(DataTableBs5);
DataTable.use(Select);

//#region 參數==========start
  // Information
  const infomsg = ref('');
  const alert1 =ref(false);
  const store = useStore();

  // 顧客列表
  const showCustFrom = inject("showCustFrom");
  const nowCaseCustId = inject("nowCaseCustId"); // 顧客聯絡人ID
  const nowCaseCustOrgId = inject("nowCaseCustOrgId"); // 顧客公司名稱
  const nowCaseCustOrgName = inject("nowCaseCustOrgName"); // 顧客公司名稱
  const nowCaseCustTaxID = inject("nowCaseCustTaxID"); // 統一編號
  const nowCaseCustName = inject("nowCaseCustName"); // 聯絡人名稱
  const nowCaseCustTel = inject("nowCaseCustTel"); // 顧客電話
  const nowCaseCustFax = inject("nowCaseCustFax"); // 顧客傳真
  const nowCaseCustAddress = inject("nowCaseCustAddress"); // 聯絡地址

  const selCaseCustId = ref(""); // 顧客聯絡人ID
  const selCaseCustOrgId = ref("");; // 顧客公司名稱
  const selCaseCustOrgName = ref(""); // 顧客公司名稱
  const selCaseCustTaxID = ref(""); // 統一編號
  const selCaseCustName = ref(""); // 聯絡人名稱
  const selCaseCustTel = ref(""); // 顧客電話
  const selCaseCustFax = ref(""); // 顧客傳真
  const selCaseCustAddress = ref(""); // 聯絡地址
  const selCustOrgNameMU = computed(() => store.state.selectlist.caseOrgList);
  const selCustOrgNameDOM = ref();

  const varAllCust = ref({});

//#endregion 參數==========End
//#region 顧客列表=========start
  let dtCust;
  const tableCust = ref();
  const dataCust = ref([]);
  // 設定表格tableCust
  const columnsCust = [
    { data: "id", title: "索引", defaultContent: "-" },
    { data: "cus_org.name", title: "公司名稱", defaultContent: "-" },
    { data: "name", title: "聯絡人", defaultContent: "-" },
    { data: "tel", title: "電話", defaultContent: "-" },
    { data: "fax", title: "傳真", defaultContent: "-" },
    { data: "cus_org.tax_id", title: "統一編號", defaultContent: "-" },
    { data: "address", title: "地址", defaultContent: "-" },
  ];
  const tboptionCust = {
    dom: 'fti',
    select: {
      style: 'single',
      info: false
    },
    order: [[0, 'asc']],
    scrollY: '22vh',
    scrollX: true,
    lengthChange: false,
    searching: true,
    paging: false,
    responsive: true,
    language: {
      info: '共 _TOTAL_ 筆資料',
    }
  };

  // 查詢顧客資料
  const { mutate: refgetAllCust , onDone: getAllCustonDone, onError: getAllCustonError } = useMutation(
    CustGQL.GETALLCUST,
    ()=>({
      variables: varAllCust.value
    })
  );
  getAllCustonDone(result => {
    // 加入顧客資料
    if (!result.loading && result.data) {
      dataCust.value = result.data.getAllCust;
    }
  });
  getAllCustonError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

  // 查詢選取顧客資料
  const {  mutate: refgetselCust, onDone: getselCustonDone, onError: getselCustonError } = useMutation(
    CustGQL.GETCUSTBYID,
    () => ({
      getCustByIdId: (parseInt(selCaseCustId.value))?parseInt(selCaseCustId.value):-1
    })
  );
  getselCustonDone(result => {
    if (!result.loading && result && result.data.getCustById) {
      // console.log('selCustID',seletCustId.value);
      let getData = result.data.getCustById
      // console.log('getData',getData);
      selCaseCustName.value = getData.name;
      selCaseCustOrgId.value = getData.org_id;
      selCaseCustOrgName.value = (getData.cus_org)?getData.cus_org.name:null;
      selCustOrgNameDOM.value.setValue(parseInt(selCaseCustOrgId.value));
      selCaseCustTaxID.value = getData.cus_org.tax_id;
      selCaseCustTel.value = getData.tel;
      selCaseCustFax.value = getData.fax;
      selCaseCustAddress.value = getData.address;
    }
  });
  getselCustonError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

  // 開啟顧客視窗
  function shownCustModal() {
    dtCust = tableCust.value.dt();
    dtCust.on('select', function (e, dt, type, indexes) {
      let getData = dt.rows(indexes).data()[0];
      // console.log('getID',getData.id);
      selCaseCustId.value = (parseInt(getData.id))?parseInt(getData.id):-1;
      refgetselCust({getCustByIdId: selCaseCustId.value});
    });
    refgetAllCust().then(res=>{
      if (nowCaseCustId.value) {
        selCaseCustId.value = nowCaseCustId.value;
      }
    });
  }

  // 儲存顧客資料
  const { mutate: saveCust, onDone: saveCustOnDone, onError: saveCustError } = useMutation(
    CustGQL.UPDATECUST,
    () => ({
      variables: {
        updateCustId: parseInt(selCaseCustId.value),
        name: selCaseCustName.value,
        address: selCaseCustAddress.value,
        tel: selCaseCustTel.value,
        fax: selCaseCustFax.value,
        orgId: parseInt(selCaseCustOrgId.value),
      }
    })
  );
  saveCustOnDone(() => {
    refgetAllCust();
    refgetselCust({getCustByIdId: selCaseCustId.value});
    store.dispatch('selectlist/fetchOrgList');
    infomsg.value = "ID:" + selCaseCustId.value + " " + selCaseCustName.value + "完成修改";
    msgColor.value = "blue";
    // alert1.value = true;
  });
  saveCustError(e=>{errorHandle(e,infomsg,alert1,msgColor)});

  // 更多編輯=>引導至顧客管理
  function gotoCustMG() {
    router.push('/cust');
  }

  // 按加入後回填顧客id
  function setCustBtn() {
    nowCaseCustId.value = selCaseCustId.value;
    let getData = selCustOrgNameMU.value.filter((x) => {
      return parseInt(x.value) === selCaseCustOrgName.value;
    })[0];
    nowCaseCustOrgName.value = (getData) ? getData.text : "";
    nowCaseCustTaxID.value = selCaseCustTaxID.value;
    nowCaseCustName.value = selCaseCustName.value;
    nowCaseCustTel.value = selCaseCustTel.value;
    nowCaseCustFax.value = selCaseCustFax.value;
    nowCaseCustAddress.value = selCaseCustAddress.value;
    showCustFrom.value = false;
  }
//#endregion 顧客列表=========end

defineExpose({
  shownCustModal,
  setCustBtn,
});

</script>
<template>
  <MDBContainer fluid>
    <MDBRow>
      <!-- 顧客列表 -->
      <MDBCol col="12">
        <DataTable :data=" dataCust" :columns="columnsCust" :options="tboptionCust" ref="tableCust"
          style="font-size: smaller" class="display w-100 compact" />
      </MDBCol>
      <!-- 編輯 -->
      <MDBCol col="12" class="border border-1">
        <!-- 功能列 -->
        <div class="mt-2">
          <MDBBtn size="sm" color="primary" @click="saveCust()">儲存</MDBBtn>
          <MDBBtn size="sm" color="primary" @click="gotoCustMG()">顧客管理</MDBBtn>
        </div>
        <MDBRow>
          <MDBCol col="12" class="my-2">
            目前選擇：{{selCaseCustId}} - {{ selCaseCustName }}
          </MDBCol>
          <MDBSelect 
            filter size="sm" class="mb-2 col-12" 
            label="公司名稱" 
            :preselect="false"
            v-model:options="selCustOrgNameMU"
            v-model:selected="nowCaseCustOrgId" 
            ref="selCustOrgNameDOM" 
            @open="listOpened=true"
            @close="listOpened=false"/>
          <MDBCol col="6" class="mb-2">
            <MDBInput size="sm" type="text" label="聯絡人" v-model="selCaseCustName" />
          </MDBCol>
          <MDBCol col="6" class="mb-2">
            <MDBInput size="sm" type="text" label="統一編號" v-model="selCaseCustTaxID" disabled />
          </MDBCol>
          <MDBCol col="6" class="mb-2">
            <MDBInput size="sm" type="text" label="聯絡電話" v-model="selCaseCustTel" />
          </MDBCol>
          <MDBCol col="6" class="mb-2">
            <MDBInput size="sm" type="text" label="傳真" v-model="selCaseCustFax" />
          </MDBCol>
          <MDBCol col="12" class="mb-2">
            <MDBInput size="sm" type="text" label="地址" v-model="selCaseCustAddress" />
          </MDBCol>
        </MDBRow>
      </MDBCol>
    </MDBRow>
  </MDBContainer>
</template>