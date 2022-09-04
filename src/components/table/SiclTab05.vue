<script setup>
import {ref} from 'vue';
import { computed } from "@vue/reactivity";
import { useQuery } from '@vue/apollo-composable';
import CaseGQL from "../../graphql/Cases";

// 引入案件編號
const props = defineProps({
  caseID: String
});

const nowCaseImgNo = ref("");
const nowCaseConnectNo = ref("");
const nowCaseObsNo = ref("");
const nowCaseRedundancy = ref("");
const nowCaseTotPt = ref("");
const nowCaseMeaPt = ref("");
const nowCaseDelPt = ref("");
const nowCaseCrtNo = ref("");
const nowCaseChkNo = ref("");
const nowCaseFreeStd = ref("");
const nowCaseFixStd = ref("");
const nowCaseRMSx = ref("");
const nowCaseRMSy = ref("");
const nowCaseRMSz = ref("");
const nowCaseSTDh = ref("");
const nowCaseSTDv = ref("");
const nowCaseCalResult = ref(""); //計算成果表
const nowCaseCalArray = computed(()=>{
	let myarray=[];
	if(nowCaseCalResult.value){
		let jsonObj = JSON.parse(nowCaseCalResult.value);
		console.log(jsonObj);
		for (let key in jsonObj){
			myarray.push({
				ptname:key,
				...jsonObj[key],
			})
		}
		myarray.sort(function(a, b) {
			if(a.type === "F" && b.type === "T"){
				return -1
			}else if(a.type === "T" && b.type === "F"){
				return 1
			}else{
				return (a.ptname > b.ptname)?1:-1
			}
		});
	}
	return myarray;
})

// 查詢Case_Record資料
const { result: nowCaseF, loading: lodingnowCaseF, onResult: getNowCaseF, refetch: refgetNowCaseF } = useQuery(
  CaseGQL.GETFULLCASEBYID,
  () => ({
    getCasebyIdId: props.caseID
  })
);
getNowCaseF(result => {
  if (!result.loading && result && result.data.getCasebyID) {
    // 填入資料
		let getRecord01 = result.data.getCasebyID.case_record_01;

		nowCaseImgNo.value = getRecord01.img_no;
		nowCaseConnectNo.value = getRecord01.connect_no;
		nowCaseObsNo.value = getRecord01.obs_no;
		nowCaseRedundancy.value = getRecord01.redundancy;
		nowCaseTotPt.value = getRecord01.total_pt;
		nowCaseMeaPt.value = getRecord01.meas_pt;
		nowCaseDelPt.value = getRecord01.del_pt;
		nowCaseCrtNo.value = getRecord01.ctr_no;
    nowCaseChkNo.value = getRecord01.chk_no;
		nowCaseFreeStd.value = getRecord01.free_std;
    nowCaseFixStd.value = getRecord01.fix_std;
		nowCaseRMSx.value = getRecord01.RMS_x;
    nowCaseRMSy.value = getRecord01.RMS_y;
    nowCaseRMSz.value = getRecord01.RMS_z;
		nowCaseSTDh.value = getRecord01.std_h;
    nowCaseSTDv.value = getRecord01.std_v;
		nowCaseCalResult.value = getRecord01.recal_table;
		let temp =JSON.parse(nowCaseCalResult.value);
		console.log(temp);
  }
});
refgetNowCaseF();
</script>

<template>
	<div class="page">
		<div class="titlediv fstyle02mid">
			報表摘要資訊
		</div>
		<div class="fstyle02">
			<div>總片數：{{nowCaseImgNo}}</div>
			<div>連結點數目：{{nowCaseConnectNo}}</div>
			<div>觀測量：{{nowCaseObsNo}}</div>
			<div>多餘觀測量：{{nowCaseRedundancy}}</div>
			<br/>
			<div>校正標數量：{{nowCaseTotPt}}</div>
			<div>實際量測：{{nowCaseMeaPt}}</div>
			<div>剔除點數：{{nowCaseDelPt}}</div>
			<div>作為控制點數：{{nowCaseCrtNo}}</div>
			<div>作為檢核點數：{{nowCaseChkNo}}</div>
			<br/>
			<div>平差結果自由網：{{nowCaseFreeStd}} um</div>
			<div>平差結果附合網：{{nowCaseFixStd}} um</div>
			<br/>
			<div>空三RMS_X：{{nowCaseRMSx}} mm</div>
			<div>空三RMS_Y：{{nowCaseRMSy}} mm</div>
			<div>空三RMS_Z：{{nowCaseRMSz}} mm</div>
			<br/>
			<div>器差RMS_H：{{nowCaseSTDh}} mm</div>
			<div>器差RMS_V：{{nowCaseSTDv}} mm</div>
		</div>
		
		<table cellspacing=0 cellpadding=0 width="100%">
			<tr class="fstyle02 tbheader bggray2">
				<th>類型</th>
				<th>點號</th>
				<th>E_ref(m)</th>
				<th>N_ref(m)</th>
				<th>h_ref(m)</th>
				<th>E_mes(m)</th>
				<th>N_mes(m)</th>
				<th>h_mes(m)</th>
				<th>dE(mm)</th>
				<th>dN(mm)</th>
				<th>dh(mm)</th>
			</tr>
			<tr v-for="(item, index) in nowCaseCalArray" :key="index" class="fstyle02">
				<td>{{ item.type }}</td>
				<td>{{ item.ptname }}</td>
				<td>{{ (item.sx)?item.sx.toFixed(4):"" }}</td>
				<td>{{ (item.sy)?item.sy.toFixed(4):"" }}</td>
				<td>{{ (item.sz)?item.sz.toFixed(4):"" }}</td>
				<td>{{ (item.x)?item.x.toFixed(4):"" }}</td>
				<td>{{ (item.y)?item.y.toFixed(4):"" }}</td>
				<td>{{ (item.z)?item.z.toFixed(4):"" }}</td>
				<td>{{ (item.dx)?(item.dx * 1000).toFixed(2):"" }}</td>
				<td>{{ (item.dy)?(item.dy * 1000).toFixed(2):"" }}</td>
				<td>{{ (item.dz)?(item.dz * 1000).toFixed(2):"" }}</td>
			</tr>
			<tbody></tbody>
		</table>
	</div>
