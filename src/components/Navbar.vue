<script setup>
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBCollapse,
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from 'mdb-vue-ui-kit';
import { ref } from 'vue';
import { computed } from "@vue/reactivity";
import router from '../router';
import { logOut } from '../methods/User';

const username = ref(localStorage.getItem("USER_NAME")) ;
const collapse1 = ref(false);
const dropdown3 = ref(false);

</script>
<template>
  <!-- Navbar -->
  <MDBNavbar expand="xl" light bg="light" container>
    <MDBNavbarBrand>{{ username }}，您好</MDBNavbarBrand>
    <MDBNavbarToggler @click="collapse1 = !collapse1" target="#navbarSupportedContent"></MDBNavbarToggler>
    <MDBCollapse v-model="collapse1" id="navbarSupportedContent">
      <MDBNavbarNav class="mb-2 mb-xl-0">
        <MDBNavbarItem :to="{ name: 'main'}">
          <MDBIcon icon="home" />首頁
        </MDBNavbarItem>
        <MDBNavbarItem :to="{ name: 'docs'}">
          <MDBIcon icon="file-alt" />文件查詢
        </MDBNavbarItem>
        <MDBNavbarItem :to="{ name: 'cases'}">
          <MDBIcon icon="balance-scale" />校正案件
        </MDBNavbarItem>
        <MDBNavbarItem :to="{ name: 'employee'}">
          <MDBIcon icon="user-edit" />人員管理
        </MDBNavbarItem>
        <MDBNavbarItem :to="{ name: 'gcps'}">
          <MDBIcon icon="map-marked-alt" />點位管理
        </MDBNavbarItem>
        <MDBNavbarItem :to="{ name: 'prjs'}">
          <MDBIcon icon="drafting-compass" />量測作業
        </MDBNavbarItem>
        <MDBNavbarItem :to="{ name: 'items'}">
          <MDBIcon icon="wrench" />標準件管理
        </MDBNavbarItem>
        <MDBNavbarItem :to="{ name: 'cust'}">
          <MDBIcon far icon="handshake" />顧客管理
        </MDBNavbarItem>
        <MDBNavbarItem :to="{ name: 'ucedit'}">
          <MDBIcon far icon="project-diagram" />不確定度管理
        </MDBNavbarItem>

      </MDBNavbarNav>
      <MDBNavbarNav right class="ml-auto mb-xl-0">
        <MDBNavbarItem class="dropdown">
          <MDBDropdown v-model="dropdown3">
            <MDBDropdownToggle tag="a" class="nav-link" @click="dropdown3 = !dropdown3">
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
    </MDBCollapse>
  </MDBNavbar>
  <!-- Navbar -->
</template>
