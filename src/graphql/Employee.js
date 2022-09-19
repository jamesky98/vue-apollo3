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
  mutation GetTrainByID($trainId: Int!) {
    getTrainByID(train_id: $trainId) {
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

export default {
  GETALLEMP,
  GETEMPBYID,
  DELEMP,
  UPDATEEMP,
  GETTRAIN,
  GETTRAINBYID,
  // GETEMPOWERBYEMPID,
  // GETTRAINBYEMPID,
};
