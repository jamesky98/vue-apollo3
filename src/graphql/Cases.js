import gql from "graphql-tag";

const GETALLCASE = gql`
  query GetAllCase {
    getAllCase {
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

export default {
  GETALLCASE,
};
