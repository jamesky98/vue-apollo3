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
import { ref, inject } from 'vue';
import { computed } from "@vue/reactivity";
import router from '../router';
import { logOut } from '../methods/User';

const NavItem = inject("NavItem");
const username = ref(localStorage.getItem("USER_NAME2")) ;
const usercode = ref(localStorage.getItem("USER_NAME")) ;
const userRole = ref(localStorage.getItem("USER_ROLE")) ;
const roleType = inject("roleType");
const collapse1 = ref(false);
const dropdown3 = ref(false);

</script>
<template>
  <!-- Navbar -->
  <MDBNavbar expand="xl" light bg="light" container>
    <MDBNavbarBrand>{{ username }}<span style="font-size: 0.9rem; color: blue;">({{ roleType[userRole] }})</span>，您好</MDBNavbarBrand>
    <MDBNavbarToggler @click="collapse1 = !collapse1" target="#navbarSupportedContent"></MDBNavbarToggler>
    <MDBCollapse v-model="collapse1" id="navbarSupportedContent">
      <MDBNavbarNav class="mb-2 mb-xl-0">
        <MDBNavbarItem :to="{ name: 'main'}" :class="NavItem==='main'?'hiddenNav':''">
          <MDBIcon icon="home" />首頁
        </MDBNavbarItem>
        <MDBNavbarItem :to="{ name: 'docs'}" :linkClass="NavItem==='docs'?'activeNav':''" :class="NavItem==='main'?'hiddenNav':''">
          <MDBIcon icon="file-alt" />文件查詢
        </MDBNavbarItem>
        <MDBNavbarItem :to="{ name: 'cases'}" :linkClass="NavItem==='cases'?'activeNav':''" :class="NavItem==='main'?'hiddenNav':''">
          <MDBIcon icon="balance-scale"/>校正案件
        </MDBNavbarItem>
        <MDBNavbarItem :to="{ name: 'employee'}" :linkClass="NavItem==='employee'?'activeNav':''" :class="NavItem==='main'?'hiddenNav':''">
          <MDBIcon icon="user-edit" />人員管理
        </MDBNavbarItem>
        <MDBNavbarItem :to="{ name: 'gcps'}" :linkClass="NavItem==='gcps'?'activeNav':''" :class="NavItem==='main'?'hiddenNav':''">
          <MDBIcon icon="map-marked-alt" />點位管理
        </MDBNavbarItem>
        <MDBNavbarItem :to="{ name: 'prjs'}" :linkClass="NavItem==='prjs'?'activeNav':''" :class="NavItem==='main'?'hiddenNav':''">
          <MDBIcon icon="drafting-compass" />量測作業
        </MDBNavbarItem>
        <MDBNavbarItem :to="{ name: 'items'}" :linkClass="NavItem==='items'?'activeNav':''" :class="NavItem==='main'?'hiddenNav':''">
          <MDBIcon icon="wrench" />標準件管理
        </MDBNavbarItem>
        <MDBNavbarItem :to="{ name: 'cust'}" :linkClass="NavItem==='cust'?'activeNav':''" :class="NavItem==='main'?'hiddenNav':''">
          <MDBIcon far icon="handshake" />顧客管理
        </MDBNavbarItem>
        <MDBNavbarItem :to="{ name: 'ucedit'}" :linkClass="NavItem==='ucedit'?'activeNav':''" :class="NavItem==='main'?'hiddenNav':''">
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
                <RouterLink :to="{ path: '/useredit', query: { userName: usercode }}">
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
<style>
  .activeNav{
    color: #FFF !important;
    background-color: #1266f18c;
    box-shadow: 0 2px 5px 0 rgb(0 0 0 / 20%), 0 2px 10px 0 rgb(0 0 0 / 10%);
  }
  .hiddenNav{
    display: none;
  }
</style>