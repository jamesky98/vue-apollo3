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

const STATCASEBYMOUNTH = gql`
mutation StatCaseByMounth($year: Int!, $calNum: Int!, $method: String) {
  statCaseByMounth(year: $year, calNum: $calNum, method: $method)
}
`;

export default {
  UPLOADFILE,
  STATCASEBYOPR,
  STATCASEMINMAXYEAR,
  STATCASEBYMOUNTH,
};
