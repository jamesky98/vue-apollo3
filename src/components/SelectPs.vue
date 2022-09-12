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
});

</script>
<template>
  <MDBContainer fluid>
    <MDBRow>
      <MDBCol col="4" class="my-3">
        <MDBDatepicker required size="sm" v-model="nowCaseChkDate" format="YYYY-MM-DD" label="數據檢核日"
          ref="nowCaseChkDateDOM" />
      </MDBCol>

      <MDBSelect :disabled="!rGroup[1]" filter size="sm" class="my-3 col-6" label="數據檢核人" v-model:options="nowCaseChkPersonMU"
        v-model:selected="selectChkPersonID" ref="nowCaseChkPersonDOM" />
      <div></div>
      <MDBCol col="4" class="mb-3">
        <MDBDatepicker required size="sm" v-model="nowCaseSignDate" format="YYYY-MM-DD" label="報告簽署日"
          ref="nowCaseSignDateDOM" />
      </MDBCol>

      <MDBSelect :disabled="!rGroup[1]" filter size="sm" class="mb-3 col-6" label="報告簽署人" v-model:options="nowCaseSignPersonMU"
        v-model:selected="selectSignPersonID" ref="nowCaseSignPersonDOM" />
    </MDBRow>
  </MDBContainer>
</template>
