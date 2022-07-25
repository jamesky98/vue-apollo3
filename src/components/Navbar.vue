<script setup>
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBCollapse,
  MDBIcon
} from 'mdb-vue-ui-kit';
import { ref } from 'vue';
import router from '../router';
import { logOut } from '../methods/User';

const username = localStorage.getItem("USER_NAME");
const collapse1 = ref(false);

</script>
<template>
  <!-- Navbar -->
  <MDBNavbar expand="xl" light bg="light" container>
    <MDBNavbarBrand>{{ username }}，您好</MDBNavbarBrand>
    <MDBNavbarToggler @click="collapse1 = !collapse1" target="#navbarSupportedContent"></MDBNavbarToggler>
    <MDBCollapse v-model="collapse1" id="navbarSupportedContent">
      <MDBNavbarNav class="mb-2 mb-xl-0">
        <MDBNavbarItem :to="{ name: 'home', params: { username: username }}">
          <MDBIcon icon="home" />首頁
        </MDBNavbarItem>
        <MDBNavbarItem :to="{ name: 'docs', params: { username: username }}">
          <MDBIcon icon="file-alt" />文件查詢
        </MDBNavbarItem>
        <MDBNavbarItem :to="{ name: 'cases', params: { username: username }}">
          <MDBIcon icon="balance-scale" />校正案件
        </MDBNavbarItem>
        <MDBNavbarItem :to="{ name: 'employee', params: { username: username }}">
          <MDBIcon icon="user-edit" />人員管理
        </MDBNavbarItem>
        <MDBNavbarItem :to="{ name: 'gcps', params: { username: username }}">
          <MDBIcon icon="map-marked-alt" />點位管理
        </MDBNavbarItem>
        <MDBNavbarItem :to="{ name: 'prjs', params: { username: username }}">
          <MDBIcon icon="drafting-compass" />量測作業
        </MDBNavbarItem>
        <MDBNavbarItem :to="{ name: 'items', params: { username: username }}">
          <MDBIcon icon="wrench" />標準件管理
        </MDBNavbarItem>
        <MDBNavbarItem :to="{ name: 'cust', params: { username: username }}">
          <MDBIcon far icon="handshake" />顧客管理
        </MDBNavbarItem>

      </MDBNavbarNav>
      <MDBNavbarNav right class="ml-auto mb-xl-0">
        <MDBNavbarItem to="#" @click="logOut()">
          登出
        </MDBNavbarItem>
      </MDBNavbarNav>
    </MDBCollapse>
  </MDBNavbar>
  <!-- Navbar -->
</template>
