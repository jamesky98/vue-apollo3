<script setup>
import Chart from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers';
import Navbar1 from "../components/Navbar.vue";
import { ref, reactive, onMounted, provide, inject } from "vue";
import { computed } from "@vue/reactivity";
import {
  MDBCol,
  MDBRow,
  MDBContainer,
  MDBIcon,
  MDBSelect,
} from 'mdb-vue-ui-kit';
import { RouterLink } from 'vue-router';
import ToolsGQL from "../graphql/Tools";
// import CaseGQL from "../graphql/Cases";
// import CustGQL from "../graphql/Cust";
// import GcpGQL from "../graphql/Gcp";
// import PrjGQL from "../graphql/Prj";
// import EmpGQL from "../graphql/Employee";
// import ItemGQL from "../graphql/Item";


// 判斷token狀況
import { useQuery, useMutation} from '@vue/apollo-composable';
import UsersGQL from "../graphql/Users";
import { logIn, logOut, toTWDate } from '../methods/User';

const { mutate: getchecktoken, onDone: getchecktokenOnDone } = useMutation(UsersGQL.CHECKTOKEN);
getchecktokenOnDone(result => {
  if (!result.data.checktoken) {
    logOut();
  }
});
getchecktoken();

//#region 參數==========Start
const NavItem = ref("main");
provide("NavItem", NavItem);

const selYear = ref("");
const selYearMU = ref([]);
const selYearDOM = ref();

//#endregion 參數==========End


//#region 統計資料查詢==========Start
let chartData1 = [];
const { mutate: getCasebyOpr, onDone: getCasebyOprOnDone } = useMutation(ToolsGQL.STATCASEBYOPR);



getCasebyOprOnDone(result=>{
  chartData1 = result.data.statCaseByOpr;
  console.log(chartData1);
});



//#endregion 統計資料查詢==========End

//#region 圖表設定==========Start

const bgcolorList = [
  'rgba(255, 99, 132, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(255, 206, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(153, 102, 255, 0.2)',
  'rgba(255, 159, 64, 0.2)'];
const brcolorList = [
  'rgba(255, 99, 132, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(255, 206, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(255, 159, 64, 1)'];


onMounted(()=>{ 
  // 圖表1
  const data = chartData1;
  getCasebyOpr({
    year: parseInt(new Date().getFullYear())
  }).then(res=>{
    const ctx1 = document.getElementById('myChart1').getContext('2d');
    const myChart1 = new Chart(ctx1, {
      type: 'bar',
      data: {
        datasets: [
          {
            label: '航測相機',
            backgroundColor: bgcolorList[0],
            borderColor: brcolorList[0],
            data: chartData1,
            parsing: {
                yAxisKey: 'data.c1'
            }
          },
          {
            label: '空載光達',
            backgroundColor: bgcolorList[1],
            borderColor: brcolorList[1],
            data: chartData1,
            parsing: {
                yAxisKey: 'data.c2'
            }
          },
          {
            label: '小像幅',
            backgroundColor: bgcolorList[2],
            borderColor: brcolorList[2],
            data: chartData1,
            parsing: {
                yAxisKey: 'data.c3'
            }
          },
        ]
      },
      options: {
        parsing: {
          xAxisKey: 'name',
        }
      }
    });
  })
  
});



//#endregion 圖表設定==========End

</script>

