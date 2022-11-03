import gql from "graphql-tag";

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

const STATCASEBYOPR = gql`
mutation StatCaseByOpr($year: Int!, $calNum: Int!) {
  statCaseByOpr(year: $year, calNum: $calNum)
}
`;
const STATCASEMINMAXYEAR = gql`
mutation StatCaseMinMaxYear {
  statCaseMinMaxYear
}
`;

export default {
  UPLOADFILE,
  STATCASEBYOPR,
  STATCASEMINMAXYEAR,
};
