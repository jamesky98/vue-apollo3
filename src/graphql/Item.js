import gql from "graphql-tag";

const GETALLITEM = gql`
  query GetAllItem(
    $chop: String
    $model: String
    $serialNumber: String
    $type: Int
  ) {
    getAllItem(
      chop: $chop
      model: $model
      serial_number: $serialNumber
      type: $type
    ) {
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
const GETITEMBYID = gql`
  query GetItemByID($getItemByIdId: Int) {
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
  query GetAllItemType {
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

export default {
  GETALLITEM,
  GETITEMBYID,
  GETALLITEMTYPE,
  SAVEITEM,
  GETITEMBYSN,
};
