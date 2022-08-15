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
import { useQuery, useMutation } from '@vue/apollo-composable';
import CaseGQL from "../graphql/Cases";
// 引入案件編號
defineProps({
  caseID: { type: String }
})
// 案件詳細編輯資料==========start
  // 案件之詳細資料

  const nowCaseItemID = ref(""); // 校正件索引
  const nowCaseItemChop = ref(""); // 光達廠牌
  const nowCaseItemModel = ref(""); // 光達型號
  const nowCaseItemSN = ref(""); // 光達序號

  const nowCaseParaType = ref("");  // 規格參數類型1:各項均有 2:整合精度

  const nowCaseLrDisPrs = ref("");  // LIDAR設備測距精度
  const nowCaseLrAngResol = ref("");  // LIDAR設備掃描角解析度
  const nowCaseLrBeam = ref("");  // LIDAR設備發散角

  const nowCaseGnssID = ref("");  // GNSS設備索引
  const nowCaseGnssChop = ref("");  // GNSS設備廠牌
  const nowCaseGnssModel = ref("");  // GNSS設備型號
  const nowCaseGnssSN = ref("");  // GNSS設備序號
const nowCaseGnssPrcH = ref("");  // GNSS設備水平精度 或 整合型平面精度
const nowCaseGnssPrcV = ref("");  // GNSS設備高程精度 或 整合型高程精度

  const nowCaseImuID = ref("");  // IMU設備索引
  const nowCaseImuChop = ref("");  // IMU設備廠牌
  const nowCaseImuModel = ref("");  // IMU設備型號
  const nowCaseImuSN = ref("");  // IMU設備序號
  const nowCaseImuOmg = ref("");  // IMU設備Omega精度
  const nowCaseImuPhi = ref("");  // IMU設備Phi精度
  const nowCaseImuKap = ref("");  // IMU設備Kappa精度
  const nowCaseImuPrcO = ref("");  // IMU設備姿態角解析度

  const nowCasePlanY = ref(""); // 預定拍攝年
  const nowCasePlanM = ref(""); // 預定拍攝月
  const nowCaseStrips = ref(""); // 航帶總數
  const nowCaseEllH = ref(""); // 飛航橢球高
  const nowCaseAGL = ref(""); // 飛航離地高

  const nowCasePtDensity = ref(""); // 單航帶點雲密度
  const nowCaseFOV = ref(""); // 最大掃描角FOV

  const nowCaseLrReport = ref(""); // LiDAR規格
  const nowCasePosReport = ref(""); // POS規格
  const nowCasePlanMap = ref(""); // 航線規劃圖

  // 查詢Record02資料
const { result: nowCaseF, loading: lodingnowCaseF, onResult: getNowCaseF, refetch: refgetNowCaseF } = useQuery(
  CaseGQL.GETFULLCASEBYID,
  () => ({
    getCasebyIdId: props.caseID
  })
);
getNowCaseF(result => {
  if (!result.loading && result && result.data.getCasebyID) {
    // 填入資料
    let getData = result.data.getCasebyID.case_record_02;
    let getItem = result.data.getCasebyID.item_base;
    let getGNSS = result.data.getCasebyID.case_record_02.item_base_case_record_02_gnss_idToitem_base;
    let getIMU = result.data.getCasebyID.case_record_02.item_base_case_record_02_imu_idToitem_base;
    // 校正件資料
    nowCaseItemChop.value = (getItem) ? getItem.chop : "";
    nowCaseItemModel.value = (getItem) ? getItem.model : "";
    nowCaseItemSN.value = (getItem) ? getItem.serial_number : "";
    // 參數型態
    nowCaseParaType.value = getData.type;
    // LiDAR規格
    nowCaseLrDisPrs.value = getData.dis_presision;
    nowCaseLrAngResol.value = getData.ang_resolution;
    nowCaseLrBeam.value = getData.beam;
    // GNSS規格
    nowCaseGnssChop.value = (getGNSS) ? getGNSS.chop:"";
    nowCaseGnssModel.value = (getGNSS) ? getGNSS.model : "";
    nowCaseGnssSN.value = (getGNSS) ? getGNSS.serial_number : "";
    nowCaseGnssPrcH.value = getData.prec_h; // 等同整合型平面精度
    nowCaseGnssPrcV.value = getData.prec_v; // 等同整合型高程精度
    // IMU規格
    nowCaseImuChop.value = (getIMU) ? getIMU.chop:"";
    nowCaseImuModel.value = (getIMU) ? getIMU.model : "";
    nowCaseImuSN.value = (getIMU) ? getIMU.serial_number : "";
    nowCaseImuOmg.value = getData.omega;
    nowCaseImuPhi.value = getData.phi;
    nowCaseImuKap.value = getData.kappa;
    nowCaseImuPrcO.value = getData.prec_ori;
    // 飛航規劃
    nowCasePlanY.value = getData.plan_year;
    nowCasePlanM.value = getData.plan_month;
    nowCaseStrips.value = getData.strips_no
    nowCaseEllH.value = getData.ell_height;
    nowCaseAGL.value = getData.agl;
    nowCasePtDensity.value = getData.cloud_density;
    nowCaseFOV.value = getData.fov;
    // 檢附資料
    nowCaseLrReport.value = getData.lidar_report;
    nowCasePosReport.value = getData.pos_report;
    nowCasePlanMap.value = getData.plan_map;
  }
});
refgetNowCaseF();
// 案件詳細編輯資料==========end

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
