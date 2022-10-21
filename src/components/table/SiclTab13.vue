<script setup>
	// 作業紀錄表(適用航空測量攝影機)
import {ref} from 'vue';
import { computed } from "@vue/reactivity";
import { useMutation } from '@vue/apollo-composable';
import GcpGQL from "../../graphql/Gcp";

// 引入點號
const props = defineProps({
	recordID: Number
});

const nowPRecordPtId = ref("");
const nowPRecordPrjId = ref("");
const nowPRecordPrjCode = ref("");
const nowPRecordDate = ref("");
const nowPRecordDateStr = computed(()=>{
	let dateArray = nowPRecordDate.value.split("-");
	return dateArray[0]-1911 + "年" + dateArray[1] + "月" + dateArray[2] + "日"
})

const nowPRecordPerson = ref("");
const nowGcpTypeCode = ref("");
const nowGcpTypeCodeName = ref("");
const nowGcpEstablishment = ref("");
const nowGcpEstDate = ref("");
const nowGcpPavement = ref("");
const nowGcpStyle = ref("");

const nowGcpContactId = ref("");
const nowGcpContactName = ref("");
const nowGcpContactPrs = ref("");
const nowGcpContactTel = ref("");
const nowGcpContactAds = ref("");
const nowGcpContactCom = ref("");

const nowGcpDespImg = ref("");
const nowGcpDespImgDL = computed(()=>{
  if(nowGcpDespImg.value){
    return "04_GCP/Pt/" + nowGcpDespImg.value + "?t=" + Math.random()
  }else{
    return ""
  }
});

const nowGcpDespStr = ref("");
const nowPRecordImg0 = ref("");
const nowPRecordImg0DL = computed(()=>{
  if(nowPRecordImg0.value){
    return "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value + "/" + nowPRecordImg0.value + "?t=" + Math.random()
  }else{
    return ""
  }
});

const nowPRecordImg1 = ref("");
const nowPRecordImg1DL = computed(()=>{
  if(nowPRecordImg1.value){
    return "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value + "/" + nowPRecordImg1.value + "?t=" + Math.random()
  }else{
    return ""
  }
});

const nowPRecordImg2 = ref("");
const nowPRecordImg2DL = computed(()=>{
  if(nowPRecordImg2.value){
    return "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value + "/" + nowPRecordImg2.value + "?t=" + Math.random()
  }else{
    return ""
  }
});

const nowPRecordImg3 = ref("");
const nowPRecordImg3DL = computed(()=>{
  if(nowPRecordImg3.value){
    return "04_GCP/" + nowPRecordPrjCode.value + "/pic/" + nowPRecordPtId.value + "/" + nowPRecordImg3.value + "?t=" + Math.random()
  }else{
    return ""
  }
});

// 查詢gcp_Record資料
const { mutate: getRecordById, onDone: getRecordByIdOnDone, onError: getRecordByIdError } = useMutation(GcpGQL.GETRECORDBYID);
getRecordByIdOnDone(result => {
  if (!result.loading && result.data.getGcpRecordById) {
    // 填入資料
		let getData = result.data.getGcpRecordById;
    console.log(getData);
		nowPRecordPtId.value = getData.gcp_id;
    nowPRecordPrjId.value = getData.project_id;
    nowPRecordPrjCode.value = getData.ref_project.project_code;
    nowPRecordDate.value = (getData.date)?(getData.date.split("T")[0]):"";
    nowPRecordPerson.value = getData.person;
    nowGcpTypeCode.value = getData.gcp.type_code;
    nowGcpTypeCodeName.value = getData.gcp.gcp_type.type_name;
    nowGcpEstablishment.value = getData.gcp.establishment;
    nowGcpEstDate.value = getData.gcp.Est_date;
    nowGcpPavement.value = getData.gcp.pavement;
    nowGcpStyle.value = getData.gcp.style;

    if(getData.gcp.gcp_contact){
      nowGcpContactId.value = getData.gcp.contact_id;
      nowGcpContactName.value = getData.gcp.gcp_contact.name;
      nowGcpContactPrs.value = getData.gcp.gcp_contact.person;
      nowGcpContactTel.value = getData.gcp.gcp_contact.tel;
      nowGcpContactAds.value = getData.gcp.gcp_contact.address;
      nowGcpContactCom.value = getData.gcp.gcp_contact.comment;
    }
    
    nowGcpDespImg.value = getData.gcp.pt_map;
    nowGcpDespStr.value = getData.gcp.pt_desc;

    nowPRecordImg0.value = getData.close_photo;
    nowPRecordImg1.value = getData.far_photo1;
    nowPRecordImg2.value = getData.far_photo2;
    nowPRecordImg3.value = getData.far_photo3;
  }
});
getRecordById({getGcpRecordByIdId: parseInt(props.recordID)});
</script>

