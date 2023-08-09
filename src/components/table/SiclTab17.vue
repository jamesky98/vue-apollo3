<script setup>
// 作業紀錄表(適用車載光達)
import { ref } from 'vue';
import { computed } from "@vue/reactivity";
import { useMutation } from '@vue/apollo-composable';
import CaseGQL from "../../graphql/Cases";
import { errorHandle, logIn, logOut, toTWDate } from '../../methods/User';

// 引入案件編號
const props = defineProps({
  caseID: String
});
const infomsg = ref('');
const alert1 =ref(false);
const isFullPara = ref(true);
const nowCaseCalTypeCode = ref(""); //校正項目代碼
const tableID = computed(() => { return props.caseID.slice(0, -2) }); //申請單編號
const itemID = computed(() => { return props.caseID.slice(-2) }); //校正件編號
const nowCaseStartDate = ref(""); // 開始日期
const startDateStr = computed(() => {
  let dateArray = nowCaseStartDate.value.split("-");
  return dateArray[0] - 1911 + "年" + dateArray[1] + "月" + dateArray[2] + "日"
})

const nowCaseScanDate = ref(""); // 航拍日期
const scanDateStr = computed(() => {
  let dateArray = nowCaseScanDate.value.split("-");
  return dateArray[0] - 1911 + "年" + dateArray[1] + "月" + dateArray[2] + "日"
})

const nowCaseStripsAc = ref(""); // 實際航帶總數

const nowCaseAGLac = ref(""); // 實際離地高AGL
const nowCaseFOVac = ref(""); // 最大掃描角FOV
const nowCasePtDensityac = ref(""); // 單航帶點雲密度

const nowCaseRefPrjCode = ref(""); // 量測作業編號編號
const nowCaseRefPrjPublishDate = ref(""); // 參考值發布日期
const refPubDateStr = computed(() => {
  let dateArray = nowCaseRefPrjPublishDate.value.split("-");
  return dateArray[0] - 1911 + "年" + dateArray[1] + "月" + dateArray[2] + "日"
})

const nowCaseLrDisPrs = ref("");  // LIDAR設備測距精度
const nowCaseLrBeam = ref("");  // LIDAR設備發散角
const nowCaseLrAngResol = ref("");  // LIDAR設備掃描角解析度

const nowCaseGnssPrcH = ref("");  // GNSS設備水平精度 或 整合型平面精度
const nowCaseGnssPrcV = ref("");  // GNSS設備高程精度 或 整合型高程精度

const nowCaseImuOmg = ref("");  // IMU設備Omega精度
const nowCaseImuPhi = ref("");  // IMU設備Phi精度
const nowCaseImuKap = ref("");  // IMU設備Kappa精度
const nowCaseImuPrcO = ref("");  // IMU設備姿態角解析度
const nowCaseCalResult = ref(""); //計算成果表
const pt_Data = ref([]);
const nowCaseSTDh = ref(""); //水平不確定度(自動計算)
const nowCaseSTDv = ref(""); //高程不確定度(自動計算)
const nowCaseCloudDate = ref(""); // 掃描成果檢核
const nowCaseCloudAvg  = computed(() => {
  let sumV = 0;
  let total = 0;
  if(!nowCaseCloudDate.value){return ''}
  nowCaseCloudDate.value.forEach(x=>{
    if(parseFloat(x.PtDensity)){
      sumV = sumV + parseFloat(x.PtDensity);
      total = total + 1;
    }
  });
  // console.log(nowCaseCloudDate.value);
  return (total==0)?'':(sumV / total).toFixed(2);
});

