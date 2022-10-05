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

export default {
  GETRECORDBYPID,
};
