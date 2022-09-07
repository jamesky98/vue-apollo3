import gql from "graphql-tag";

const GETALLPRJ = gql`
  query GetAllPrj(
    $projectCode: String
    $pubdateStart: String
    $pubdateEnd: String
    $method: String
    $calTypeId: Int
  ) {
    getAllPrj(
      project_code: $projectCode
      pubdate_start: $pubdateStart
      pubdate_end: $pubdateEnd
      method: $method
      cal_type_id: $calTypeId
    ) {
      id
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
      start_date
      end_date
      publish_date
    }
  }
`;

const GETPRJBYID = gql`
  query GetPrjByID($getPrjByIdId: Int) {
    getPrjById(id: $getPrjByIdId) {
      id
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
      start_date
      end_date
      publish_date
    }
  }
`;

const CALREFGCP = gql`
  mutation CalRefGcp($projectId: Int, $status: String, $calTypeId: Int) {
    calRefGcp(
      project_id: $projectId
      status: $status
      cal_type_id: $calTypeId
    ) {
      id
      gcp_id
      gcp {
        type_code
      }
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
    }
  }
`;


// const SAVEPRJ = gql``;

export default {
  GETALLPRJ,
  GETPRJBYID,
  CALREFGCP,
  // SAVEPRJ,
};
