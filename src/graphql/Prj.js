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
      gcp {
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
  }
`;

const SAVEPRJ = gql`
  mutation UpdateRefPrj(
    $updateRefPrjId: Int!
    $projectCode: String
    $calTypeId: Int
    $method: String
    $year: Int
    $month: Int
    $organizer: String
    $startDate: Date
    $endDate: Date
    $publishDate: Date
  ) {
    updateRefPrj(
      id: $updateRefPrjId
      project_code: $projectCode
      cal_type_id: $calTypeId
      method: $method
      year: $year
      month: $month
      organizer: $organizer
      start_date: $startDate
      end_date: $endDate
      publish_date: $publishDate
    ) {
      id
      project_code
    }
  }
`;
const DELPRJ = gql`
  mutation DelRefPrj($delRefPrjId: Int!) {
    delRefPrj(id: $delRefPrjId) {
      id
      project_code
    }
  }
`;

const INPUTGCPRECORDS = gql`
mutation InputGCPRecords($records: [gcp_records]) {
  inputGCPRecords(records: $records)
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

const GETEQPTBYRRJID = gql`
mutation GetEqptByPrj($getEqptByPrjId: Int!) {
  getEqptByPrj(id: $getEqptByPrjId) {
    id
    project_id
    eqpt_check_id
    ref_eqpt_check {
      ref_eqpt_id
      ref_eqpt {
        chop
        model
        serial_number
        type
        ref_eqpt_type {
          type
        }
        cal_cycle
        comment
      }
      chek_type
      check_date
      report_id
      cal_org
      cal_org_id
      pass
      result
      comment
    }
  }
}
`;

const GETALLEQPT = gql`
query GetAllEqpt($type: Int) {
  getAllEqpt(type: $type) {
    ref_equpt_id
    serial_number
    chop
    model
    type
    ref_eqpt_type {
      type
    }
    cal_cycle
    comment
    latest_chk {
      check_date
      report_id
      cal_org
      cal_org_id
      pass
      result
      comment
    }
  }
}
`;

const GETEQPTTYPE = gql`
query GetEqptType {
  getEqptType {
    eqpt_type_id
    type
  }
}
`;

const GETCHKBYEQPTID = gql`
mutation GetChkByEqptId($refEqptId: Int) {
  getChkByEqptId(ref_eqpt_id: $refEqptId) {
    eq_ck_id
    ref_eqpt_id
    ref_eqpt {
      chop
      model
      serial_number
      ref_eqpt_type {
        type
      }
      cal_cycle
      comment
    }
    chek_type
    check_date
    report_id
    cal_org
    cal_org_id
    pass
    result
    comment
  }
}
`;

const GETCHKBYID = gql`
mutation GetChkById($eqCkId: Int) {
  getChkById(eq_ck_id: $eqCkId) {
    eq_ck_id
    ref_eqpt_id
    ref_eqpt {
      ref_equpt_id
      serial_number
      chop
      model
      type
      ref_eqpt_type {
        type
      }
      cal_cycle
      comment
    }
    chek_type
    check_date
    report_id
    cal_org
    cal_org_id
    pass
    result
    comment
  }
}
`;

export default {
  GETALLPRJ,
  GETPRJBYID,
  CALREFGCP,
  SAVEPRJ,
  DELPRJ,
  INPUTGCPRECORDS,
  GETCASECALTYPE,
  GETEQPTBYRRJID,
  GETALLEQPT,
  GETEQPTTYPE,
  GETCHKBYEQPTID,
  GETCHKBYID,
};
