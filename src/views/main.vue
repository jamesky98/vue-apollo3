<script setup>
import Footer1 from "../components/Footer.vue";
import Navbar1 from "../components/Navbar.vue";
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBCollapse,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBInput,
  MDBCol,
  MDBRow,
  MDBContainer,
  MDBBtn,
  MDBFooter,
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from 'mdb-vue-ui-kit';
import { RouterLink } from 'vue-router'
import { ref, reactive, onMounted, provide } from "vue";
// 判斷token狀況
import { useQuery } from '@vue/apollo-composable';
import UsersGQL from "../graphql/Users";
import { logIn, logOut, toTWDate } from '../methods/User';
import router from '../router';
const { onResult: getchecktoken, refetch: refgetCheckToken } = useQuery(UsersGQL.CHECKTOKEN);
getchecktoken(result => {
  if (!result.data.checktoken) {
    logOut();
  }
});
refgetCheckToken();

const NavItem = ref("main");
provide("NavItem", NavItem);
const username = ref(localStorage.getItem("USER_NAME2"));
const usercode = ref(localStorage.getItem("USER_NAME"));
const dropdown1 = ref(false);

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
              <!-- 加入統計圖 -->加入統計圖
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