// 查詢Case_Record資料
const { 
  onDone: getNowCaseF, 
  mutate: refgetNowCaseF, 
  onError: getNowCaseFonError
} = useMutation(
  CaseGQL.GETFULLCASEBYID,
  () => ({
    variables: {
      getCasebyIdId: props.caseID
    }
  })
);
getNowCaseFonError(e=>{errorHandle(e,infomsg,alert1)});
getNowCaseF(result => {
  if (!result.loading && result && result.data.getCasebyID) {
    // 填入資料
    let getData = result.data.getCasebyID;
    let getRecord = result.data.getCasebyID.case_record_03;
    let getCust = result.data.getCasebyID.cus;
    let getItem = result.data.getCasebyID.item_base;
    let getOpt = result.data.getCasebyID.employee_case_base_operators_idToemployee;
    (getRecord.type === 1) ? isFullPara.value = true : isFullPara.value = false;
    nowCaseCalTypeCode.value = (result.data.getCasebyID.cal_type_cal_typeTocase_base) ? result.data.getCasebyID.cal_type_cal_typeTocase_base.code : "";
    nowCaseStartDate.value = (getRecord.start_Date) ? getRecord.start_Date.split("T")[0] : "";
    nowCaseScanDate.value = (getRecord.scan_date) ? getRecord.scan_date.split("T")[0] : "";
    nowCaseStripsAc.value = getRecord.strips_no_ac;

    nowCaseAGLac.value = getRecord.agl_ac;
    nowCaseFOVac.value = getRecord.fov_ac;
    nowCasePtDensityac.value = getRecord.cloud_density_ac;

    nowCaseRefPrjCode.value = (getRecord.ref_project) ? getRecord.ref_project.project_code : "";
    nowCaseRefPrjPublishDate.value = (getRecord.ref_project) ? getRecord.ref_project.publish_date.split("T")[0] : "";

    nowCaseLrDisPrs.value = getRecord.dis_presision;
    nowCaseLrBeam.value = getRecord.beam;
    nowCaseLrAngResol.value = getRecord.ang_resolution;
    nowCaseGnssPrcH.value = getRecord.prec_h;
    nowCaseGnssPrcV.value = getRecord.prec_v;

    nowCaseImuOmg.value = getRecord.omega;
    nowCaseImuPhi.value = getRecord.phi;
    nowCaseImuKap.value = getRecord.kappa;
    nowCaseImuPrcO.value = getRecord.prec_ori;
    nowCaseCalResult.value = getRecord.recal_table? getRecord.recal_table : null;
    nowCaseCloudDate.value = nowCaseCalResult.value.stripdata;
    console.log(nowCaseCloudDate.value);

    let myArray = [];
    for(let key in nowCaseCalResult.value.data){
      myArray.push({gcp_id:key,...nowCaseCalResult.value.data[key]});
    }
    pt_Data.value = myArray;
    // console.log(pt_Data.value);
    nowCaseSTDh.value = getRecord.std_h;
    nowCaseSTDv.value = getRecord.std_v;

    
  }
});
refgetNowCaseF();
</script>

