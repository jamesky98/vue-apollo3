import gql from "graphql-tag";

const GETRECORDBYPID = gql`
  query GetGcpRecordsByGCPId($gcpId: String!) {
    getGcpRecordsByGCPId(gcp_id: $gcpId) {
      id
      gcp_id
      project_id
      ref_project {
        project_code
        cal_type_id
        cal_type {
          name
          code
        }
        method
        year
        month
        organizer
      }
      date
      person
      status
      coor_E
      coor_N
      coor_h
      close_photo
      far_photo1
      far_photo2
      far_photo3
      obstruction
      ismodify
      comment
    }
  }
`;

const GETALLGCP = gql`
  query GetAllGcp(
    $projectId: Int
    $getAllGcpId: String
    $enable: Int
    $status: String
    $contactId: Int
  ) {
    getAllGcp(
      project_id: $projectId
      id: $getAllGcpId
      enable: $enable
      status: $status
      contact_id: $contactId
    ) {
      id
      gcp_record {
        project_id
        ref_project {
          project_code
          cal_type_id
          cal_type {
            name
            code
          }
          method
        }
        date
        person
        status
      }
      latest_coor {
        project_id
        coor_E
        coor_N
        coor_h
      }
      enable
      type_code
      gcp_type {
        type_name
      }
      need_contact
      contact_id
      gcp_contact {
        name
      }
      comment
    }
  }
`;

const GETALLCONTACT = gql`
  query GetAllContact {
    getAllContact {
      id
      name
      address
      person
      tel
      comment
    }
  }
`;

const GETGCPBYID = gql`
  mutation GetGcpById($getGcpByIdId: String!) {
    getGcpById(id: $getGcpByIdId) {
      id
      enable
      type_code
      gcp_type {
        type_name
      }
      ownership
      establishment
      Est_date
      pavement
      style
      pt_desc
      pt_map
      aerial_img
      need_contact
      contact_id
      gcp_contact {
        name
        address
        person
        tel
        comment
      }
      comment
    }
  }
`;

const GETGCPTYPE = gql`
  query GetGcpType {
    getGcpType {
      code
      type_name
    }
  }
`;

const UPDATEGCP = gql`
  mutation UpdateGCP(
    $updateGcpId: String!
    $enable: Int
    $typeCode: Int
    $ownership: String
    $establishment: String
    $estDate: Int
    $pavement: String
    $style: String
    $ptDesc: String
    $ptMap: String
    $aerialImg: String
    $needContact: Int
    $contactId: Int
    $comment: String
  ) {
    updateGCP(
      id: $updateGcpId
      enable: $enable
      type_code: $typeCode
      ownership: $ownership
      establishment: $establishment
      Est_date: $estDate
      pavement: $pavement
      style: $style
      pt_desc: $ptDesc
      pt_map: $ptMap
      aerial_img: $aerialImg
      need_contact: $needContact
      contact_id: $contactId
      comment: $comment
    ) {
      id
    }
  }
`;

export default {
  GETRECORDBYPID,
  GETALLGCP,
  GETALLCONTACT,
  GETGCPBYID,
  GETGCPTYPE,
  UPDATEGCP,
};
