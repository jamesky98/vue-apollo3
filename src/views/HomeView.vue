<script setup>
import {
  MDBNavbar,
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
import { ref } from 'vue';
import { RouterLink } from 'vue-router'
const collapse1 = ref(false);
</script>

<template>
  <MDBContainer fluid class="h-100">
    <MDBRow class="d-flex flex-md-column h-100">
      <header>
        <!-- Navbar -->
        <MDBNavbar expand="lg" light bg="light" container>
          <MDBNavbarBrand href="#">Brand</MDBNavbarBrand>
          <MDBNavbarToggler @click="collapse1 = !collapse1" target="#navbarSupportedContent"></MDBNavbarToggler>
          <MDBCollapse v-model="collapse1" id="navbarSupportedContent">
            <MDBNavbarNav class="mb-2 mb-lg-0">
              <MDBNavbarItem to="#" active>
                Home
              </MDBNavbarItem>
              <MDBNavbarItem to="#">
                Link
              </MDBNavbarItem>
              <MDBNavbarItem to="#">
                Something else here
              </MDBNavbarItem>
              <MDBNavbarItem to="#" disabled>
                Disabled
              </MDBNavbarItem>
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBNavbar>
        <!-- Navbar -->
        <!-- Background image -->
        <div class="p-5 text-center bg-image" style="
        background-image: url('https://mdbootstrap.com/img/new/slides/041.webp');
        height: 150px;
      ">
          <div class="mask" style="background-color: rgba(0, 0, 0, 0.6);">
          </div>
        </div>
        <!-- Background image -->
      </header>

      <main class="flex-fill">
        <MDBContainer fluid class="px-0 py-2 w-100 h-100">
          <MDBCard class="rounded-5 text-black  h-100">
            <MDBCardBody>
              <MDBRow class="h-100">
                <MDBCol col="3">
                  <MDBRow class="d-flex flex-column">
                    <MDBCol class="px-5 p-3 border w-100">
                      <RouterLink ref="/docs">文件查詢</RouterLink>
                    </MDBCol>
                    <MDBCol class="px-5 p-3 border w-100">校正案件</MDBCol>
                    <MDBCol class="px-5 p-3 border w-100">人員管理</MDBCol>
                    <MDBCol class="px-5 p-3 border w-100">點位管理</MDBCol>
                    <MDBCol class="px-5 p-3 border w-100">參考值量測作業</MDBCol>
                    <MDBCol class="px-5 p-3 border w-100">標準件管理</MDBCol>
                    <MDBCol class="px-5 p-3 border w-100">顧客管理</MDBCol>
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
        <div class="text-center p-4" style="background-color: rgba(0, 0, 0, 0.05)">
          © 2022 Copyright:
          <a class="text-reset fw-bold" href="">jamesky98</a>
        </div>
        <!-- Copyright -->
      </footer>
      <!-- Footer -->
    </MDBRow>
  </MDBContainer>
</template>
