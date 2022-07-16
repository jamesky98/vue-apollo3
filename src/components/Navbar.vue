<script setup>
import {
  MDBNavbar,
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBCollapse,
  MDBIcon
} from 'mdb-vue-ui-kit';
import { ref } from 'vue';
import router from '../router';

const collapse1 = ref(false);
const userName = '';

function logout(){
  localStorage.removeItem("AUTH_TOKEN");
  router.push('/login');
}

</script>
<template>
  <!-- Navbar -->
  <MDBNavbar expand="lg" light bg="light" container>
    <MDBNavbarBrand>{{ userName }}，您好</MDBNavbarBrand>
    <MDBNavbarToggler @click="collapse1 = !collapse1" target="#navbarSupportedContent"></MDBNavbarToggler>
    <MDBCollapse v-model="collapse1" id="navbarSupportedContent">
      <MDBNavbarNav class="mb-2 mb-lg-0">
        <MDBNavbarItem to="/" >
          <MDBIcon icon="home" />首頁
        </MDBNavbarItem>
        <MDBNavbarItem to="/docs">
          <MDBIcon icon="file-alt" />文件查詢
        </MDBNavbarItem>
        <MDBNavbarItem to="/cases">
          <MDBIcon icon="balance-scale" />校正案件
        </MDBNavbarItem>
        <MDBNavbarItem to="/employee">
          <MDBIcon icon="user-edit" />人員管理
        </MDBNavbarItem>
        <MDBNavbarItem to="/gcps">
          <MDBIcon icon="map-marked-alt" />點位管理
        </MDBNavbarItem>
        <MDBNavbarItem to="/prjs">
          <MDBIcon icon="drafting-compass" />量測作業
        </MDBNavbarItem>
        <MDBNavbarItem to="/items">
          <MDBIcon icon="wrench" />標準件管理
        </MDBNavbarItem>
        <MDBNavbarItem to="/cust">
          <MDBIcon far icon="handshake" />顧客管理
        </MDBNavbarItem>

      </MDBNavbarNav>
      <MDBNavbarNav right class="ml-auto mb-lg-0">
        <MDBNavbarItem to="#" @click="logout()">
          登出
        </MDBNavbarItem>
      </MDBNavbarNav>
    </MDBCollapse>
  </MDBNavbar>
  <!-- Navbar -->
</template>
