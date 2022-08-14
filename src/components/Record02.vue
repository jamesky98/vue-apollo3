<script setup>
import { ref } from "vue";
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
  MDBIcon,
  MDBStepper,
  MDBStepperStep,
  MDBStepperHead,
  MDBStepperContent,
  MDBStepperForm,
} from 'mdb-vue-ui-kit';
</script>
<template>
  <!-- record02表單 -->
  <MDBStepper linear>
    <MDBStepperForm>
      <MDBStepperStep active>
        <MDBStepperHead icon="1">
          申請
        </MDBStepperHead>
        <MDBStepperContent>
          申請內容02
        </MDBStepperContent>
      </MDBStepperStep>
      <MDBStepperStep>
        <MDBStepperHead icon="2">
          送校
        </MDBStepperHead>
        <MDBStepperContent>
          送校內容02
        </MDBStepperContent>
      </MDBStepperStep>
      <MDBStepperStep>
        <MDBStepperHead icon="3">
          校正
        </MDBStepperHead>
        <MDBStepperContent>
          校正內容02
        </MDBStepperContent>
      </MDBStepperStep>
      <MDBStepperStep>
        <MDBStepperHead icon="4">
          出具報告
        </MDBStepperHead>
        <MDBStepperContent>
          報告內容02
        </MDBStepperContent>
      </MDBStepperStep>
    </MDBStepperForm>
  </MDBStepper>
</template>
