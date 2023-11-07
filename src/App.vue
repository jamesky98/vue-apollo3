<script setup>
import { useStore } from 'vuex'
import { ref, provide } from "vue";
import { useQuery } from '@vue/apollo-composable';
import CaseGQL from "./graphql/Cases";
import EmpGQL from "./graphql/Employee";

//#region 參數==========Start
  const store = useStore();

  const myUserName = ref("");
  provide("myUserName", myUserName);
  const myUserRole = ref("");
  provide("myUserRole", myUserRole);

  //#region 權限清單的讀取函式
  function rGroupSetting(role,opt1){
    let result=[];
    // rGroup[0]最高權限
    // rGroup[1]技術主管以上專用
    // rGroup[2]技術人員專用(非己不可改)
    // rGroup[3]最低權限
    // rGroup[4]完全開放
    switch (role){
      case 0://訪客
          result = [false,false,false,false,true];
        break;
      case 1://校正人員
        if(opt1){
          // 允許校正人員使用
          result = [false, false, true, true, true];
        }else{
          // 不允許校正人員使用
          result = [false,false,false,true,true];
        }
        break;
      case 2://技術主管
        result = [false,true,false,true,true];
        break;
      case 3://系統負責人
        result = [true,true,true,true,true];
      break;
    }
    return result;
  }
  provide("rGroupSetting", rGroupSetting);
  //#endregion 權限清單的讀取函式

//#endregion 參數==========End

</script>

<template>
  <RouterView />
</template>

<style>
@import "@fortawesome/fontawesome-free/css/all.min.css";
@import 'datatables.net-dt';
/* @import 'datatables.net-buttons-dt'; */
@import 'datatables.net-buttons-bs5';
@import 'datatables.net-select-dt';
@import 'datatables.net-responsive-dt';
/* @import "./assets/cwtexyen.css";
@import "./assets/Roboto.css";
@import "./assets/notosanstc.css"; */

html, body, #app{
  height: 100%;
}
#app {
  /* font-family: Roboto, Helvetica, Arial, sans-serif; */
  font-family: 'Noto Sans TC','cwTeXYen', Roboto, Helvetica, Arial, sans-serif;
}

.rotation180 {
  transform: rotate(180deg);
}

.hiddenSpinner {
  display: none;
}
.datatable tbody tr:last-child {
  border-bottom: rgba(0, 0, 0, 0);
  height: auto;
}
.status89{
  color: #DE3163;
}
tr.selected > td >span.status89 {
  color: white;
}

.status71{
  color: rgb(3, 211, 3);
}
.status7 {
  color: green;
}
tr.selected>td>span.status7 {
  color: white;
}

tr>td>span.status6 {
  color: #F39C12;
}
tr.selected>td>span.status6 {
  color: white;
}

tr>td>span.status45 {
  color: #6495ED;
}
tr.selected>td>span.status45 {
  color: white;
}

tr>td>span.status23 {
  color: #FF7F50;
}
tr.selected>td>span.status23 {
  color: white;
}

.status1 {
  color: Gray;
}
tr.selected>td>span.status1 {
  color: white;
}

.nav-tabs .nav-link{
  padding: 0.75rem 1rem;
}
/* tr>td>span.typeF {
  color: #6495ED;
} */
.typeF {
  color: #6495ED;
}

tr.selected>td>span.typeF {
  color: white;
}

/* tr>td>span.typeI {
  color: #229954;
} */
.typeI {
  color: #229954;
}

tr.selected>td>span.typeI {
  color: white;
}

/* tr>td>span.typeJ {
  color: #FF7F50;
} */
.typeJ {
  color: #FF7F50;
}
.typeM{
  color: #9966ff;
}

tr.selected>td>span.typeJ {
  color: white;
}
tr.selected>td>span.typeM {
  color: white;
}

/* div.dataTables_filter {
  padding-top: 0.85em;
} */
.img-allfluid{
  height: auto;
  max-width: 100%;
  max-height: 100%;
}

.lightboxImg .imgtitle,.lightboxImg .imgcancel,.lightboxImg button,.lightboxImg a{
  opacity: 0.8;
}

.imgtitle{
  position: absolute; 
  top: 0.2rem; 
  left: 0.2rem;
  color: white;
  background-color: rgba(0, 0, 0, 0.6);
  height: 1.4rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  padding-left: 0.2rem;
  padding-right: 0.2rem;
}
.imgcancel{
  position: absolute; 
  top: 0; 
  right: 0.2rem;
  background-color: rgba(255, 0, 0, 0.8);
  width: 1.5rem;
  height: 1.5rem;
  text-align: center;
}
.imgcancel::before{
  content: "\2716";
  color: white;
}

.datatable tbody tr:last-child {
  border-bottom: rgba(0,0,0,0);
  height: auto;
}
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

.dt-button-collection{
  height: 16rem;
  overflow: auto;
}
.dropdown-menu{
  top:0
}
</style>
