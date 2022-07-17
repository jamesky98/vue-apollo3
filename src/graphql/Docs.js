import gql from "graphql-tag";

const GETALLDOCLATEST = gql`
  query GetAllDocLatest(
    $docId: String
    $docLevel: Int
    $docType: Int
    $name: String
    $ver: String
    $releaseDate: Date
    $expirationDate: Date
  ) {
    getAllDocLatest(
      doc_id: $docId
      doc_level: $docLevel
      doc_type: $docType
      name: $name
      ver: $ver
      release_date: $releaseDate
      expiration_date: $expirationDate
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

export default {
  GETALLDOCLATEST,
};
