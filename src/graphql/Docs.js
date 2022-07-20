import gql from "graphql-tag";

const GETALLDOCLATEST = gql`
  query GetAllDocLatest(
    $docId: String
    $docLevel: Int
    $docType: Int
    $name: String
    $ver: String
    $stauts: Int
  ) {
    getAllDocLatest(
      doc_id: $docId
      doc_level: $docLevel
      doc_type: $docType
      name: $name
      ver: $ver
      stauts: $stauts
    ) {
      id
      doc_id
      doc_level
      doc_type
      name
      ver
      release_date
      expiration_date
      parent_id
      upload
      editable_upload
      comment
    }
  }
`;

const GETALLDOCTYPE = gql`
  query GetAllDocType {
    getAllDocType {
      doc_type_id
      doc_type
    }
  }
`;
const GETDOCHISTORY = gql`
  query GetDocHistory($docId: String!) {
    getDocHistory(doc_id: $docId) {
      id
      doc_id
      doc_level
      doc_type
      name
      ver
      release_date
      expiration_date
      parent_id
      upload
      editable_upload
      comment
    }
  }
`;

export default {
  GETALLDOCLATEST,
  GETALLDOCTYPE,
  GETDOCHISTORY,
};