<template>

	<div class="header fstyle02 w-100">
		<div>內政部國土測繪中心　測量儀器校正實驗室</div>
	</div>
	<div class="footer fstyle02 w-100">
		<table  width="100%" style="border: hidden;">
			<tr>
				<td width="33%" style="text-align: left;border: hidden;">文件編號：SICL-4-47-0</td>
				<!-- <td width="33%" style="text-align: center;border: hidden;">/1</td> -->
				<td style="text-align: right;border: hidden;">版次：1.2</td>
			</tr>
		</table>
	</div>

	<div class="page">
		<table width="100%">
			<!-- 表單名稱 -->
			<div class="fstyle01">
				<div class="fstyle01C" style="margin-bottom: 10px;">校正標點位調查表</div>
			</div>
			<div class="fstyle02">編號：</div>
			<table width="100%" cellspacing=0 cellpadding=0 class="sicltab01">
				<tr>
          <td scope="col">作業編號</td>
          <td scope="col"></td>
          <td scope="col" colspan="2">作業人員</td>
          <td scope="col" colspan="2"></td>
        </tr>
        <tr>
          <td scope="col" width="15%">點號</td>
          <td scope="col" width="35%">{{nowPRecordPtId}}</td>
          <td scope="col" colspan="2" width="15%">作業日期</td>
          <td scope="col" colspan="2" width="35%"></td>
        </tr>
        <tr>
          <td scope="col">現況</td>
          <td scope="col"><span class="wingdings2">&#163;</span>正常 <span class="wingdings2">&#163;</span>遺失損毀</td>
          <td scope="col" colspan="2">作業類型</td>
          <td scope="col" colspan="2"><span class="wingdings2">&#163;</span>巡查 <span class="wingdings2">&#163;</span>參考值量測</td>
        </tr>
        <tr>
          <td scope="col">已拍攝</td>
          <td scope="col" colspan="5">
            <span class="wingdings2">&#163;</span>近照	
            <span class="wingdings2">&#163;</span>遠照1	
            <span class="wingdings2">&#163;</span>遠照2	
            <span class="wingdings2">&#163;</span>遠照3</td>
        </tr>
        <tr>
          <td scope="col" colspan="6">基本資料 <span class="wingdings2">&#163;</span>是否需修改 (需修改則填寫下面資訊)</td>
        </tr>
        <tr>
          <td scope="col">測設機關</td>
          <td scope="col" colspan="3"></td>
          <td scope="col" width="15%">測設日期</td>
          <td scope="col" colspan="2" width="20%">XXX</td>
        </tr>
        <tr>
          <td scope="col">類別</td>
          <td scope="col" colspan="5">
            □ 大校正場用標	□ 小校正場用標	□ 大小共用標<br/>
            □ 光達標	□ 光達校正物<br/>
            □ 網形控制點	□ 備用點位
          </td>
        </tr>
        <tr>
          <td scope="col">標心規格</td>
          <td scope="col">
            □ 鋼釘<br/>
            □ 鋼片
          </td>
          <td scope="col" colspan="2">舖面</td>
          <td scope="col" colspan="2">
            □ 道路面	□ 空地地面<br/>
            □ 人行道	□ 建物頂樓
          </td>
        </tr>
        <tr>
          <td scope="col">土地產權</td>
          <td scope="col" colspan="5">□ 公有地	□ 私有地</td>
        </tr>
        <tr>
          <td scope="col" colspan="6">聯絡資訊</td>
        </tr>
        <tr>
          <td scope="col">聯絡機關</td>
          <td scope="col" colspan="5">OOOO</td>
        </tr>
        <tr>
          <td scope="col">聯絡人</td>
          <td scope="col" colspan="5">OOOO</td>
        </tr>
        <tr>
          <td scope="col">電話</td>
          <td scope="col" colspan="5">OOOO</td>
        </tr>
        <tr>
          <td scope="col">地址</td>
          <td scope="col" colspan="5">OOOO</td>
        </tr>
        <tr>
          <td scope="col" colspan="3" width="60%">點之記說明補充：</td>
          <td scope="col" colspan="3">透空圖：</td>
        </tr>
			</table>
		</table>
	</div>
  <div class="page">
			<table width="100%" cellspacing=0 cellpadding=0 class="sicltab01">
				<tr>
          <td scope="col" width="67%" rowspan="12" colspan="2">
            <img :src="nowGcpDespImgDL" class="img-allfluid" />
          </td>
          <td scope="col">{{nowPRecordPtId}}</td>
        </tr>
        <tr>
          <td scope="col">前次作業：{{nowPRecordPrjCode}}</td>
        </tr>
        <tr>
          <td scope="col">前次日期：{{nowPRecordDateStr}}</td>
        </tr>
        <tr>
          <td scope="col">前次人員：{{nowPRecordPerson}}</td>
        </tr>
        <tr>
          <td scope="col">類別：{{nowGcpTypeCodeName}}</td>
        </tr>
        <tr>
          <td scope="col">測設機關：{{nowGcpEstablishment}}</td>
        </tr>
        <tr>
          <td scope="col">測設年月：{{nowGcpEstDate}}</td>
        </tr>
        <tr>
          <td scope="col">舖面：{{nowGcpPavement}}</td>
        </tr>
        <tr>
          <td scope="col">標心規格：{{nowGcpStyle}}</td>
        </tr>
        <tr>
          <td scope="col">聯絡機關：{{nowGcpContactName}}</td>
        </tr>
        <tr>
          <td scope="col">聯絡人：{{nowGcpContactPrs}}</td>
        </tr>
        <tr>
          <td scope="col">電話：{{nowGcpContactTel}}</td>
        </tr>
        <tr>
          <td scope="col" colspan="2">{{nowGcpDespStr}}<span v-if="nowGcpContactCom">[{{nowGcpContactCom}}]</span></td>
          <td scope="col">地址：{{nowGcpContactAds}}</td>
        </tr>
        <tr>
          <td scope="col" width="50%">
            <img :src="nowPRecordImg1DL" class="img-allfluid" />
          </td>
          <td scope="col" colspan="2">
            <img :src="nowPRecordImg0DL" class="img-allfluid" />
          </td>
        </tr>
        <tr>
          <td scope="col">
            <img :src="nowPRecordImg2DL" class="img-allfluid" />
          </td>
          <td scope="col" colspan="2">
            <img :src="nowPRecordImg3DL" class="img-allfluid" />
          </td>
        </tr>
			</table>
	</div>
