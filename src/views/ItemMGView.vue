<script setup>
import Footer1 from "../components/Footer.vue";
import Navbar1 from "../components/Navbar.vue";
import { ref, reactive, onMounted, provide } from "vue";
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

// 判斷token狀況
import { useQuery, useMutation } from '@vue/apollo-composable';
import UsersGQL from "../graphql/Users";
import { logIn, logOut, toTWDate } from '../methods/User';

const { mutate: getchecktoken, onDone: getchecktokenOnDone } = useMutation(UsersGQL.CHECKTOKEN);
getchecktokenOnDone(result => {
  // console.log(result.data)
  if (!result.data.checktoken) {
    logOut();
  }
});
getchecktoken();

const NavItem = ref("items");
provide("NavItem",NavItem);

</script>
<template>
  <MDBContainer fluid class="h-100">
    <MDBRow class="d-flex flex-md-column h-100">
      <Navbar1/>
      <main class="flex-fill">
        標準件管理
      </main>
      <Footer1 />
    </MDBRow>
  </MDBContainer>
</template>
