<script setup>
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
import { ref } from 'vue';
// 判斷token狀況
import { useQuery } from '@vue/apollo-composable';
import UsersGQL from "../graphql/Users";
import { logIn, logOut, toTWDate } from '../methods/User';
import router from '../router';
const { onResult: getchecktoken, refetch: refgetCheckToken } = useQuery(UsersGQL.CHECKTOKEN);
getchecktoken(result => {
  console.log(result.data.checktoken);
  if (!result.data.checktoken) {
    logOut();
  }
});
refgetCheckToken();

const username = ref(localStorage.getItem("USER_NAME"));
const dropdown1 = ref(false);

</script>

<template>
  <MDBContainer fluid class="h-100">
    <MDBRow class="h-100 flex-column flex-nowrap">
      <header>
        <!-- Navbar -->
        <MDBNavbar expand="lg" light bg="light" container>
          <MDBNavbarBrand>{{ username }}，您好</MDBNavbarBrand>
          <MDBNavbarNav right class="ml-auto mb-lg-0">
            <MDBNavbarItem class="dropdown">
              <MDBDropdown v-model="dropdown1">
                <MDBDropdownToggle tag="a" class="nav-link" @click="dropdown1 = !dropdown1">
                  <MDBIcon icon="user" />
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem tag="button">
                    <RouterLink :to="{ path: '/useredit', query: { userName: username }}">
                      使用者管理
                    </RouterLink>
                  </MDBDropdownItem>
                  <MDBDropdownItem tag="button" @click="logOut()">登出</MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavbarItem>
          </MDBNavbarNav>
        </MDBNavbar>

        <!-- Navbar -->
        <!-- Background image -->
        <div class="p-5 text-center bg-image" style="
        background-image: url('/ZZZZZ2598.png');
        height: 150px;
      ">
          <div class="mask" style="background-color: rgba(0, 0, 0, 0.0.5);">
          </div>
        </div>
        <!-- Background image -->
      </header>
      <MDBRow style="margin-left:0;margin-right:0;" class=" flex-grow-1">
        <MDBCol col="12" class="py-2">
          <MDBRow class="h-100 border border-5 rounded-8 shadow-4">
            <MDBCol col="3">
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
            <MDBCol col="9" class="border h-100">
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
