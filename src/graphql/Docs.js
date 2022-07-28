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

const ADDDOC = gql`
  mutation CreatDoc(
    $docId: String!
    $docLevel: Int!
    $docType: Int!
    $name: String!
    $ver: String!
    $releaseDate: Date
    $expirationDate: Date
    $parentId: String
    $upload: String
    $editableUpload: String
    $comment: String
  ) {
    creatDoc(
      doc_id: $docId
      doc_level: $docLevel
      doc_type: $docType
      name: $name
      ver: $ver
      release_date: $releaseDate
      expiration_date: $expirationDate
      parent_id: $parentId
      upload: $upload
      editable_upload: $editableUpload
      comment: $comment
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

const DELDOC = gql`
  mutation UpdateDoc($delDocId: Int!) {
    delDoc(id: $delDocId) {
      id
    }
  }
`;

const SAVEDOC = gql`
  mutation UpdateDoc(
    $updateDocId: Int!
    $docId: String
    $docLevel: Int
    $docType: Int
    $name: String
    $ver: String
    $releaseDate: Date
    $expirationDate: Date
    $parentId: String
    $upload: String
    $editableUpload: String
    $comment: String
  ) {
    updateDoc(
      id: $updateDocId
      doc_id: $docId
      doc_level: $docLevel
      doc_type: $docType
      name: $name
      ver: $ver
      release_date: $releaseDate
      expiration_date: $expirationDate
      parent_id: $parentId
      upload: $upload
      editable_upload: $editableUpload
      comment: $comment
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

const UPLOADDOC = gql`
  mutation UploadDoc($file: Upload!, $subpath: String!, $newfilename: String!) {
    uploadDoc(file: $file, subpath: $subpath, newfilename: $newfilename) {
      filename
      mimetype
      encoding
    }
  }
`;

export default {
  GETALLDOCLATEST,
  GETALLDOCTYPE,
  GETDOCHISTORY,
  ADDDOC,
  DELDOC,
  SAVEDOC,
  UPLOADDOC,
};
