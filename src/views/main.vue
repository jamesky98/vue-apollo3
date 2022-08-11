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
  MDBIcon
} from 'mdb-vue-ui-kit';
import { RouterLink } from 'vue-router'
import { logOut } from '../methods/User';

const username = localStorage.getItem("USER_NAME");

</script>

<template>
  <MDBContainer fluid class="h-100">
    <MDBRow class="d-flex h-100">
      <header>
        <!-- Navbar -->
        <MDBNavbar expand="lg" light bg="light" container>
          <MDBNavbarBrand>{{ username }}，您好</MDBNavbarBrand>
          <MDBNavbarNav right class="ml-auto mb-lg-0">
            <MDBNavbarItem to="#" @click="logOut()">
              登出
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

      <main class="flex-grow-1">
        <MDBContainer fluid class="px-0 py-2 w-100 h-100">
          <MDBCard class="rounded-5 text-black  h-100">
            <MDBCardBody>
              <MDBRow class="h-100">
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
                  </MDBRow>
                </MDBCol>
                <MDBCol col="9" class="border h-100">
                  <!-- 加入統計圖 -->加入統計圖
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
        </MDBContainer>
      </main>
      <!-- Footer -->
      <footer>
        <!-- Copyright -->
        <div class="text-center" style="background-color: rgba(0, 0, 0, 0.05); height: 5vh;">
          © 2022 Copyright:
          <a class="text-reset fw-bold" href="">jamesky98</a>
        </div>
        <!-- Copyright -->
      </footer>
      <!-- Footer -->
    </MDBRow>
  </MDBContainer>
</template>
