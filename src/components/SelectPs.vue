<script setup>
import { ref,onMounted } from "vue";
import path from "path-browserify";
import {
  MDBInput,
  MDBSwitch,
  MDBCol,
  MDBRow,
  MDBContainer,
  MDBSelect,
  MDBDatepicker,
  MDBBtn,
  MDBBtnClose,
} from 'mdb-vue-ui-kit';
import { useQuery, useMutation } from '@vue/apollo-composable';
import CaseGQL from "../graphql/Cases";

const props = defineProps({
  signData: Object
});

  // 出具報告
  // const nowCaseChkDate = ref(""); // 數據檢核日
  const nowCaseChkDateDOM = ref();

  const chkPersonID = ref(""); //數據檢核人
  const nowCaseChkPersonMU = ref([]);
  const nowCaseChkPersonDOM = ref();

  // const nowCaseSignDate = ref(""); // 報告簽署日
  const nowCaseSignDateDOM = ref();

  const signPersonID = ref(""); // 報告簽署人
  const nowCaseSignPersonMU = ref([]);
  const nowCaseSignPersonDOM = ref();

onMounted(()=>{
  nowCaseChkPersonDOM.value.setValue(props.signData.nowCaseChkPersonID);
  nowCaseSignPersonDOM.value.setValue(props.signData.nowCaseSignPersonID);
});

</script>
<template>
  <MDBContainer fluid>
    <MDBRow>
      <MDBCol col="4" class="my-3">
        <MDBDatepicker required size="sm" v-model="signData.nowCaseChkDate" format="YYYY-MM-DD" label="數據檢核日"
          ref="nowCaseChkDateDOM" />
      </MDBCol>

      <MDBSelect filter size="sm" class="my-3  col-6" label="數據檢核人" v-model:options="signData.nowCaseChkPersonMU"
        v-model:selected="chkPersonID" ref="nowCaseChkPersonDOM" />
      <div></div>
      <MDBCol col="4" class="mb-3">
        <MDBDatepicker required size="sm" v-model="signData.nowCaseSignDate" format="YYYY-MM-DD" label="報告簽署日"
          ref="nowCaseSignDateDOM" />
      </MDBCol>

      <MDBSelect filter size="sm" class="mb-3  col-6" label="報告簽署人" v-model:options="signData.nowCaseSignPersonMU"
        v-model:selected="signPersonID" ref="nowCaseSignPersonDOM" />
    </MDBRow>
  </MDBContainer>
</template>
