import gql from "graphql-tag";

const GETALLCASE = gql`
  query GetAllCase(
    $getAllCaseId: String
    $statusCode: Int
    $calType: Int
    $operatorsId: Int
    $orgId: Int
    $itemChop: String
    $itemModel: String
    $itemSn: String
    $appdateStart: String
    $appdateEnd: String
    $paydateStart: String
    $paydateEnd: String
  ) {
    getAllCase(
      id: $getAllCaseId
      status_code: $statusCode
      cal_type: $calType
      operators_id: $operatorsId
      org_id: $orgId
      item_chop: $itemChop
      item_model: $itemModel
      item_sn: $itemSn
      appdate_start: $appdateStart
      appdate_end: $appdateEnd
      paydate_start: $paydateStart
      paydate_end: $paydateEnd
    ) {
      id
      status_code
      case_status {
        status
      }
      app_date
      cus_id
      cus {
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
      title
      address
      purpose
      cal_type
      cal_type_cal_typeTocase_base {
        name
        code
      }
      item_id
      item_base {
        chop
        model
        serial_number
        type
        item_type {
          type
        }
      }
      charge
      pay_date
      agreement
      leader_id
      employee_case_base_leader_idToemployee {
        name
      }
      operators_id
      employee_case_base_operators_idToemployee {
        name
      }
    }
  }
`;

const GETCASESTATUS = gql`
  query GetCaseStatus {
    getCaseStatus {
      code
      status
    }
  }
`;

const GETCASECALTYPE = gql`
  query GetCaseCalType {
    getCaseCalType {
      id
      name
      code
    }
  }
`;

const GETOPERATOR = gql`
  query GetEmpByRole($roleType: String!) {
    getEmpByRole(role_type: $roleType) {
      person_id
      name
    }
  }
`;

const GETALLORG = gql`
  query GetAllOrg {
    getAllOrg {
      id
      name
    }
  }
`;

const GETALLITEM = gql`
  query GetAllItem {
    getAllItem {
      id
      chop
      model
      serial_number
    }
  }
`;

export default {
  GETALLCASE,
  GETCASESTATUS,
  GETCASECALTYPE,
  GETOPERATOR,
  GETALLORG,
  GETALLITEM,
};
