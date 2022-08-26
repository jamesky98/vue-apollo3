import gql from "graphql-tag";

const GETALLPRJ = gql`
  query GetAllPrj(
    $projectCode: String
    $pubdateStart: String
    $pubdateEnd: String
  ) {
    getAllPrj(
      project_code: $projectCode
      pubdate_start: $pubdateStart
      pubdate_end: $pubdateEnd
    ) {
      id
      project_code
      cal_type_id
      cal_type {
        name
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

// const SAVEPRJ = gql``;

export default {
  GETALLPRJ,
  GETPRJBYID,
  // SAVEPRJ,
};