<template>

  <div class="header fstyle02 w-100">
    <div>內政部國土測繪中心　測量儀器校正實驗室</div>
  </div>
  <div class="footer fstyle02 w-100">
    <table width="100%" style="border: hidden;">
      <tr>
        <td width="33%" style="text-align: left;border: hidden;">文件編號：SICL-4-83-0</td>
        <td width="33%" style="text-align: center;border: hidden;">/3</td>
        <td style="text-align: right;border: hidden;">版次：1.0</td>
      </tr>
    </table>
  </div>
  <div class="page-gap"></div>
  <div class="page">
      <!-- 表單名稱 -->
      <div class="fstyle01">
        <div class="fstyle01C" style="margin-bottom: 10px;">車載光達校正作業紀錄表</div>
      </div>
      <div class="fstyle02">編號：</div>
      <table width="100%" cellspacing=0 cellpadding=0>
        <tr>
          <th colspan="3">
            <table width="100%" cellspacing=0 cellpadding=0>
              <!-- 申請表資料 -->
              <tr>
                <td scope="col" width="38%" class="fstyle02 nowrap tdborder-t2 tdborder-l2 tdborder-r2">
                  申請單編號：{{tableID}}
                </td>
                
                <td scope="col" width="38%" class="fstyle02 nowrap tdborder-t2 tdborder-r2 tdborder-b">
                  作業開始日期：{{startDateStr}}　　時　　分
                </td>
              </tr>
              <tr>
                <td scope="col" class="fstyle02 nowrap tdborder-b2 tdborder-t2 tdborder-l2 tdborder-r2">
                  校正件編號：{{itemID}}
                </td>
                <td scope="col" width="38%" class="fstyle02 nowrap tdborder-b2 tdborder-r2">
                  作業完成日期：　　年　　月　　日　　時　　分
                </td>
              </tr>
            </table>
          </th>
        </tr>
        <!-- 作業紀錄 -->
        <tr>
          <th colspan="3">
            <table width="100%">
              <tr>
                <td colspan="4" scope="col" class="p-2 fstyle02mid bggray2 tdborder-l2 tdborder-r2">
                  <strong>基本資料</strong>
                </td>
              </tr>
              <tr>
                <td colspan="4" scope="col" class="fstyle02 tdborder-t tdborder-l2 tdborder-b tdborder-r2">
                  （1）掃描日期：{{scanDateStr}}
                </td>
              </tr>
              <tr>
                <td colspan="4" scope="col" class="fstyle02 tdborder-t tdborder-l2 tdborder-b tdborder-r2">
                  （2）掃描軌跡總數：{{nowCaseStripsAc}}條
                </td>
              </tr>
              <tr>
                <td colspan="4" scope="col" class="fstyle02 tdborder-t tdborder-l2 tdborder-b tdborder-r2">
                  （3）引用參考值之作業編號：{{nowCaseRefPrjCode}}，發布日期：{{refPubDateStr}}
                </td>
              </tr>
              <tr>
                <td width="6%" rowspan="4" class="tdborder-l2 tdborder-r">
                  <div class="fstyle02V">擇一填寫</div>
                </td>
                <td colspan="3" scope="col" class="fstyle02 pt-2 tdborder-r2" style="line-height: 1;">
                  （4-A）具各項系統規格參數
                </td>
              </tr>
              <tr>
                <td scope="col" width="6%" class="tdborder-b"></td>
                <td v-if="isFullPara" colspan="3" scope="col" class="fstyle02 pb-2 tdborder-r2 tdborder-b" style="line-height: 1.5rem;">
                  雷射測距精度：{{nowCaseLrDisPrs}} mm，雷射掃描發散角：{{nowCaseLrBeam}} "
                  雷射掃描角解析度：{{nowCaseLrAngResol}} "<br/>
                  GNSS定位精度  平面：{{nowCaseGnssPrcH}} mm，高程：{{nowCaseGnssPrcV}}mm<br/>
                  IMU測角精度  Omega：{{nowCaseImuOmg}} "，Phi：{{nowCaseImuPhi}} "，Kappa：{{nowCaseImuKap}} "<br/>
                  姿態角解析度：{{nowCaseImuPrcO}} "
                </td>
                <td v-else colspan="3" scope="col" class="fstyle02 pb-2 tdborder-r2 tdborder-b" style="line-height: 1.5rem;">
                  雷射測距精度：   mm，雷射掃描發散角：    "
                  雷射掃描角解析度：    "<br/>
                  GNSS定位精度  平面：   mm，高程：  mm<br/>
                  IMU測角精度  Omega：   "，Phi：   "，Kappa：   "<br/>
                  姿態角解析度：   "
                </td>
              </tr>
              <tr>
                <td colspan="3" scope="col" class="fstyle02 pt-2 tdborder-r2" style="line-height: 1;">
                  （4-B）具空載光達系統整合精度
                </td>
              </tr>
              <tr>
                <td scope="col" width="6%"></td>
                <td v-if="!isFullPara" colspan="3" scope="col" class="fstyle02 pb-2 tdborder-r2" style="line-height: 1.5rem;">
                  平面精度：{{nowCaseGnssPrcH}} mm，高程精度：{{nowCaseGnssPrcV}} mm
                </td>
                <td v-else colspan="3" scope="col" class="fstyle02 pb-2 tdborder-r2" style="line-height: 1.5rem;">
                  平面精度：   mm，高程精度：   mm
                </td>
              </tr>
              <tr>
                <td width="50%" colspan="3" scope="col" class="fstyle02 tdborder-t2 tdborder-r tdborder-b tdborder-l2">
                  （5）檢附<strong class="bggray2">校正標量測原始數據</strong>，如附件 1。
                </td>
                <td scope="col" class="fstyle02 tdborder-t2 tdborder-r2 tdborder-b tdborder-l">
                  （6）檢附<strong class="bggray2">不確定度計算表</strong>，如附件 2。
                </td>
              </tr>
              <tr>
                <td colspan="4" scope="col" class="fstyle02 tdborder-l2 tdborder-r2">
                  （7）檢附符合性使用之<strong class="bggray2">規範標準及決定規則</strong>，如附件 3。(顧客有要求符合性聲明時檢附)
                </td>
              </tr>
            </table>
            <table width="100%">
              <tr>
                <td colspan="5" scope="col" class="p-2 fstyle02mid bggray2 tdborder-t2 tdborder-b tdborder-l2 tdborder-r2">
                  <strong>掃描成果檢核</strong>
                </td>
              </tr>
              <tr>
                <td width="10%" class="px-0 py-2 fstyle02mid tdborder-l2 tdborder-r">
                  序號
                </td>
                <td width="14%" class="px-0 py-2 fstyle02mid tdborder-r">
                  軌跡編號
                </td>
                <td width="38%" class="px-0 py-2 fstyle02mid tdborder-r">
                  檔案名稱
                </td>
                <td width="20%" class="px-0 py-2 fstyle02mid tdborder-r">
                  點雲密度(點/m<sup>2</sup>)
                </td>
                <td class="px-0 py-2 fstyle02mid tdborder-r2">
                  備註(異常敘述)
                </td>
              </tr>
              <tr v-for="strip in nowCaseCloudDate" :key="strip.id" class="fstyle02">
                <td class="px-0 py-2 fstyle02mid tdborder-l2 tdborder-t tdborder-r">{{ strip.id }}</td>
                <td class="px-0 fstyle02mid tdborder-t tdborder-r">{{ strip.sno }}</td>
                <td class="px-0 fstyle02 nowrap tdborder-t tdborder-r">{{ strip.filename }}</td>
                <td class="px-0 fstyle02mid nowrap tdborder-t tdborder-r">{{ (strip.PtDensity)?strip.PtDensity:'' }}</td>
                <td class="fstyle02 nowrap tdborder-t tdborder-r2">{{ strip.memo }}</td>
              </tr>
              <tr>
                <td colspan="3" class="py-3 fstyle02mid tdborder-l2 tdborder-t tdborder-b2 tdborder-r">
                  平均值
                </td>
                <td class="py-3 fstyle02mid tdborder-l tdborder-t tdborder-b2 tdborder-r">
                  {{ nowCaseCloudAvg }}
                </td>
                <td class="py-3 fstyle02 tdborder-l tdborder-t tdborder-b2 tdborder-r2"></td>
              </tr>
            </table>
            
          </th>
        </tr>
        
      </table>
  </div>
  <div class="page-gap"></div>
  <div class="page">
    <table width="100%" cellspacing=0 cellpadding=0>
      <!-- 平面較差 -->
      <tr>
        <th colspan="3">
          <table width="100%">
            <tr>
              <td colspan="8" scope="col" class="p-3 fstyle02mid bggray2 tdborder-t2 tdborder-b tdborder-l2 tdborder-r2">
                <strong>點雲量測</strong>
              </td>
            </tr>
            <tr class="fstyle02mid bggray2">
              <td width="8%" rowspan="2" scope="col" class="py-2 tdborder-t2 tdborder-l2 tdborder-r">校正標編號</td>
              <td width="27%" colspan="2" scope="col" class="py-2 tdborder-t2 tdborder-l tdborder-r">E</td>
              <td width="27%" colspan="2" scope="col" class="py-2 tdborder-t2 tdborder-l tdborder-r">N</td>
              <td colspan="2" scope="col" class="py-2 tdborder-t2 tdborder-l tdborder-r">器差值(mm)</td>
              <td width="12%" rowspan="2" scope="col" class="py-2 tdborder-t2 tdborder-l tdborder-r2">擴充<br>不確定度</td>
            </tr>
            <tr class="py-2 fstyle02mid bggray2">
              <td scope="col" class="py-2 tdborder">量測值(m)</td>
              <td scope="col" class="py-2 tdborder">標準值(m)</td>
              <td scope="col" class="py-2 tdborder">量測值(m)</td>
              <td scope="col" class="py-2 tdborder">標準值(m)</td>
              <td scope="col" class="py-2 tdborder">△E</td>
              <td scope="col" class="py-2 tdborder">△N</td>
            </tr>
            <tr v-for="(item, index) in pt_Data">
              <td :class="['py-2 fstyle03mid tdborder-t tdborder-l2 tdborder-r',(index+1===pt_Data.length)?'tdborder-b2':'']">{{item.gcp_id}}</td>
              <td :class="['fstyle03right tdborder-t tdborder-l tdborder-r',(index+1===pt_Data.length)?'tdborder-b2':'']">{{parseFloat(item.x).toFixed(3)}}</td>
              <td :class="['fstyle03right tdborder-t tdborder-l tdborder-r',(index+1===pt_Data.length)?'tdborder-b2':'']">{{parseFloat(item.sx).toFixed(3)}}</td>
              <td :class="['fstyle03right tdborder-t tdborder-l tdborder-r',(index+1===pt_Data.length)?'tdborder-b2':'']">{{parseFloat(item.y).toFixed(3)}}</td>
              <td :class="['fstyle03right tdborder-t tdborder-l tdborder-r',(index+1===pt_Data.length)?'tdborder-b2':'']">{{parseFloat(item.sy).toFixed(3)}}</td>
              <td :class="['fstyle03right tdborder-t tdborder-l tdborder-r',(index+1===pt_Data.length)?'tdborder-b2':'']">{{(parseFloat(item.dx)*1000).toFixed(1)}}</td>
              <td :class="['fstyle03right tdborder-t tdborder-l tdborder-r',(index+1===pt_Data.length)?'tdborder-b2':'']">{{(parseFloat(item.dy)*1000).toFixed(1)}}</td>
              <td :class="['fstyle03right tdborder-t tdborder-l tdborder-r2',(index+1===pt_Data.length)?'tdborder-b2':'']">{{nowCaseSTDh}}</td>
            </tr>
          </table>
        </th>
      </tr>
    </table>
  </div>
  <div class="page-gap"></div>
  <div class="page">
    <table width="100%" cellspacing=0 cellpadding=0>
      <!-- 高程較差 -->
      <tr>
        <th colspan="3">
          <table width="100%">
            <tr>
              <td colspan="8" scope="col" class="p-3 fstyle02mid bggray2 tdborder-t2 tdborder-b tdborder-l2 tdborder-r2">
                <strong>點雲量測</strong>
              </td>
            </tr>
            <tr class="fstyle02mid bggray2">
              <td width="8%" rowspan="2" scope="col" class="py-2 tdborder-l2 tdborder-r tdborder-t2">校正物編號</td>
              <td width="54%" colspan="4" scope="col" class="py-2 tdborder-l tdborder-r tdborder-t2">h</td>
              <td colspan="2" scope="col" class="py-2 tdborder-l tdborder-r tdborder-t2">器差值(mm)</td>
              <td width="12%" rowspan="2" scope="col" class="py-2 tdborder-l tdborder-r2 tdborder-t2">擴充不確定度</td>
            </tr>
            <tr class="fstyle02mid bggray2">
              <td colspan="2" scope="col" class="py-2 tdborder">量測值(m)</td>
              <td colspan="2" scope="col" class="py-2 tdborder">標準值(m)</td>
              <td colspan="2" scope="col" class="py-2 tdborder">△h</td>
            </tr>
            <tr v-for="item in pt_Data">
              <td class="fstyle03mid tdborder-t tdborder-l2 tdborder-r">{{item.gcp_id}}</td>
              <td colspan="2" class="fstyle03right tdborder-t tdborder-l tdborder-r">{{parseFloat(item.z).toFixed(3)}}</td>
              <td colspan="2" class="fstyle03right tdborder-t tdborder-l tdborder-r">{{parseFloat(item.sz).toFixed(3)}}</td>
              <td colspan="2" class="fstyle03right tdborder-t tdborder-l tdborder-r">{{(parseFloat(item.dz)*1000).toFixed(1)}}</td>
              <td class="fstyle03right tdborder-t tdborder-l tdborder-r2">{{nowCaseSTDv}}</td>
            </tr>
          </table>
        </th>
      </tr>

      <!-- 簽章欄 -->
      <tr>
        <th colspan="3">
          <table width="100%">
            <tr height="50px">
              <td width="25%" scope="col" class="fstyle02 tdborder-t2 tdborder-l2">校正人員簽章</td>
              <td scope="col" class="tdborder-t2 tdborder-l tdborder-r2">
                <div>
                  <table width="60px" style="float: right; margin-right: 20px;">
                    <tr class="fstyle04mid">
                      <td class="tdborder-b tdbordercolor">
                        <span class="fs-gray">日期</span></td>
                    </tr>
                    <tr class="fstyle04mid">
                      <td
                        style="color: #d9d9d9;">
                        時間</td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>
            <tr height="50px">
              <td scope="col" class="fstyle02 tdborder-t tdborder-l2 tdborder-b">數據檢核人員簽章</td>
              <td scope="col" class="tdborder-t tdborder-l tdborder-b tdborder-r2">
                <div>
                  <table width="60px" style="float: right; margin-right: 20px;">
                    <tr class="fstyle04mid">
                      <td class="tdborder-b tdbordercolor">
                        <span class="fs-gray">日期</span></td>
                    </tr>
                    <tr class="fstyle04mid">
                      <td
                        style="color: #d9d9d9;">
                        時間</td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>
            <tr height="50px">
              <td scope="col" class="fstyle02 tdborder-t tdborder-l2 tdborder-b2">技術主管簽章</td>
              <td scope="col" class="tdborder-t tdborder-l tdborder-b2 tdborder-r2">
                <div>
                  <table width="60px" style="float: right; margin-right: 20px;">
                    <tr class="fstyle04mid">
                      <td class="tdborder-b tdbordercolor">
                        <span class="fs-gray">日期</span></td>
                    </tr>
                    <tr class="fstyle04mid">
                      <td
                        style="color: #d9d9d9;">
                        時間</td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>
          </table>
        </th>
      </tr>
    </table>
  </div>
  <div class="page-gap"></div>
