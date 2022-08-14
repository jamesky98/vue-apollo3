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
  query GetEmpByRole($roleType: String!) {
    getEmpByRole(role_type: $roleType) {
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
        chop
        model
        serial_number
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
};
