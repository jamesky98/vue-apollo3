import gql from "graphql-tag";

const GETALLPRJ = gql`
  mutation GetAllPrj(
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
  mutation GetPrjByID($getPrjByIdId: Int) {
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

const SAVEPRJEQPTUSE = gql`
  mutation SavePrjEqptUse($records: [ref_use_eqpts]) {
    savePrjEqptUse(records: $records)
  }
`;

const DELPRJEQPTUSE = gql`
  mutation DelPrjEqptUse($recordsId: [Int]) {
    delPrjEqptUse(recordsId: $recordsId)
  }
`;

const GETCASECALTYPE = gql`
  mutation GetCaseCalType {
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
  mutation GetAllEqpt($type: Int) {
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

const GETEQPTBYID = gql`
  mutation GetEqptById($refEquptId: Int!) {
    getEqptById(ref_equpt_id: $refEquptId) {
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
  }
`;

const GETEQPTTYPE = gql`
  mutation GetEqptType {
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

const GETALLCHKORGLIST = gql`
  mutation GetAllChkOrgList {
    getAllChkOrgList
  }
`;

const DELREFEQPTCHK = gql`
  mutation DelRefEqptChk($eqCkId: Int!) {
    delRefEqptChk(eq_ck_id: $eqCkId) {
      eq_ck_id
    }
  }
`;

const SAVEREFEQPTCHK = gql`
  mutation UpdateRefEqptChk(
    $eqCkId: Int!
    $refEqptId: Int
    $chekType: String
    $checkDate: Date
    $reportId: String
    $calOrg: String
    $calOrgId: String
    $pass: Boolean
    $result: String
    $comment: String
  ) {
    updateRefEqptChk(
      eq_ck_id: $eqCkId
      ref_eqpt_id: $refEqptId
      chek_type: $chekType
      check_date: $checkDate
      report_id: $reportId
      cal_org: $calOrg
      cal_org_id: $calOrgId
      pass: $pass
      result: $result
      comment: $comment
    ) {
      eq_ck_id
    }
  }
`;

const GETCHOPLIST = gql`
  mutation GetEqptChopList {
    getEqptChopList
  }
`;

const GETMODELLIST = gql`
  mutation GetEqptModelList {
    getEqptModelList
  }
`;

const DELREFEQPT = gql`
  mutation DelRefEqpt($refEquptId: Int!) {
    delRefEqpt(ref_equpt_id: $refEquptId) {
      ref_equpt_id
    }
  }
`;

const SAVEREFEQPT = gql`
  mutation UpdateRefEqpt(
    $refEquptId: Int!
    $chop: String
    $model: String
    $serialNumber: String
    $type: Int
    $calCycle: String
    $comment: String
  ) {
    updateRefEqpt(
      ref_equpt_id: $refEquptId
      chop: $chop
      model: $model
      serial_number: $serialNumber
      type: $type
      cal_cycle: $calCycle
      comment: $comment
    ) {
      ref_equpt_id
    }
  }
`;

const GETALLCTLCHART = gql`
  mutation GetAllCtlChart($calCode: String!) {
    getAllCtlChart(cal_code: $calCode)
  }
`;

const GECTLCHARTDATA = gql`
  mutation GetCtlChartData($prjId: String, $calCode: String) {
    getCtlChartData(prj_id: $prjId, cal_code: $calCode) {
      id
      prj_id_base
      prj_id
      cal_code
      label
      ave
      std
      min
      max
    }
  }
`;

const COMPUTECTLCHART = gql`
  mutation ComputeCtlChart($prjId: String!, $calCode: String!, $label: String, $prjIdBase: String) {
    computeCtlChart(prj_id: $prjId, cal_code: $calCode, label: $label, prj_id_base: $prjIdBase)
  }
`;

export default {
  GETALLPRJ,
  GETPRJBYID,
  CALREFGCP,
  SAVEPRJ,
  DELPRJ,
  INPUTGCPRECORDS,
  SAVEPRJEQPTUSE,
  DELPRJEQPTUSE,
  GETCASECALTYPE,
  GETEQPTBYRRJID,
  GETALLEQPT,
  GETEQPTBYID,
  GETEQPTTYPE,
  GETCHKBYEQPTID,
  GETCHKBYID,
  GETALLCHKORGLIST,
  DELREFEQPTCHK,
  SAVEREFEQPTCHK,
  GETCHOPLIST,
  GETMODELLIST,
  DELREFEQPT,
  SAVEREFEQPT,
  GETALLCTLCHART,
  GECTLCHARTDATA,
  COMPUTECTLCHART,
};
