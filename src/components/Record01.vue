<script setup>
import { ref } from "vue";
import path from "path-browserify";
import {
  MDBRadio,
  MDBInput,
  MDBTextarea,
  MDBCol,
  MDBRow,
  MDBContainer,
  MDBSelect,
  MDBDatepicker,
  MDBBtn,
  MDBIcon,
  MDBBtnClose,
  MDBStepper,
  MDBStepperStep,
  MDBStepperHead,
  MDBStepperContent,
  MDBStepperForm,
} from 'mdb-vue-ui-kit';
import { useQuery, useMutation } from '@vue/apollo-composable';
import CaseGQL from "../graphql/Cases";
// 引入案件編號
const props = defineProps({
  caseID: String
});
// 案件詳細編輯資料==========start
  // 案件之詳細資料
  const isSMCam = ref(true);
  const nowCaseCamTypeID = ref(""); // 像機類型

  const nowCaseItemID = ref(""); // 校正件索引
  const nowCaseItemChop = ref(""); // 像機廠牌
  const nowCaseItemModel = ref(""); // 像機型號
  const nowCaseItemSN = ref(""); // 像機序號

  const nowCaseFocal = ref(""); // 焦距
  const nowCasePPAx = ref("");  // ppa_x
  const nowCasePPAy = ref("");  // ppa_y
  const nowCasePXw = ref(""); // 像元數量_寬(columns)(X)
  const nowCasePXh = ref(""); // 像元數量_高(rows)(Y)
  const nowCasePxSizeX = ref(""); // 像元尺寸X
  const nowCasePxSizeY = ref(""); // 像元尺寸Y
  const nowCaseSizeX = ref(""); // 元件尺寸X
  const nowCaseSizeY = ref(""); // 元件尺寸Y
  const nowCaseDistSoft = ref(""); // 畸變差糾正軟體
  const nowCaseDistVer = ref(""); // 畸變差糾正軟體版本

  const nowCasePlanY = ref(""); // 預定拍攝年
  const nowCasePlanM = ref(""); // 預定拍攝月
  const nowCaseGSD = ref(""); // 地元尺寸
  const nowCaseStripsNS = ref(""); // 南北航線數
  const nowCaseStripsEW = ref(""); // 東西航線數
  const nowCaseEndLap = ref(""); // 前後重疊率
  const nowCaseSideLap = ref(""); // 側向重疊率
  const nowCaseEllH = ref(""); // 飛航橢球高
  const nowCaseAGL = ref(""); // 飛航離地高
  const nowCaseCamReport = ref(""); // 像機率定報告
  const nowCasePlanMap = ref(""); // 航線規劃圖
  

  // 查詢Record01資料
const { result: nowCaseF, loading: lodingnowCaseF, onResult: getNowCaseF, refetch: refgetNowCaseF } = useQuery(
  CaseGQL.GETFULLCASEBYID,
  () => ({
    getCasebyIdId: props.caseID
  })
);
getNowCaseF(result => {
  if (!result.loading && result && result.data.getCasebyID) {
    // 填入資料
    let getData = result.data.getCasebyID.case_record_01;
    let getItem = result.data.getCasebyID.item_base;
    (result.data.getCasebyID.cal_type === 3) ? isSMCam.value = true : isSMCam.value = false;
    // 校正件資料
    nowCaseCamTypeID.value = getData.cam_type + "";
    nowCaseItemChop.value = (getItem)?getItem.chop:"";
    nowCaseItemModel.value = (getItem) ? getItem.model : "";
    nowCaseItemSN.value = (getItem) ? getItem.serial_number : "";
    nowCaseFocal.value = getData.focal;
    nowCasePPAx.value = getData.ppa_x;
    nowCasePPAy.value = getData.ppa_y;
    nowCasePXh.value = getData.px_h;
    nowCasePXw.value = getData.px_w;
    nowCasePxSizeX.value = getData.px_size_x;
    nowCasePxSizeY.value = getData.px_size_y;
    nowCaseSizeX.value = getData.size_x;
    nowCaseSizeY.value = getData.size_y;
    nowCaseDistSoft.value = getData.distor_corr_soft;
    nowCaseDistVer.value = getData.distor_corr_ver;
    // 飛航規劃
    nowCasePlanY.value = getData.plan_year;
    nowCasePlanM.value = getData.plan_month;
    nowCaseGSD.value = getData.gsd;
    nowCaseEllH.value = getData.ell_height;
    nowCaseAGL.value = getData.agl;
    // 檢附資料
    nowCaseCamReport.value = getData.cam_report;
    nowCasePlanMap.value = getData.plan_map;
  }
});
refgetNowCaseF();

