import gql from "graphql-tag";

const GETALLCASE = gql`
  query GetAllCase(
    $getAllCaseId: String
    $statusCode: Int
    $calType: Int
    $operatorsId: Int
    $orgId: Int
    $itemChop: String
    $itemModel: String
    $itemSn: String
    $appdateStart: String
    $appdateEnd: String
    $paydateStart: String
    $paydateEnd: String
  ) {
    getAllCase(
      id: $getAllCaseId
      status_code: $statusCode
      cal_type: $calType
      operators_id: $operatorsId
      org_id: $orgId
      item_chop: $itemChop
      item_model: $itemModel
      item_sn: $itemSn
      appdate_start: $appdateStart
      appdate_end: $appdateEnd
      paydate_start: $paydateStart
      paydate_end: $paydateEnd
    ) {
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
      case_record_01 {
        complete_date
      }
      case_record_02 {
        complete_date
      }
    }
  }
`;

const GETCASESTATUS = gql`
  query GetCaseStatus {
    getCaseStatus {
      code
      status
    }
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

const GETOPERATOR = gql`
  query GetEmpByRole($roleType: String, $calType: Int) {
    getEmpByRole(role_type: $roleType, cal_type: $calType) {
      person_id
      name
    }
  }
`;

const GETALLORG = gql`
  query GetAllOrg {
    getAllOrg {
      id
      name
      tax_id
    }
  }
`;

const GETALLITEM = gql`
  query GetAllItem {
    getAllItem {
      id
      chop
      model
      serial_number
    }
  }
