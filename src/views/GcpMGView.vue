<script setup>
import Footer1 from "../components/Footer.vue";
import Navbar1 from "../components/Navbar.vue";

</script>
<template>
  <MDBContainer fluid class="h-100">
    <MDBRow class="d-flex flex-md-column h-100">
      <Navbar1 />
      <main class="flex-fill">
        點位管理
      </main>
      <Footer1 />
    </MDBRow>
  </MDBContainer>
</template>
