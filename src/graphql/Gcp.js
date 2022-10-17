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
  mutation GetAllGcp(
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

const GETRECORDBYID = gql`
  mutation GetGcpRecordById($getGcpRecordByIdId: Int!) {
    getGcpRecordById(id: $getGcpRecordByIdId) {
      id
      gcp_id
      project_id
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
      ref_project {
        project_code
      }
    }
  }
`;

const GETRECPERSON = gql`
  mutation Mutation {
    getAllRecPersonList
  }
`;

const DELGCP = gql`
  mutation DelGCP($delGcpId: String!) {
    delGCP(id: $delGcpId) {
      id
    }
  }
`;

const UPDATEGCPRECORD = gql`
  mutation UpdateGcpRecord(
    $updateGcpRecordId: Int!
    $gcpId: String
    $projectId: Int
    $date: Date
    $person: String
    $status: String
    $coorE: Float
    $coorN: Float
    $coorH: Float
    $closePhoto: String
    $farPhoto1: String
    $farPhoto2: String
    $farPhoto3: String
    $obstruction: String
    $comment: String
  ) {
    updateGcpRecord(
      id: $updateGcpRecordId
      gcp_id: $gcpId
      project_id: $projectId
      date: $date
      person: $person
      status: $status
      coor_E: $coorE
      coor_N: $coorN
      coor_h: $coorH
      close_photo: $closePhoto
      far_photo1: $farPhoto1
      far_photo2: $farPhoto2
      far_photo3: $farPhoto3
      obstruction: $obstruction
      comment: $comment
    ) {
      id
      gcp_id
      project_id
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
      comment
    }
  }
`;

const DELGCPRECORD = gql`
  mutation DelGcpRecord($delGcpRecordId: Int!) {
    delGcpRecord(id: $delGcpRecordId) {
      id
      gcp_id
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
  GETRECORDBYID,
  GETRECPERSON,
  DELGCP,
  UPDATEGCPRECORD,
  DELGCPRECORD,
};
