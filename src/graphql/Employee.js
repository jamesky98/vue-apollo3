import gql from "graphql-tag";

const GETALLEMP = gql`
  query GetAllEmp {
    getAllEmp {
      person_id
      lab_ee_id
      modify_date
      name
      id_number
      birth_date
      job_title
      Appointment_date
      resignation_date
      address
      tel
      mobile
      Email
      education
      experience
      comment
    }
  }
`;

const GETEMPBYID = gql`
  query GetEmpById($personId: Int) {
    getEmpById(person_id: $personId) {
      person_id
      lab_ee_id
      modify_date
      name
      id_number
      birth_date
      job_title
      Appointment_date
      resignation_date
      address
      tel
      mobile
      Email
      education
      experience
      comment
    }
  }
`;

const DELEMP = gql`
  mutation DelEmp($personId: Int!) {
    delEmp(person_id: $personId) {
      person_id
    }
  }
`;

const UPDATEEMP = gql`
  mutation UpdateEmp($personId: Int!, $labEeId: String, $name: String, $idNumber: String, $birthDate: Date, $jobTitle: String, $appointmentDate: Date, $resignationDate: Date, $address: String, $tel: String, $mobile: String, $email: String, $education: String, $experience: String, $comment: String) {
    updateEmp(person_id: $personId, lab_ee_id: $labEeId, name: $name, id_number: $idNumber, birth_date: $birthDate, job_title: $jobTitle, Appointment_date: $appointmentDate, resignation_date: $resignationDate, address: $address, tel: $tel, mobile: $mobile, Email: $email, education: $education, experience: $experience, comment: $comment) {
      person_id
    }
  }
`;

const GETTRAIN = gql`
  query GetTrainByPerson($personId: Int) {
    getTrainByPerson(person_id: $personId) {
      train_id
      train_name
      end_date
      train_institution
      Certificate_no
      upload
      comment
    }
  }
`;

const GETTRAINBYID = gql`
  mutation GetTrainByID($trainId: Int) {
    getTrainByID(train_id: $trainId) {
      train_id
      person_id
      train_name
      end_date
      train_institution
      Certificate_no
      upload
      comment
    }
  }
`;

const GETEMPOWER = gql`
query GetEmpowerByPerson($personId: Int) {
  getEmpowerByPerson(person_id: $personId) {
    empower_id
    cal_type
    cal_type_cal_typeToemployee_empower {
      name
      code
    }
    role_type
    assessment_result
    assessor
    employee_employeeToemployee_empower_assessor {
      name
    }
    assessment_date
    lab_supervisor
    employee_employeeToemployee_empower_lab_supervisor {
      name
    }
    empower_date
    suspension_date
    table_upload
    approval_doc
    comment
  }
}
`;

const GETEMPOWERBYID = gql`
  mutation GetEmpowerByID($empowerId: Int) {
    getEmpowerByID(empower_id: $empowerId) {
      empower_id
      person_id
      cal_type
      cal_type_cal_typeToemployee_empower {
        name
        code
      }
      role_type
      assessment_result
      assessor
      employee_employeeToemployee_empower_assessor {
        name
      }
      assessment_date
      lab_supervisor
      employee_employeeToemployee_empower_lab_supervisor {
        name
      }
      empower_date
      suspension_date
      table_upload
      approval_doc
      comment
    }
  }
`;

const UPDATETRAIN = gql`
mutation UpdateTrain($trainId: Int!, $personId: Int, $trainName: String, $endDate: Date, $trainInstitution: String, $certificateNo: String, $upload: String, $comment: String) {
  updateTrain(train_id: $trainId, person_id: $personId, train_name: $trainName, end_date: $endDate, train_institution: $trainInstitution, Certificate_no: $certificateNo, upload: $upload, comment: $comment) {
    train_id
  }
}
`;

const CREATETRAIN = gql`
mutation CreateTrain($personId: Int!, $trainName: String!, $trainInstitution: String!, $endDate: Date, $certificateNo: String, $upload: String, $comment: String) {
  createTrain(person_id: $personId, train_name: $trainName, train_institution: $trainInstitution, end_date: $endDate, Certificate_no: $certificateNo, upload: $upload, comment: $comment) {
    train_id
  }
}
`;

const DELTRAIN = gql`
mutation DelTrain($trainId: Int!) {
  delTrain(train_id: $trainId) {
    train_id
  }
}
`;

const CREATEEMPOWER = gql`
mutation CreateEmpower($personId: Int!, $calType: Int!, $roleType: String, $assessmentResult: String, $assessor: Int, $assessmentDate: Date, $labSupervisor: Int, $empowerDate: Date, $suspensionDate: Date, $tableUpload: String, $approvalDoc: String, $comment: String) {
  createEmpower(person_id: $personId, cal_type: $calType, role_type: $roleType, assessment_result: $assessmentResult, assessor: $assessor, assessment_date: $assessmentDate, lab_supervisor: $labSupervisor, empower_date: $empowerDate, suspension_date: $suspensionDate, table_upload: $tableUpload, approval_doc: $approvalDoc, comment: $comment) {
    empower_id
  }
}
`;

const UPDATEEMPOWER = gql`
mutation UpdateEmpower($empowerId: Int!, $personId: Int!, $calType: Int!, $roleType: String, $assessmentResult: String, $assessor: Int, $assessmentDate: Date, $labSupervisor: Int, $empowerDate: Date, $suspensionDate: Date, $tableUpload: String, $approvalDoc: String, $comment: String) {
  updateEmpower(empower_id: $empowerId, person_id: $personId, cal_type: $calType, role_type: $roleType, assessment_result: $assessmentResult, assessor: $assessor, assessment_date: $assessmentDate, lab_supervisor: $labSupervisor, empower_date: $empowerDate, suspension_date: $suspensionDate, table_upload: $tableUpload, approval_doc: $approvalDoc, comment: $comment) {
    empower_id
  }
}
`;

const DELEMPOWER = gql`
mutation DelEmpower($empowerId: Int!) {
  delEmpower(empower_id: $empowerId) {
    empower_id
  }
}
`;

const GETEMPROLE = gql`
query GetEmpRoleList {
  getEmpRoleList {
    role_type
  }
}
`;

export default {
  GETALLEMP,
  GETEMPBYID,
  DELEMP,
  UPDATEEMP,
  GETTRAIN,
  GETTRAINBYID,
  GETEMPOWER,
  GETEMPOWERBYID,
  UPDATETRAIN,
  CREATETRAIN,
  DELTRAIN,
  CREATEEMPOWER,
  UPDATEEMPOWER,
  DELEMPOWER,
  GETEMPROLE,
};