function comSensorSize(){
  nowCaseSizeX.value = (parseFloat(nowCasePxSizeX.value) * parseFloat(nowCasePXw.value)/1000).toFixed(4);
  nowCaseSizeY.value = (parseFloat(nowCasePxSizeY.value) * parseFloat(nowCasePXh.value) / 1000).toFixed(4);
}

// 案件詳細編輯資料==========end


</script>
<template>
  <!-- record01表單 -->
  <div>
    <MDBStepper>
      <MDBStepperForm>
        <MDBStepperStep active>
          <MDBStepperHead icon="1">
            申請
          </MDBStepperHead>
          <MDBStepperContent>
            <MDBRow>
              <MDBCol col="12" class="border mt-0">
                像機類型：
                <MDBRadio label="大像幅" value="1" v-model="nowCaseCamTypeID" inline name="caseCamType" />
                <MDBRadio label="小像幅" value="2" v-model="nowCaseCamTypeID" inline name="caseCamType" />
              </MDBCol>
            </MDBRow>
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
                  <MDBCol col="4" class="mb-3">
                    <MDBInput size="sm" type="text" label="焦距" v-model="nowCaseFocal" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput size="sm" type="text" label="像主點_X" v-model="nowCasePPAx" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput size="sm" type="text" label="像主點_Y" v-model="nowCasePPAy" />
                  </MDBCol>
                  <MDBCol col="3" class="mb-3">
                    <MDBInput size="sm" type="text" label="像元數(rows)" v-model="nowCasePXh" />
                  </MDBCol>
                  <MDBCol col="3" class="mb-3">
                    <MDBInput size="sm" type="text" label="像元數(columns)" v-model="nowCasePXw" />
                  </MDBCol>
                  <MDBCol col="3" class="mb-3">
                    <MDBInput size="sm" type="text" label="像元尺寸_x(um)" v-model="nowCasePxSizeX" />
                  </MDBCol>
                  <MDBCol col="3" class="mb-3">
                    <MDBInput size="sm" type="text" label="像元尺寸_y(um)" v-model="nowCasePxSizeY" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput size="sm" type="text" label="感應器尺寸_x(mm)" v-model="nowCaseSizeX" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput size="sm" type="text" label="感應器尺寸_y(mm)" v-model="nowCaseSizeY" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3 ps-0">
                    <MDBBtn size="sm" color="primary" @click="comSensorSize()">計算尺寸</MDBBtn>
                  </MDBCol>
                  <MDBCol col="12">
                    <MDBRow v-show="isSMCam">
                      <MDBCol col="4" class="mb-3">
                        <MDBInput size="sm" type="text" label="畸變差糾正軟體" v-model="nowCaseDistSoft" />
                      </MDBCol>
                      <MDBCol col="4" class="mb-3">
                        <MDBInput size="sm" type="text" label="軟體版本" v-model="nowCaseDistVer" />
                      </MDBCol>
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
                    <MDBInput size="sm" type="text" label="地元尺寸GSD" v-model="nowCaseGSD" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput size="sm" type="text" label="南北航線數" v-model="nowCaseStripsNS" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput size="sm" type="text" label="東西航線數" v-model="nowCaseStripsEW" />
                  </MDBCol>
                  <div></div>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput size="sm" type="text" label="前後重疊率 %" v-model="nowCaseEndLap" />
                  </MDBCol>
                  <MDBCol col="4" class="mb-3">
                    <MDBInput size="sm" type="text" label="側向重疊率 %" v-model="nowCaseSideLap" />
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
                </MDBRow>
              </MDBCol>
              <MDBCol col="12" class="rounded-top-5 bg-info text-white">
                檢附資料
              </MDBCol>
              <MDBCol col="12" class="mb-3 border rounded-bottom-5">
                <MDBRow>
                  <!-- 率定報告 -->
                  <MDBCol col="9" class="my-2">
                    <MDBInput style="padding-right: 2.2em;" size="sm" type="text" readonly label="像機率定報告"
                      v-model="nowCaseCamReport">
                      <MDBBtnClose @click.prevent="nowCaseCamReport =''" class="btn-upload-close" />
                    </MDBInput>
                  </MDBCol>
                  <MDBCol col="3" class="px-0 my-2">
                    <input type="file" accept=".pdf" id="itemCamReportUpload" @change="" style="display: none;" />
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
                    <input type="file" accept=".pdf" id="itemCamPlanUpload" @change="" style="display: none;" />
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
            送校內容01
          </MDBStepperContent>
        </MDBStepperStep>
        <MDBStepperStep>
          <MDBStepperHead icon="3">
            校正
          </MDBStepperHead>
          <MDBStepperContent>
            校正內容01
          </MDBStepperContent>
        </MDBStepperStep>
        <MDBStepperStep>
          <MDBStepperHead icon="4">
            出具報告
          </MDBStepperHead>
          <MDBStepperContent>
            報告內容01
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
