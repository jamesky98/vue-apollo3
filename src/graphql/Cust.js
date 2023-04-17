import gql from "graphql-tag";

const GETALLCUST = gql`
  mutation GetAllCust($name: String,$orgId:Int ,$orgName: String, $orgTaxid: String) {
    getAllCust(name: $name,org_id: $orgId ,org_name: $orgName, org_taxid: $orgTaxid) {
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
  mutation GetCustById($getCustByIdId: Int) {
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
const UPDATECUST = gql`
  mutation UpdateCust(
    $updateCustId: Int!
    $name: String
    $address: String
    $tel: String
    $fax: String
    $orgId: Int
  ) {
    updateCust(
      id: $updateCustId
      name: $name
      address: $address
      tel: $tel
      fax: $fax
      org_id: $orgId
    ) {
      id
    }
  }
`;

const GETCUSTBYNAME = gql`
mutation GetCustByName($name: String) {
  getCustByName(name: $name) {
    id
  }
}
`;

const UPDATEORG = gql`
mutation UpdateOrg($updateOrgId: Int!, $name: String, $taxId: String) {
  updateOrg(id: $updateOrgId, name: $name, tax_id: $taxId) {
    id
  }
}
`;

const DELORG = gql`
  mutation DelOrg($delOrgId: Int!) {
    delOrg(id: $delOrgId) {
      id
    }
  }
`;

const DELCUST = gql`
  mutation DelCust($delCustId: Int!) {
    delCust(id: $delCustId) {
      id
    }
  }
`;

export default {
  GETALLCUST,
  GETCUSTBYID,
  UPDATECUST,
  GETCUSTBYNAME,
  UPDATEORG,
  DELORG,
  DELCUST,
};