`;

const GETFULLCASEBYID = gql`
  query GetCasebyID($getCasebyIdId: String!) {
    getCasebyID(id: $getCasebyIdId) {
      id
      case_record_01 {
        id
        cam_type
        cam_type_cam_typeTocase_record_01 {
          cam_type
        }
        focal
        ppa_x
        ppa_y
        px_w
        px_h
        px_size_x
        px_size_y
        size_x
        size_y
        plan_year
        plan_month
        gsd
        strips_ns
        strips_ew
        end_lap
        side_lap
        ell_height
        agl
        cam_report
        plan_map
        receive_date
        fly_date
        strip_ns_ac
        strip_ew_ac
        end_lap_ac
        side_lap_ac
        ell_height_ac
        agl_ac
        gsd_ac
        cam_parm
        fly_map
        rec_table
        photo_no
        others
        err_data
        err_photo
        distor_corr_soft
        distor_corr_ver
        Undistortion
        start_Date
        ref_id
        ref_project {
          id
          project_code
          method
          year
          month
          organizer
          start_date
          end_date
          publish_date
          ref_use_eqpt {
            id
            eqpt_check_id
            ref_eqpt_check {
              eq_ck_id
              ref_eqpt_id
              check_date
              report_id
              cal_org
              cal_org_id
              ref_eqpt {
                serial_number
                chop
                model
                type
                ref_eqpt_type {
                  type
                }
                cal_cycle
              }
              pass
            }
          }
          cal_type_id
          cal_type {
            name
            code
          }
        }
        ref_file
        gcp_file
        total_pt
        meas_pt
        del_pt
        del_comt
        free_std
        free_file
        fix_std
        fix_file
        img_no
        ctr_no
        chk_no
        at_rpt
        connect_no
        obs_no
        redundancy
        RMS_x
        RMS_y
        RMS_z
        result_file
        net_graph
        gcp_graph
        std_h
        std_v
        k_h
        k_v
        std_file
        report_edit
        chk_date
        chk_person_id
        employee_case_record_01_chk_person_idToemployee {
          name
        }
        complete_date
        sign_date
        sign_person_id
        employee_case_record_01_sign_person_idToemployee {
          name
        }
        report_scan
        has_logo
        report_template
        distrotion
        record_tamplate
        eo_file
        recal_table
        uccal_table
        uc_model
      }
      case_record_02 {
        id
        type
        gnss_id
        item_base_case_record_02_gnss_idToitem_base {
          chop
          model
          serial_number
        }
        imu_id
        item_base_case_record_02_imu_idToitem_base {
          chop
          model
          serial_number
        }
        dis_presision
        ang_resolution
        beam
        prec_h
        prec_v
        omega
        phi
        kappa
        prec_ori
        plan_year
        plan_month
        strips_no
        ell_height
        agl
        cloud_density
        fov
        lidar_report
        pos_report
        plan_map
        receive_date
        fly_date
        strips_no_ac
        ell_height_ac
        agl_ac
        cloud_density_ac
        fov_ac
        fly_map
        rec_table
        files_no
        others
        err_data
        err_cloud
        start_Date
        ref_id
        ref_project {
          id
          project_code
          method
          year
          month
          organizer
          start_date
          end_date
          publish_date
          ref_use_eqpt {
            id
            eqpt_check_id
            ref_eqpt_check {
              eq_ck_id
              ref_eqpt_id
              check_date
              report_id
              cal_org
              cal_org_id
              ref_eqpt {
                serial_number
                chop
                model
                type
                ref_eqpt_type {
                  type
                }
                cal_cycle
              }
              pass
            }
          }
          cal_type_id
          cal_type {
            name
            code
          }
        }
        total_pt
        gcp_file
        meas_file
        result_file
        std_h
        std_v
        k_h
        k_v
        std_file
        report_edit
        chk_date
        chk_person_id
        employee_case_record_02_chk_person_idToemployee {
          name
        }
        complete_date
        sign_date
        sign_person_id
        employee_case_record_02_sign_person_idToemployee {
          name
        }
        report_scan
        has_logo
        report_template
        record_tamplate
        recal_table
        uccal_table
        uc_model
      }
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
        id
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

const GETSIMPLECASEBYID = gql`
  query GetCasebyID($getCasebyIdId: String!) {
    getCasebyID(id: $getCasebyIdId) {
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

const ADDCASE = gql`
  mutation CreatCase(
    $creatCaseId: String!
    $calType: Int!
    $appDate: Date
    $purpose: String
  ) {
    creatCase(
      id: $creatCaseId
      cal_type: $calType
      app_date: $appDate
      purpose: $purpose
    ) {
      id
    }
  }
`;

const DELCASE = gql`
  mutation DelCase($delCaseId: String!) {
    delCase(id: $delCaseId) {
      id
    }
  }
`;

const SAVECASESIMPLE = gql`
  mutation UpdateCase(
    $updateCaseId: String!
    $statusCode: Int
    $appDate: Date
    $cusId: Int
    $title: String
    $address: String
    $purpose: String
    $calType: Int
    $itemId: Int
    $charge: Int
    $payDate: Date
    $agreement: String
    $leaderId: Int
    $operatorsId: Int
  ) {
    updateCase(
      id: $updateCaseId
      status_code: $statusCode
      app_date: $appDate
      cus_id: $cusId
      title: $title
      address: $address
      purpose: $purpose
      cal_type: $calType
      item_id: $itemId
      charge: $charge
      pay_date: $payDate
      agreement: $agreement
      leader_id: $leaderId
      operators_id: $operatorsId
    ) {
      id
    }
  }
`;

const SAVECASERECORD01 = gql`
  mutation UpdateRecord01(
    $updateRecord01Id: String!
    $camType: Int
    $focal: Float
    $ppaX: Float
    $ppaY: Float
    $pxW: Int
    $pxH: Int
    $pxSizeX: Float
    $pxSizeY: Float
    $sizeX: Float
    $sizeY: Float
    $planYear: Int
    $planMonth: Int
    $gsd: Float
    $stripsNs: Int
    $stripsEw: Int
    $endLap: Float
    $sideLap: Float
    $ellHeight: Float
    $agl: Float
    $camReport: String
    $planMap: String
    $receiveDate: Date
    $flyDate: Date
    $stripNsAc: Int
    $stripEwAc: Int
    $endLapAc: Float
    $sideLapAc: Float
    $ellHeightAc: Float
    $aglAc: Float
    $gsdAc: Float
    $camParm: String
    $flyMap: String
    $recTable: String
    $photoNo: Int
    $others: String
    $errData: String
    $errPhoto: String
    $distorCorrSoft: String
    $distorCorrVer: String
    $undistortion: Boolean
    $startDate: Date
    $refId: Int
    $refFile: String
    $gcpFile: String
    $totalPt: Int
    $measPt: Int
    $delPt: Int
    $delComt: String
    $freeStd: Float
    $freeFile: String
    $fixStd: Float
    $fixFile: String
    $imgNo: Int
    $ctrNo: Int
    $chkNo: Int
    $atRpt: String
    $connectNo: Int
    $obsNo: Int
    $redundancy: Int
    $rmsX: Float
    $rmsY: Float
    $rmsZ: Float
    $resultFile: String
    $netGraph: String
    $gcpGraph: String
    $stdH: Float
    $stdV: Float
    $kH: Float
    $kV: Float
    $stdFile: String
    $reportEdit: String
    $chkDate: Date
    $chkPersonId: Int
    $completeDate: Date
    $signDate: Date
    $signPersonId: Int
    $reportScan: String
    $hasLogo: Boolean
    $reportTemplate: String
    $distrotion: String
    $recordTamplate: String
    $eoFile: String
    $recalTable: String
    $uccalTable: String
    $ucModel: String
  ) {
    updateRecord01(
      id: $updateRecord01Id
      cam_type: $camType
      focal: $focal
      ppa_x: $ppaX
      ppa_y: $ppaY
      px_w: $pxW
      px_h: $pxH
      px_size_x: $pxSizeX
      px_size_y: $pxSizeY
      size_x: $sizeX
      size_y: $sizeY
      plan_year: $planYear
      plan_month: $planMonth
      gsd: $gsd
      strips_ns: $stripsNs
      strips_ew: $stripsEw
      end_lap: $endLap
      side_lap: $sideLap
      ell_height: $ellHeight
      agl: $agl
      cam_report: $camReport
      plan_map: $planMap
      receive_date: $receiveDate
      fly_date: $flyDate
      strip_ns_ac: $stripNsAc
      strip_ew_ac: $stripEwAc
      end_lap_ac: $endLapAc
      side_lap_ac: $sideLapAc
      ell_height_ac: $ellHeightAc
      agl_ac: $aglAc
      gsd_ac: $gsdAc
      cam_parm: $camParm
      fly_map: $flyMap
      rec_table: $recTable
      photo_no: $photoNo
      others: $others
      err_data: $errData
      err_photo: $errPhoto
      distor_corr_soft: $distorCorrSoft
      distor_corr_ver: $distorCorrVer
      Undistortion: $undistortion
      start_Date: $startDate
      ref_id: $refId
      ref_file: $refFile
      gcp_file: $gcpFile
      total_pt: $totalPt
      meas_pt: $measPt
      del_pt: $delPt
      del_comt: $delComt
      free_std: $freeStd
      free_file: $freeFile
      fix_std: $fixStd
      fix_file: $fixFile
      img_no: $imgNo
      ctr_no: $ctrNo
      chk_no: $chkNo
      at_rpt: $atRpt
      connect_no: $connectNo
      obs_no: $obsNo
      redundancy: $redundancy
      RMS_x: $rmsX
      RMS_y: $rmsY
      RMS_z: $rmsZ
      result_file: $resultFile
      net_graph: $netGraph
      gcp_graph: $gcpGraph
      std_h: $stdH
      std_v: $stdV
      k_h: $kH
      k_v: $kV
      std_file: $stdFile
      report_edit: $reportEdit
      chk_date: $chkDate
      chk_person_id: $chkPersonId
      complete_date: $completeDate
      sign_date: $signDate
      sign_person_id: $signPersonId
      report_scan: $reportScan
      has_logo: $hasLogo
      report_template: $reportTemplate
      distrotion: $distrotion
      record_tamplate: $recordTamplate
      eo_file: $eoFile
      recal_table: $recalTable
      uccal_table: $uccalTable
      uc_model: $ucModel
    ) {
      id
    }
  }
`;

// const SAVECASERECORD02 = gql``;
const UPLOADFILE = gql`
  mutation UploadFile(
    $file: Upload!
    $subpath: String!
    $newfilename: String!
  ) {
    uploadFile(file: $file, subpath: $subpath, newfilename: $newfilename) {
      filename
      mimetype
      encoding
    }
  }
`;

const COMPUTEUC = gql`
  mutation ComputeUc($parm: String, $ucModel: String) {
    computeUc(parm: $parm, uc_model: $ucModel) {
      ucH
      freeH
      tinvH
      ucV
      freeV
      tinvV
      calType
      prjcode
      ver
      minUcH
      minUcV
      confLevel
      uom
      digPosH
      digPosV
      fixUcH
      fixUcV
      data {
        section
        type
        comment
        combUx
        combFr
        data {
          name
          frequency
          x
          x_title
          fr
          fr_title
          fa
          fa_title
          ux
          freedom
          factor
        }
      }
    }
  }
`;

const GETUCLIST = gql`
  mutation Getuclist($caltypecode: String, $refprjcode: String) {
    getUclist(caltypecode: $caltypecode, refprjcode: $refprjcode)
  }
`;

const BUILDREPORT01 = gql`
  mutation BuildReport01($parm: String, $reportSample: String) {
    buildReport01(parm: $parm, report_sample: $reportSample)
  }
`;

export default {
  GETALLCASE,
  GETCASESTATUS,
  GETCASECALTYPE,
  GETOPERATOR,
  GETALLORG,
  GETALLITEM,
  GETFULLCASEBYID,
  GETSIMPLECASEBYID,
  ADDCASE,
  DELCASE,
  SAVECASESIMPLE,
  SAVECASERECORD01,
  UPLOADFILE,
  COMPUTEUC,
  GETUCLIST,
  BUILDREPORT01,
  // SAVECASERECORD02,
};
