import gql from "graphql-tag";

const GETALLITEM = gql`
  mutation GetAllItem($chop: String, $model: String, $serialNumber: String, $type: Int, $orgId: Int) {
    getAllItem(chop: $chop, model: $model, serial_number: $serialNumber, type: $type, org_id: $orgId) {
      id
      chop
      model
      serial_number
      type
      item_type {
        type
      }
      case_base {
        id
        employee_case_base_operators_idToemployee {
          name
        }
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
        case_record_01 {
          complete_date
          sign_person_id
        }
        case_record_02 {
          complete_date
          sign_person_id
        }
      }
    }
  }
`;
const GETITEMBYID = gql`
  mutation GetItemByID($getItemByIdId: Int) {
    getItemByID(id: $getItemByIdId) {
      id
      chop
      model
      serial_number
      type
      item_type {
        type
      }
    }
  }
`;

const GETALLITEMTYPE = gql`
  mutation GetAllItemType {
    getAllItemType {
      id
      type
    }
  }
`;

const SAVEITEM = gql`
  mutation UpdateItem(
    $updateItemId: Int!
    $chop: String
    $model: String
    $serialNumber: String
    $type: Int
  ) {
    updateItem(
      id: $updateItemId
      chop: $chop
      model: $model
      serial_number: $serialNumber
      type: $type
    ) {
      id
    }
  }
`;

const GETITEMBYSN = gql`
mutation GetItemBySN($sn: String) {
  getItemBySN(serial_number: $sn) {
    id
  }
}
`;

const DELITEM = gql`
  mutation DelItem($delItemId: Int!) {
    delItem(id: $delItemId) {
      id
    }
  }
`;

export default {
  GETALLITEM,
  GETITEMBYID,
  GETALLITEMTYPE,
  SAVEITEM,
  GETITEMBYSN,
  DELITEM,
};
