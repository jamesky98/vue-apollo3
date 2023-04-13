<script setup>
import { ref, onMounted, inject } from "vue";
import path from "path-browserify";
import {
  MDBRow,
  MDBContainer,
  MDBSelect,
} from 'mdb-vue-ui-kit';
// 取得權限
const rGroup = inject("rGroup");
  // 不確定度選用模組
  const selectReportTemp = inject('selectReportTemp');
  const nowCaseReportTemp = inject('nowCaseReportTemp');
  const nowCaseReportTempMU = inject('nowCaseReportTempMU');
  const nowCaseReportTempDOM = ref();

onMounted(()=>{
  selectReportTemp.value = nowCaseReportTemp.value;
  nowCaseReportTempDOM.value.setValue(nowCaseReportTemp.value);
});

function doreNew(){
  nowCaseReportTempDOM.value.setValue(nowCaseReportTemp.value);
}

defineExpose({
  doreNew,
});

</script>
<template>
  <MDBSelect 
    :disabled="!rGroup[2]" 
    size="sm" class="mb-3 col-12" 
    label="選用報告範本" 
    v-model:options="nowCaseReportTempMU"
    v-model:selected="selectReportTemp" ref="nowCaseReportTempDOM" />
</template>
