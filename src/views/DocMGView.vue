<script setup>
import Footer1 from "../components/Footer.vue";
import Navbar1 from "../components/Navbar.vue";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBInput,
  MDBCol,
  MDBRow,
  MDBContainer,
  MDBBtn,
  MDBIcon
} from 'mdb-vue-ui-kit';
import DataTable from 'datatables.net-vue3';
import Select from 'datatables.net-select';
import DataTableBs5 from 'datatables.net-bs5';
import 'datatables.net-responsive';
import { useQuery,useMutation } from '@vue/apollo-composable'
import DocsGQL from "../graphql/Docs";
import { shouldWriteResult } from "@apollo/client/core/QueryInfo";

DataTable.use(DataTableBs5);
DataTable.use(Select);

// // 執行查詢
const { result,loading,error } = useQuery(
  DocsGQL.GETALLDOCLATEST,
);
</script>
<template>
  <MDBContainer fluid class="h-100">
    <MDBRow class="d-flex flex-md-column h-100">
      <Navbar1 />
      <main class="flex-fill">
        <MDBContainer fluid class="px-0 py-2 w-100 h-100">
          文件查詢
          <p v-if="result && result.getAllDocLatest">
            <DataTable :data="result.getAllDocLatest" class="display w-100">
            </DataTable>
          </p>
        </MDBContainer>
      </main>
      <Footer1 />
    </MDBRow>
  </MDBContainer>
</template>
