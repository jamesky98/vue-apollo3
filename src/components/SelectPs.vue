<script setup>
import { ref, onMounted, inject } from "vue";
import {
  MDBCol,
  MDBRow,
  MDBContainer,
  MDBSelect,
  MDBDatepicker,
} from 'mdb-vue-ui-kit';
// 取得權限
const rGroup = inject("rGroup");
  // 出具報告
  const nowCaseChkDate = inject('nowCaseChkDate'); // 數據檢核日
  const nowCaseChkDateDOM = ref();

  const selectChkPersonID = inject('selectChkPersonID'); //數據檢核人
  const nowCaseChkPersonID = inject('nowCaseChkPersonID');
  const nowCaseChkPersonMU = inject('nowCaseChkPersonMU');
  const nowCaseChkPersonDOM = ref();

  const nowCaseSignDate = inject('nowCaseSignDate'); // 報告簽署日
  const nowCaseSignDateDOM = ref();

  const selectSignPersonID = inject('selectSignPersonID'); // 報告簽署人
  const nowCaseSignPersonID = inject('nowCaseSignPersonID');
  const nowCaseSignPersonMU = inject('nowCaseSignPersonMU');
  const nowCaseSignPersonDOM = ref();

onMounted(()=>{
  nowCaseChkPersonDOM.value.setValue(nowCaseChkPersonID.value);
  nowCaseSignPersonDOM.value.setValue(nowCaseSignPersonID.value);

  if(nowCaseChkDate.value===""){nowCaseChkDateDOM.value.inputValue=""}
  if(nowCaseSignDate.value===""){nowCaseSignDateDOM.value.inputValue=""}
});

</script>
<template>
  <MDBContainer fluid>
    <MDBRow>
      <MDBCol lg="6" class="mt-3">
        <MDBDatepicker required size="sm" v-model="nowCaseChkDate" format="YYYY-MM-DD" label="數據檢核日"
          ref="nowCaseChkDateDOM" />
      </MDBCol>

      <MDBSelect :disabled="!rGroup[3]" filter size="sm" class="mt-3 col-lg-6" label="數據檢核人" v-model:options="nowCaseChkPersonMU"
        v-model:selected="selectChkPersonID" ref="nowCaseChkPersonDOM" />
      <div></div>
      <MDBCol lg="6" class="mt-3">
        <MDBDatepicker required size="sm" v-model="nowCaseSignDate" format="YYYY-MM-DD" label="報告簽署日"
          ref="nowCaseSignDateDOM" />
      </MDBCol>

      <MDBSelect :disabled="!rGroup[3]" filter size="sm" class="mt-3 col-lg-6" label="報告簽署人" v-model:options="nowCaseSignPersonMU"
        v-model:selected="selectSignPersonID" ref="nowCaseSignPersonDOM" />
    </MDBRow>
  </MDBContainer>
</template>
