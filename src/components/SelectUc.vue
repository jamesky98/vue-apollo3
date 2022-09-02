<script setup>
import { ref, onMounted, inject } from "vue";
import path from "path-browserify";
import {
  MDBRow,
  MDBContainer,
  MDBSelect,
} from 'mdb-vue-ui-kit';

  // 不確定度選用模組
  const selectUcModel = inject('selectUcModel');
  const nowCaseUcModel = inject('nowCaseUcModel');
  const nowCaseUcModelMU = inject('nowCaseUcModelMU');
  const nowCaseUcModelDOM = ref();

onMounted(()=>{
  nowCaseUcModelDOM.value.setValue(nowCaseUcModel.value);
});

</script>
<template>
  <MDBSelect filter size="sm" class="mb-3 col-4" label="不確定度選用模組" v-model:options="nowCaseUcModelMU"
    v-model:selected="selectUcModel" ref="nowCaseUcModelDOM" />
</template>
