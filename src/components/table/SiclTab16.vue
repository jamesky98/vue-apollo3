<script setup>
// 車載光達計算成果表
import {ref} from 'vue';
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

const nowCaseTotPt = ref("");
const nowCaseMeaPt = ref("");
const nowCaseDelPt = ref("");

const nowCaseSTDh = ref("");
const nowCaseSTDv = ref("");
const nowCaseSTDs = ref("");

const nowCaseMAXh = ref("");
const nowCaseMAXv = ref("");
const nowCaseMAXs = ref("");

const nowCaseCalResult = ref(); //計算成果表
const nowCaseCalArray = computed(()=>{
	let myarray=[];
	if(nowCaseCalResult.value){
		// let jsonObj = JSON.parse(nowCaseCalResult.value);
		for (let key in nowCaseCalResult.value){
			myarray.push({
				ptname:key,
				...nowCaseCalResult.value[key],
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
		let getRecord = result.data.getCasebyID.case_record_03;
		console.log('getRecord03',getRecord);
		let calTable = getRecord.recal_table;
    console.log('recal_table',calTable);
    nowCaseTotPt.value = calTable.ptTotal;
		nowCaseMeaPt.value = calTable.ptUsed;
		nowCaseDelPt.value = calTable.ptDel;
		nowCaseSTDh.value = calTable.rmseH.toFixed(3);
    nowCaseSTDv.value = calTable.rmseV.toFixed(3);
		nowCaseSTDs.value = calTable.rmseS.toFixed(3);
		nowCaseMAXh.value = calTable.maxH.toFixed(3);
    nowCaseMAXv.value = calTable.maxV.toFixed(3);
		nowCaseMAXs.value = calTable.maxS.toFixed(3);
		nowCaseCalResult.value = calTable.data;
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
			<div>校正標數量：{{nowCaseTotPt}}</div>
			<div>實際量測：{{nowCaseMeaPt}}</div>
			<div>剔除點數：{{nowCaseDelPt}}</div>
			<br/>
			<div>器差RMS_H：{{nowCaseSTDh}} mm</div>
			<div>器差RMS_V：{{nowCaseSTDv}} mm</div>
			<div>器差RMS_S：{{nowCaseSTDs}} mm</div>
			<br/>
			<div>最大器差_H：{{nowCaseMAXh}} mm</div>
			<div>最大器差_V：{{nowCaseMAXv}} mm</div>
			<div>最大器差_S：{{nowCaseMAXs}} mm</div>
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
				<th>dS(mm)</th>
			</tr>
			<tr v-for="(item, index) in nowCaseCalArray" :key="index" class="fstyle02">
				<td>{{ item.type }}</td>
				<td>{{ item.ptname }}</td>
				<td class="fstyle02right">{{ (item.sx)?item.sx.toFixed(4):"" }}</td>
				<td class="fstyle02right">{{ (item.sy)?item.sy.toFixed(4):"" }}</td>
				<td class="fstyle02right">{{ (item.sz)?item.sz.toFixed(4):"" }}</td>
				<td class="fstyle02right">{{ (item.x)?item.x.toFixed(4):"" }}</td>
				<td class="fstyle02right">{{ (item.y)?item.y.toFixed(4):"" }}</td>
				<td class="fstyle02right">{{ (item.z)?item.z.toFixed(4):"" }}</td>
				<td class="fstyle02right">{{ (item.dx || item.dx===0)?(item.dx * 1000).toFixed(1):item.dx }}</td>
				<td class="fstyle02right">{{ (item.dy || item.dy===0)?(item.dy * 1000).toFixed(1):item.dy }}</td>
				<td class="fstyle02right">{{ (item.dz || item.dz===0)?(item.dz * 1000).toFixed(1):item.dz }}</td>
				<td class="fstyle02right">{{ (item.dS || item.dS===0)?(item.dS * 1000).toFixed(1):item.dS }}</td>
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
		/* margin: 0; */
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

.fstyle01, .fstyle01C, .fstyle02, .fstyle02mid, .fstyle02right, .fstyle02V, .fstyle02Vleft, .fstyle03, .fstyle03mid{
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

.fstyle02, .fstyle02mid, .fstyle02right{
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
.fstyle02right{
	text-align: right;
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