</template>
<style>
@media screen {

  html,
  body {
    width: 210mm;
    height: 297mm;
    margin-left: auto;
    margin-right: auto;
  }

  .header {
    display: none;
  }

  .footer {
    display: none;
  }

  .page {
    border: 1px solid;
    box-shadow: 10px 10px 5px rgba(0, 0, 0, 0.6);
    position: relative;
    width: 210mm;
    height: 297mm;
    padding-top: 1.5cm;
    padding-bottom: 1.5cm;
    padding-left: 2cm;
    padding-right: 2cm;
  }

  .page-gap {
    height: 20px;
  }



}

@page {
  size: A4 portrait;
  /* 混合使用 */
  margin: 1cm 2cm;
  /* 邊界與內容的距離 */
  orphans: 0;
  widows: 0;
}

@media print {

  html,
  body {
    height: 100%;
    margin: 0;
    counter-reset: page-number;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
    /* border: 1px solid red; */
  }

  .header {
    position: fixed;
  }

  .footer {
    position: fixed;
    bottom: 0;
  }

  .page {
    /* border: 1px solid blue; */
    position: relative;
    width: 100%;
    height: 100%;
    padding-top: 1.5cm;
    padding-bottom: 1.5cm;
    page-break-inside: avoid;
    page-break-before: always;
  }

  .page::after {
    counter-increment: page-number;
    content: counter(page-number);
    position: absolute;
    right: 88mm;
    bottom: 1.8mm;
    font-size: 11pt;
    font-family: "Times New Roman", 標楷體;
    font-weight: normal;
    text-align: right;
  }

  .page-gap {
    display: none;
  }

  .noprint {
    display: none;
  }

}

