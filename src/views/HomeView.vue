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

defineProps({
  userName: {
    type: String,
    required: true
  }
})

const collapse1 = ref(false);
</script>

<template>
  <MDBContainer fluid class="h-100">
    <MDBRow class="d-flex flex-md-column h-100">
      <header>
        <!-- Navbar -->
        <MDBNavbar expand="lg" light bg="light" container>
          <MDBNavbarBrand>{{ userName }}</MDBNavbarBrand>
        </MDBNavbar>
        <!-- Navbar -->
        <!-- Background image -->
        <div class="p-5 text-center bg-image" style="
        background-image: url('https://mdbootstrap.com/img/new/slides/041.webp');
        height: 150px;
      ">
          <div class="mask" style="background-color: rgba(0, 0, 0, 0.0.5);">
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
                    <MDBCol class="px-2 p-3 border w-100">
                      <RouterLink to="/docs">
                        <MDBIcon icon="file-alt" fw size="lg" style="color: #39C0ED; margin-right: 1vw;" />文件查詢
                      </RouterLink>
                    </MDBCol>
                    <MDBCol class=" px-2 p-3 border w-100">
                      <RouterLink to="/docs">
                        <MDBIcon icon="balance-scale" fw size="lg" style="color: #39C0ED; margin-right: 1vw;" />校正案件
                      </RouterLink>
                    </MDBCol>
                    <MDBCol class="px-2 p-3 border w-100">
                      <RouterLink to="/docs">
                        <MDBIcon icon="user-edit" fw size="lg" style="color: #39C0ED; margin-right: 1vw;" />人員管理
                      </RouterLink>
                    </MDBCol>
                    <MDBCol class="px-2 p-3 border w-100">
                      <RouterLink to="/docs">
                        <MDBIcon icon="map-marked-alt" fw size="lg" style="color: #39C0ED; margin-right: 1vw;" />點位管理
                      </RouterLink>
                    </MDBCol>
                    <MDBCol class="px-2 p-3 border w-100">
                      <RouterLink to="/docs">
                        <MDBIcon icon="drafting-compass" fw size="lg" style="color: #39C0ED; margin-right: 1vw;" />
                        參考值量測作業
                      </RouterLink>
                    </MDBCol>
                    <MDBCol class="px-2 p-3 border w-100">
                      <RouterLink to="/docs">
                        <MDBIcon icon="wrench" fw size="lg" style="color: #39C0ED; margin-right: 1vw;" />標準件管理
                      </RouterLink>
                    </MDBCol>
                    <MDBCol class="px-2 p-3 border w-100">
                      <RouterLink to="/docs">
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