</template>
<style>
@media screen {
	html, body{
		width: 297mm;
		height: 210mm;
		margin-left: auto;
		margin-right: auto;
	}
	.header{
		display: none;
	}
	.footer{
		display: none;
	}
	.page{
		/* border: 2px solid red; */
		/* box-shadow: 10px 10px 5px rgba(0, 0, 0, 0.6); */
		position: relative;
		width: 297mm;
		height: 210mm;
		padding-top: 1.5cm;
		padding-bottom: 1.5cm;
		padding-left: 2cm;
		padding-right: 2cm;
		/* z-index: 1; */
	}
	.page-gap{
		height: 20px;
	}
}
@page {
  size: A4 landscape; /* 混合使用 */
  margin: 2cm 1cm; /* 邊界與內容的距離 */
	orphans:2;
  widows:2;
}
@media print{
	html, body{
		width: 100%;
		height: 100%;
		margin: 0;
		counter-reset: page-number;
		print-color-adjust: exact;
		-webkit-print-color-adjust: exact;
		/* border: 1px solid red; */
	}
	.header{
		position: fixed;
	}
	.footer{
		position: fixed;
		bottom: 0;
	}
	.page{
		/* border: 2px solid red; */
		position: relative;
		width: 100%;
		/* z-index: 10; */
	}
	/* .page::after{
		counter-increment: page-number;
		content: counter(page-number);
		position: absolute;
		right: 88mm;
		bottom: 0;
		font-size: 12pt;
		font-family: "Times New Roman", 標楷體;
		font-weight:normal;
		text-align: right;
	} */
	.page-gap{
		display: none;
	}
	.noprint{
		display: none;
	}
	
	.tbheader{
		display: table-header-group;
	}
}

tr, td, th {
	border: 1px solid;
	padding: 3px 3px 3px 10px;
	page-break-inside: avoid;
}
th{
	border-top: none;
}
.titlediv{
	width: 6cm;
	border-style: double;
	line-height: 2cm;
}
.wingdings2{
		font-family: 'Wingdings 2';
		font-size: 16pt;
		vertical-align:middle;
	}
.nowrap{
	white-space:nowrap;
}
.bggray1{
	background-color: #d9d9d9;
}

.bggray2{
	background-color: #f3f3f3;
}

.sicltab01 {
  /* border: 1px solid; */
  border-collapse: collapse;
}

.fstyle01, .fstyle01C, .fstyle02, .fstyle02mid, .fstyle02V, .fstyle02Vleft, .fstyle03, .fstyle03mid{
	font-family: "Times New Roman", 標楷體;
}

.fbolder{
	font-weight:bolder;
}

.fstyle01, .fstyle01C{
	text-align: center;
  font-size: 24pt;
  font-weight:bold;
	line-height: 1;
}

.fstyle01C{
	letter-spacing: 5px;
}

.fstyle02, .fstyle02mid{
	padding: 3px 10px 3px 10px;
  font-size: 12pt;
	line-height: 1;
	font-weight:normal;
}

.fstyle02{
	text-align: left;
}
.fstyle02mid{
	text-align: center;
}

.fstyle02V, .fstyle02Vleft{
	margin-left: auto;
	margin-right: auto;
  font-size: 12pt;
	font-weight:normal;
	line-height: 1.2;
	writing-mode: vertical-lr;
  text-orientation: mixed;
	white-space:nowrap;
}

.fstyle02V{
	text-align: center;
}

.fstyle02Vleft{
	text-align: left;
  padding-top: 10px;
}

.fstyle03, .fstyle03mid{
	padding: 3px 10px 3px 10px;
  font-size: 10pt;
  font-weight:normal;
	line-height: 1;
}

.fstyle03{
	text-align: left;
}
.fstyle03mid{
	text-align: center;
}

</style>