table, tr{
  border: none;
}


td {
  /* border: 2px solid; */
  page-break-inside: avoid;
  /* white-space:nowrap; */
  /* overflow: hidden; */
  /* height: 30px; */
}

.fs-gray{
  color: #d9d9d9;
}

.tdbordercolor{
  border-color: #000;
}
.tdborder{
  border: 1px solid;
}

.tdborder-t{
  border-top: 1px solid;
}

.tdborder-b{
  border-bottom: 1px solid;
}

.tdborder-l{
  border-left: 1px solid;
}

.tdborder-r{
  border-right: 1px solid;
}

.tdborder-t2{
  border-top: 3px solid;
}

.tdborder-b2{
  border-bottom: 3px solid;
}

.tdborder-l2{
  border-left: 3px solid;
}

.tdborder-r2{
  border-right: 3px solid;
}

.wingdings2 {
  font-family: 'Wingdings 2';
  font-size: 16pt;
  vertical-align: middle;
}

.nowrap {
  white-space: nowrap;
}

.bggray {
  background-color: #b3b3b3;
}

.bggray2 {
  background-color: #d9d9d9;
}

.fstyle01,
.fstyle01C,
.fstyle02,
.fstyle02mid,
.fstyle02V,
.fstyle02Vleft, .fstyle04mid {
  font-family: "Times New Roman", 標楷體;
}