</template>
<style>
@media screen {
	html, body{
		width: 210mm;
		height: 297mm;
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
	.page-gap{
		height: 20px;
	}
	tr,td {
		border: 1px solid;
		page-break-inside: avoid;
		/* white-space:nowrap; */
		/* overflow: hidden; */
		/* height: 30px; */
	}

}
@page {
  size: A4 portrait; /* 混合使用 */
  margin: 1cm 2cm; /* 邊界與內容的距離 */
	orphans:0;
  widows:0;
}
@media print{
	html, body{
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
		/* border: 1px solid blue; */
		position: relative;
		width: 100%;
		height: 100%;
		padding-top: 1.5cm;
		padding-bottom: 1.5cm;
		page-break-inside: avoid;
		page-break-before: always;
	}
	.page::after{
		counter-increment: page-number;
		content: counter(page-number);
		position: absolute;
		right: 88mm;
		bottom: 1.8mm;
		font-size: 11pt;
		font-family: "Times New Roman", 標楷體;
		font-weight:normal;
		text-align: right;
	}
	.page-gap{
		display: none;
	}
	.noprint{
		display: none;
	}
	tr,td {
		border: 1.5px solid;
		page-break-inside: avoid;
		/* white-space:nowrap; */
		/* overflow: hidden; */
		/* height: 30px; */
	}
	
}
.wingdings2{
		font-family: 'Wingdings 2';
		font-size: 16pt;
		vertical-align:middle;
	}
.nowrap{
	white-space:nowrap;
}

.bggray{
	background-color: #b3b3b3;
}

.bggray2{
	background-color: #d9d9d9;
}

.sicltab01 {
  border: 3px solid;
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
  font-size: 11pt;
	line-height: 2;
	letter-spacing: 0px;
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
	/* line-height: 1; */
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
	padding: 0;
  font-size: 8pt;
  font-weight:normal;
	line-height: 1;
}

.fstyle03{
	text-align: left;
}
.fstyle03mid{
	text-align: center;
}

.img-allfluid{
  height: auto;
  max-width: 100%;
  max-height: 100%;
}
</style>
