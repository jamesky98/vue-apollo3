import gql from "graphql-tag";

const GETALLCUST = gql`
  query GetAllCust($name: String, $orgName: String, $orgTaxid: String) {
    getAllCust(name: $name, org_name: $orgName, org_taxid: $orgTaxid) {
      id
      name
      address
      tel
      fax
      org_id
      cus_org {
        name
        tax_id
      }
    }
  }
`;
const GETCUSTBYID = gql`
  query GetCustById($getCustByIdId: Int!) {
    getCustById(id: $getCustByIdId) {
      id
      name
      address
      tel
      fax
      org_id
      cus_org {
        name
        tax_id
      }
    }
  }
`;

export default {
  GETALLCUST,
  GETCUSTBYID,
};