<template>
  <MDBContainer fluid class="h-100">
    <MDBRow class="h-100 flex-column flex-nowrap">
      <!-- 頁首 -->
      <header>
        <Navbar1 />
        <!-- Navbar -->
        <!-- Background image -->
        <div class="p-5 text-center bg-image" style="
        background-image: url('/ZZZZZ2598.png');
        height: 150px;
      ">
          <div class="mask" style="background-color: rgba(255, 255, 255, 0.2);">
          </div>
        </div>
        <!-- Background image -->
      </header>
      <!-- 主體 -->
      <MDBRow style="height: calc(100% - 16rem);margin-left:0;margin-right:0;" class="w-100 overflow-auto">
        <MDBCol col="12" class="py-2">
          <MDBRow class="h-100 border border-5 rounded-8 shadow-4">
            <!-- 左方導航列 -->
            <MDBCol md="3">
              <MDBRow class="d-flex flex-column">
                <MDBCol class="px-2 p-3 border w-100">
                  <RouterLink :to="{ name: 'docs'}">
                    <MDBIcon icon="file-alt" fw size="lg" style="color: #39C0ED; margin-right: 1vw;" />文件查詢
                  </RouterLink>
                </MDBCol>
                <MDBCol class=" px-2 p-3 border w-100">
                  <RouterLink :to="{ name: 'cases'}">
                    <MDBIcon icon="balance-scale" fw size="lg" style="color: #39C0ED; margin-right: 1vw;" />校正案件
                  </RouterLink>
                </MDBCol>
                <MDBCol class="px-2 p-3 border w-100">
                  <RouterLink :to="{ name: 'employee'}">
                    <MDBIcon icon="user-edit" fw size="lg" style="color: #39C0ED; margin-right: 1vw;" />人員管理
                  </RouterLink>
                </MDBCol>
                <MDBCol class="px-2 p-3 border w-100">
                  <RouterLink :to="{ name: 'gcps'}">
                    <MDBIcon icon="map-marked-alt" fw size="lg" style="color: #39C0ED; margin-right: 1vw;" />點位管理
                  </RouterLink>
                </MDBCol>
                <MDBCol class="px-2 p-3 border w-100">
                  <RouterLink :to="{ name: 'prjs'}">
                    <MDBIcon icon="drafting-compass" fw size="lg" style="color: #39C0ED; margin-right: 1vw;" />
                    參考值量測作業
                  </RouterLink>
                </MDBCol>
                <MDBCol class="px-2 p-3 border w-100">
                  <RouterLink :to="{ name: 'items'}">
                    <MDBIcon icon="wrench" fw size="lg" style="color: #39C0ED; margin-right: 1vw;" />標準件管理
                  </RouterLink>
                </MDBCol>
                <MDBCol class="px-2 p-3 border w-100">
                  <RouterLink :to="{ name: 'cust' }">
                    <MDBIcon far icon="handshake" fw size="lg" style="color: #39C0ED; margin-right: 1vw;" />顧客管理
                  </RouterLink>
                </MDBCol>
                <MDBCol class="px-2 p-3 border w-100">
                  <RouterLink :to="{ name: 'ucedit'}">
                    <MDBIcon icon="project-diagram" fw size="lg" style="color: #39C0ED; margin-right: 1vw;" />
                    不確定度管理
                  </RouterLink>
                </MDBCol>
              </MDBRow>
            </MDBCol>
            <!-- 右方統計圖 -->
            <MDBCol md="9" class="border h-100">
              <!-- 加入統計圖 -->
              <MDBRow class="h-100">
                <!-- 圖表1 -->
                <MDBCol col="6" style="position:relative ;" class="h-50 border d-flex align-items-center justify-content-center">
                  <MDBSelect size="sm" class="" style="position:absolute;right:0.5rem;top:0.5rem;"
                    label="年份" 
                    v-model:options="selYearMU"
                    v-model:selected="selYear" 
                    ref="selYearDOM" />
                  <canvas id="myChart1" class="border"></canvas>
                </MDBCol>
                <!-- 圖表2 -->
                <MDBCol col="6" class="h-50 border d-flex align-items-center justify-content-center">
                  <canvas id="myChart2" class="border"></canvas>
                </MDBCol>
                <!-- 圖表3 -->
                <MDBCol col="6" class="h-50 border d-flex align-items-center justify-content-center">
                  <canvas id="myChart3" class="border"></canvas>
                </MDBCol>
                <!-- 圖表4 -->
                <MDBCol col="6" class="h-50 border d-flex align-items-center justify-content-center">
                  <canvas id="myChart4" class="border"></canvas>
                </MDBCol>
                <!-- 圖表5 -->
                <!-- <MDBCol col="4" class="h-50 border d-flex align-items-center justify-content-center"> -->
                  <!-- <canvas id="myChart5" class="border"></canvas> -->
                <!-- </MDBCol> -->
                <!-- 圖表6 -->
                <!-- <MDBCol col="4" class="h-50 border d-flex align-items-center justify-content-center"> -->
                  <!-- <canvas id="myChart6" class="border"></canvas> -->
                <!-- </MDBCol> -->

              </MDBRow>
              
              
            </MDBCol>
          </MDBRow>
        </MDBCol>
      </MDBRow>
      <!-- Footer -->
      <footer>
        <!-- Copyright -->
        <div class="text-center" style="background-color: rgba(0, 0, 0, 0.05); height: 2.5em;">
          © 2022 Copyright:
          <a class="text-reset fw-bold" href="">jamesky98</a>
        </div>
        <!-- Copyright -->
      </footer>
      <!-- Footer -->
    </MDBRow>
  </MDBContainer>
</template>
