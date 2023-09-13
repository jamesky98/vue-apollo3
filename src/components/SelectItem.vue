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
import ItemGQL from "../graphql/Item";

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
  const iType = inject("iType"); // 選擇儀器類型1:相機 2:光達 3:GNSS 4:IMU

  // Information
  const infomsg = ref('');
  const alert1 =ref(false);
  const store = useStore();
  // const publicPath = computed(() => store.state.selectlist.publicPath);

  // 上層參數
  const showItemFrom = inject("showItemFrom");
  const nowCaseItemID = inject("nowCaseItemID"); // 校正件索引
  const nowCaseItemChop = inject("nowCaseItemChop");
  const nowCaseItemModel = inject("nowCaseItemModel");
  const nowCaseItemSN = inject("nowCaseItemSN");

  const nowCaseGnssID = inject("nowCaseGnssID");
  const nowCaseGnssChop = inject("nowCaseGnssChop");
  const nowCaseGnssModel = inject("nowCaseGnssModel");
  const nowCaseGnssSN = inject("nowCaseGnssSN");

  const nowCaseImuID = inject("nowCaseImuID");
  const nowCaseImuChop = inject("nowCaseImuChop");
  const nowCaseImuModel = inject("nowCaseImuModel");
  const nowCaseImuSN = inject("nowCaseImuSN");

  // 校正件列表
  const seletItemId = ref("");

  const selItemTypeID = ref("");
  const selItemTypeMU = ref([]);
  const selItemTypeDOM = ref();
  // 廠牌
  const selItemChop = ref("");
  const selItemChopMU = ref([]);
  const selItemChopDOM = ref();
  function updateItemChop(){
    let newoption = selItemChop.value;
    let findid = selItemChopMU.value.findIndex(x => x.value===newoption);
    if(findid===-1){
      let myarray=[];
      selItemChopMU.value.map(x=>{
        myarray.push({text: x.text, value: x.value});
      })
      new Promise((res,rej)=>{
        myarray.push({text: newoption, value: newoption});
        selItemChopMU.value = myarray;
        res(selItemChopMU.value);
      }).then(res=>{
        selItemChopDOM.value.setValue(newoption);
      });
    }
  }
  // 型號
  const selItemModel = ref("");
  const selItemModelMU = ref([]);
  const selItemModelDOM = ref();
  function updateItemModel(){
    let newoption = selItemModel.value;
    let findid = selItemModelMU.value.findIndex(x => x.value===newoption);
    if(findid===-1){
      let myarray=[];
      selItemModelMU.value.map(x=>{
        myarray.push({text: x.text, value: x.value});
      })
      new Promise((res,rej)=>{
        myarray.push({text: newoption, value: newoption});
        selItemModelMU.value = myarray;
        res(selItemModelMU.value);
      }).then(res=>{
        selItemModelDOM.value.setValue(newoption);
      });
    }
  }
  // 序號
  const selItemSN = ref("");

  const filterItemTypeID = ref("");
  const filterItemTypeMU = ref([]);
  const filterItemTypeDOM = ref();

  const filterItemChop = ref("");
  const filterItemChopMU = ref([]);
  const filterItemChopDOM = ref();

  const filterItemModel = ref("");
  const filterItemModelMU = ref([]);
  const filterItemModelDOM = ref();

  const filterItemSN = ref("");
//#endregion 參數==========end