.fbolder {
  font-weight: bolder;
}

.fstyle01,
.fstyle01C {
  text-align: center;
  font-size: 24pt;
  font-weight: bold;
  line-height: 1;
}

.fstyle01C {
  letter-spacing: 5px;
}

.fstyle02,
.fstyle02mid {
  padding: 3px 10px 3px 10px;
  font-size: 11pt;
  letter-spacing: 0px;
  font-weight: normal;
}

.fstyle02 {
  text-align: left;
  line-height: 2;
}

.fstyle02mid {
  text-align: center;
  line-height: 1.2;
}

.fstyle02V,
.fstyle02Vleft {
  margin-left: auto;
  margin-right: auto;
  font-size: 12pt;
  font-weight: normal;
  /* line-height: 1; */
  writing-mode: vertical-lr;
  text-orientation: mixed;
  white-space: nowrap;
}

.fstyle02V {
  text-align: center;
}

.fstyle02Vleft {
  text-align: left;
  padding-top: 10px;
}

.fstyle03left,
.fstyle03mid,
.fstyle03right  {
  padding: 0.3rem 0.5rem;
  font-size: 10pt;
  font-weight: normal;
  line-height: 1;
}

.fstyle03left {
  text-align: left;
}

.fstyle03mid {
  text-align: center;
}
.fstyle03right {
  text-align: right;
}

.fstyle04mid{
  padding: 0;
  font-size: 8pt;
  font-weight: normal;
  line-height: 1;
  text-align: center;
}

.lightboxImg {
  display: block;
  margin: auto;
  max-width: 100%;
  height: 150px;
}
</style>
