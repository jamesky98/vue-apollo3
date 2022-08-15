<script setup>
import { ref } from "vue";
import path from "path-browserify";
import {
  MDBInput,
  MDBSwitch,
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
import { computed } from "@vue/reactivity";
// 引入案件編號
const props = defineProps({
  caseID: String
});
// 案件詳細編輯資料==========start
  // 案件之詳細資料
  const isFullPara = ref(true);
  const switchLabel = computed(() => {
    return (isFullPara.value)?"具完整規格":"具整合精度";
  });
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
  if (!result.loading && result && result.data.getCasebyID.case_record_02) {
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
    (getData.type === 1) ? isFullPara.value = true : isFullPara.value = false;

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
  <div>
    <MDBStepper>
      <MDBStepperForm>
        <MDBStepperStep active>
          <MDBStepperHead icon="1">
            申請
          </MDBStepperHead>
          <MDBStepperContent>
            <MDBRow>
              <MDBCol col="12" class="mt-3 rounded-top-5 bg-info text-white">
                校正件
              </MDBCol>
              <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                <MDBRow>
                  <MDBCol col="12" class="my-3">
                    <MDBBtn size="sm" color="primary" @click="">查詢校正件</MDBBtn>
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput disabled size="sm" type="text" label="廠牌" v-model="nowCaseItemChop" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput disabled size="sm" type="text" label="型號" v-model="nowCaseItemModel" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput disabled size="sm" type="text" label="序號" v-model="nowCaseItemSN" />
                  </MDBCol>
                </MDBRow>
              </MDBCol>
              <MDBCol col="12">
                <MDBSwitch :label="switchLabel" v-model="isFullPara" />
              </MDBCol>
              <MDBCol v-show="isFullPara">
                <MDBRow>
                  <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                    各項參數
                  </MDBCol>
                  <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                    <MDBRow>

                    </MDBRow>
                  </MDBCol>
                </MDBRow>
              </MDBCol>
              <MDBCol v-show="!isFullPara">
                <MDBRow>
                  <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                    整合精度
                  </MDBCol>
                  <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                    <MDBRow>

                    </MDBRow>
                  </MDBCol>
                </MDBRow>
              </MDBCol>
              <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                飛航規劃
              </MDBCol>
              <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                <MDBRow>
                  <MDBCol col="4" class="my-3">
                    <MDBInput size="sm" type="text" label="預定拍攝年(民國)" v-model="nowCasePlanY" />
                  </MDBCol>
                  <MDBCol col="4" class="my-3">
                    <MDBInput size="sm" type="text" label="預定拍攝月" v-model="nowCasePlanM" />
                  </MDBCol>

                  <MDBCol col="4" class="my-3">
                    <MDBInput size="sm" type="text" label="航帶總數" v-model="nowCaseStrips" />
                  </MDBCol>

                  <div></div>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput size="sm" type="text" label="飛航橢球高" v-model="nowCaseEllH" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput size="sm" type="text" label="飛航離地高(AGL)" v-model="nowCaseAGL" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <div style="color: red;" class="border border-danger">※AGL = 橢球高 - 195 m</div>
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput size="sm" type="text" label="點雲密度" v-model="nowCasePtDensity" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput size="sm" type="text" label="FOV" v-model="nowCaseFOV" />
                  </MDBCol>
                </MDBRow>
              </MDBCol>
              <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                檢附資料
              </MDBCol>
              <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                <MDBRow>
                  <!-- 光達規格 -->
                  <MDBCol col="9" class="my-2">
                    <MDBInput style="padding-right: 2.2em;" size="sm" type="text" readonly label="光達規格"
                      v-model="nowCaseLrReport">
                      <MDBBtnClose @click.prevent="nowCaseLrReport =''" class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 my-2">
                    <input type="file" accept=".pdf" id="itemLrReportUpload" @change="" style="display: none;" />
                    <MDBBtn size="sm" color="primary" @click="">上傳</MDBBtn>
                    <MDBBtn size="sm" color="secondary" @click="">下載</MDBBtn>
                  </MDBCol>
                  <div></div>
                  <!-- POS規格 -->
                  <MDBCol col="9" class="my-2">
                    <MDBInput style="padding-right: 2.2em;" size="sm" type="text" readonly label="POS規格"
                      v-model="nowCasePosReport">
                      <MDBBtnClose @click.prevent="nowCasePosReport =''" class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 my-2">
                    <input type="file" accept=".pdf" id="itemPOSReportUpload" @change="" style="display: none;" />
                    <MDBBtn size="sm" color="primary" @click="">上傳</MDBBtn>
                    <MDBBtn size="sm" color="secondary" @click="">下載</MDBBtn>
                  </MDBCol>
                  <div></div>
                  <!-- 規劃圖 -->
                  <MDBCol col="9" class="mb-2">
                    <MDBInput style="padding-right: 2.2em;" size="sm" type="text" readonly label="航線規劃圖"
                      v-model="nowCasePlanMap">
                      <MDBBtnClose @click.prevent="nowCasePlanMap =''" class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 mb-2">
                    <input type="file" accept=".pdf" id="itemLrPlanUpload" @change="" style="display: none;" />
                    <MDBBtn size="sm" color="primary" @click="">上傳</MDBBtn>
                    <MDBBtn size="sm" color="secondary" @click="">下載</MDBBtn>
                  </MDBCol>
                </MDBRow>
              </MDBCol>
            </MDBRow>
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
  </div>
</template>
<style>

.rounded-top-5 {
  border-top-right-radius: 0.5rem !important;
  border-top-left-radius: 0.5rem !important;
}

.rounded-top-7 {
  border-top-right-radius: 1rem !important;
  border-top-left-radius: 1rem !important;
}

.rounded-bottom-5 {
  border-bottom-right-radius: 0.5rem !important;
  border-bottom-left-radius: 0.5rem !important;
}

.rounded-bottom-7 {
  border-bottom-right-radius: 1rem !important;
  border-bottom-left-radius: 1rem !important;
}

.btn-upload-close {
  position: absolute;
  top: 0.25em;
  right: 0.25em;
}

.py-3 {
  padding-top: 0rem !important;
  padding-bottom: 0rem !important;
}
</style>