//#region 校正件列表=========start
  let dtItem;
  const tableItem = ref();
  const dataItem = ref([]);
  // 設定表格tableItem
  const columnsItem = [
    { data: "id", title: "編號", defaultContent: "-" },
    { data: "chop", title: "廠牌", defaultContent: "-" },
    { data: "model", title: "型號", defaultContent: "-" },
    { data: "serial_number", title: "序號", defaultContent: "-" },
    { data: "item_type.type", title: "儀器類型", defaultContent: "-" },
  ];
  const tboptionItem = {
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

  // 查詢校正件資料
  const {
    mutate: refgetAllItem,
    onDone: getAllItemonDone,
    onError: getAllItemonError
  } = useMutation(ItemGQL.GETALLITEM);
  getAllItemonDone(result => {
    // 加入校正件資料
    if (!result.loading && result.data.getAllItem) {
      dataItem.value = result.data.getAllItem;
    }
  });
  getAllItemonError(e=>{errorHandle(e,infomsg,alert1)});

  // 查詢儀器類型
  const {
    mutate: refgetAllItemType,
    onDone: getAllItemTypeonDone,
    onError: getAllItemTypeonError
  } = useMutation(ItemGQL.GETALLITEMTYPE);
  getAllItemTypeonDone(result => {
    // 加入儀器類型選單資料
    if (!result.loading && result.data.getAllItemType) {
      // 資料區
      selItemTypeMU.value = result.data.getAllItemType.map(x => {
        return { text: x.type, value: parseInt(x.id) }
      }); selItemTypeMU.value.unshift({ text: "", value: "" });
      // 篩選區
      filterItemTypeMU.value = result.data.getAllItemType.map(x => {
        return { text: x.type, value: parseInt(x.id) }
      }); filterItemTypeMU.value.unshift({ text: "", value: "" });
    }
  });
  getAllItemTypeonError(e=>{errorHandle(e,infomsg,alert1)});


  // 查詢選取校正件資料
  const {
    mutate: refgetselItem,
    onDone: getselItemonDone,
    onError: getselItemonError,
  } = useMutation(ItemGQL.GETITEMBYID);
  getselItemonDone(result => {
    if (!result.loading && result && result.data.getItemByID) {
      let getData = result.data.getItemByID
      selItemChop.value = getData.chop;
      selItemChopDOM.value.setValue(selItemChop.value);
      selItemTypeID.value = getData.type;
      selItemTypeDOM.value.setValue(parseInt(getData.type));
      selItemModel.value = getData.model;
      selItemModelDOM.value.setValue(selItemModel.value);
      selItemSN.value = getData.serial_number;
    } else {
      selItemChop.value = "";
      selItemModel.value = "";
      selItemSN.value = "";
      if (selItemTypeDOM.value) {
        selItemTypeDOM.value.setValue("");
      }
    }
  });
  getselItemonError(e=>{errorHandle(e,infomsg,alert1)});

  // 開啟選擇校正件選單
  async function shownItemModal() {
    dtItem = tableItem.value.dt();
    dtItem.on('user-select', function ( e, dt, type, cell, originalEvent ) {
      let dtNowRowIndex = cell.index(this).row;
      let getData = dt.rows(dtNowRowIndex).data()[0];
      seletItemId.value = getData.id;
      refgetselItem({getItemByIdId: parseInt(seletItemId.value)});
    });

    // 載入儀器清單 更新下拉式選單
    await renewList();
    switch (iType.value) {
      case 6:
      case 1:
      case 2:
        if (nowCaseItemID.value) {
          seletItemId.value = nowCaseItemID.value;
          await selectDtItem();
          refgetselItem({getItemByIdId: parseInt(seletItemId.value)});
        }
        break;
      case 3:
        if (nowCaseGnssID.value) {
          seletItemId.value = nowCaseGnssID.value;
          await selectDtItem();
          refgetselItem({getItemByIdId: parseInt(seletItemId.value)});
        }
        break;
      case 4:
        if (nowCaseImuID.value) {
          seletItemId.value = nowCaseImuID.value;
          await selectDtItem();
          refgetselItem({getItemByIdId: parseInt(seletItemId.value)});
        }
        break;
    }
  }

  // 更新儀器清單及下拉式選單
  async function renewList(){
    const res_3 = await new Promise((res, rej) => {
      let where = {};
      where.type = iType.value;
      res(refgetAllItem(where));
    }).then(result => {
      // 建立廠牌型號下拉式選單
      let choplist = [];
      let modellist = [];
      // 廠牌清單
      choplist = result.data.getAllItem.map((x) => {
        return x.chop;
      }); //從物件陣列中取出成陣列
      choplist = [...new Set(choplist)]; //ES6排除重複值語法
      selItemChopMU.value = choplist.sort().map((x_1) => {
        return { text: x_1, value: x_1 };
      });
      selItemChopMU.value.unshift({ text: "", value: "" });

      // 型號清單
      modellist = result.data.getAllItem.map((x_2) => {
        return x_2.model;
      }); //從物件陣列中取出成陣列
      modellist = [...new Set(modellist)]; //ES6排除重複值語法
      selItemModelMU.value = modellist.sort().map((x_3) => {
        return { text: x_3, value: x_3 };
      });
      selItemModelMU.value.unshift({ text: "", value: "" });
      return refgetAllItemType();
    }).then(res_1 => {
      selItemTypeDOM.value.setValue(iType.value);
    });

    return res_3;
  }

  // 更新後保持該編號呈現選擇狀態
  async function selectDtItem(){
    dtItem.rows(function(idx,data,node){
      // console.log('itemid:',seletItemId.value);
      // console.log('d.id:',data.id);
      return data.id === seletItemId.value? true:false
    }).select();
  }

  // 儲存校正件資料
  const { mutate: saveItem, onDone: saveItemOnDone, onError: saveItemError } = useMutation(
    ItemGQL.SAVEITEM,
    () => ({
      variables: {
        updateItemId: (parseInt(seletItemId.value))?parseInt(seletItemId.value):-1,
        chop: selItemChop.value,
        model: selItemModel.value,
        serialNumber: selItemSN.value,
        type: parseInt(selItemTypeID.value),
      }
    })
  );

  saveItemOnDone(res=> {
    renewList().then(res_1=>{
      return refgetselItem({getItemByIdId: parseInt(seletItemId.value)});  
    }).then(res_2=>{
      return selectDtItem();
    })
  });
  saveItemError(e=>{errorHandle(e,infomsg,alert1)});

  // 更多編輯=>引導至校正件管理
  function gotoItemMG() {
    router.push('/cust');
  }

  // 案加入後回填校正件id
  function setItemBtn() {
    // console.log(iType.value);
    // console.log({
    //   seletItemId: seletItemId.value,
    //   selItemChop: selItemChop.value,
    //   selItemModel: selItemModel.value,
    //   selItemSN: selItemSN.value,
    // })
    switch (iType.value) {
      case 6:
      case 1:
      case 2:
        nowCaseItemID.value = seletItemId.value;
        nowCaseItemChop.value = selItemChop.value;
        nowCaseItemModel.value = selItemModel.value;
        nowCaseItemSN.value = selItemSN.value;
        break;
      case 3:
        nowCaseGnssID.value = seletItemId.value;
        nowCaseGnssChop.value = selItemChop.value;
        nowCaseGnssModel.value = selItemModel.value;
        nowCaseGnssSN.value = selItemSN.value;
        break;
      case 4:
        nowCaseImuID.value = seletItemId.value;
        nowCaseImuChop.value = selItemChop.value;
        nowCaseImuModel.value = selItemModel.value;
        nowCaseImuSN.value = selItemSN.value;
        break;
    }
    // console.log({
    //   nowCaseItemID: nowCaseItemID.value,
    //   nowCaseItemChop: nowCaseItemChop.value,
    //   nowCaseItemModel: nowCaseItemModel.value,
    //   nowCaseItemSN: nowCaseItemSN.value,
    // })

    showItemFrom.value = false;
  }
  // 新增按鈕(清空內容)
  function newItem(){
    seletItemId.value = null;
    selItemChop.value = null;
    selItemChopDOM.value.setValue(null);
    selItemModel.value = null;
    selItemModelDOM.value.setValue(null);
    selItemSN.value = null;
  }

//#endregion 校正件列表=========end

defineExpose({
  shownItemModal,
  setItemBtn,
});

</script>
<template>
  <MDBContainer fluid>
    <MDBRow>
      <!-- 校正件列表 -->
      <MDBCol col="12">
        <DataTable :data=" dataItem" :columns="columnsItem" :options="tboptionItem" ref="tableItem"
          style="font-size: smaller" class="display w-100 compact" />
      </MDBCol>
      <!-- 編輯 -->
      <MDBCol col="12" class="border border-1">
        <!-- 功能列 -->
        <div class="mt-2">
          <MDBBtn :disabled="!seletItemId" size="sm" color="primary" @click="newItem">新增</MDBBtn>
          <MDBBtn size="sm" color="primary" @click="saveItem">儲存</MDBBtn>
          <MDBBtn size="sm" color="primary" @click="gotoItemMG">校正件管理</MDBBtn>
        </div>
        <MDBRow>
          <MDBCol col="6" class="my-3 fs-6">
            目前編號:{{ seletItemId }}
          </MDBCol>
          <MDBSelect disabled size="sm" class="my-3  col-6" label="儀器類型" v-model:options="selItemTypeMU"
            v-model:selected="selItemTypeID" ref="selItemTypeDOM" />
          <!-- <div></div> -->
          <!-- <MDBCol col="6" class="mb-2">
            <MDBInput size="sm" type="text" label="廠牌" v-model="selItemChop" />
          </MDBCol> -->

          <MDBSelect filter size="sm" class="mb-2 col-6" 
            label="廠牌" 
            v-model:options="selItemChopMU"
            v-model:selected="selItemChop" 
            ref="selItemChopDOM"
            @close="updateItemChop()">
            <MDBInput size="sm" type="text" label="自訂新選項" v-model="selItemChop" />
          </MDBSelect>
          
          <!-- <MDBCol col="6" class="mb-2">
            <MDBInput size="sm" type="text" label="型號" v-model="selItemModel" />
          </MDBCol> -->

          <MDBSelect filter size="sm" class="mb-2 col-6" 
            label="型號" 
            v-model:options="selItemModelMU"
            v-model:selected="selItemModel" 
            ref="selItemModelDOM"
            @close="updateItemModel()">
            <MDBInput size="sm" type="text" label="自訂新選項" v-model="selItemModel" />
          </MDBSelect>

          <MDBCol col="12" class="mb-2">
            <MDBInput size="sm" type="text" label="序號" v-model="selItemSN" />
          </MDBCol>
        </MDBRow>
      </MDBCol>
    </MDBRow>
  </MDBContainer>
</template>