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
mutation StatCaseByOpr($year: Int!) {
  statCaseByOpr(year: $year)
}
`;
const STATCASEMINMAXYEAR = gql`
mutation StatCaseMinMaxYear {
  statCaseMinMaxYear
}
`;

const STATCASEBYMOUNTH = gql`
mutation StatCaseByMounth($year: Int!, $method: String) {
  statCaseByMounth(year: $year, method: $method)
}
`;

const STATCASETYPEBYYEAR = gql`
  mutation StatCaseTypeByYear($year: Int!) {
    statCaseTypeByYear(year: $year)
  }
`;

const STATCASESTATUSBYYEAR = gql`
  mutation StatCaseStatusByYear($year: Int!) {
    statCaseStatusByYear(year: $year)
  }
`;

const STATCASETABLEBYMOUNTH = gql`
  mutation StatCaseTableByMounth($year: Int!, $mounth: Int!) {
    statCaseTableByMounth(year: $year, mounth: $mounth)
  }
`;

export default {
  UPLOADFILE,
  STATCASEBYOPR,
  STATCASEMINMAXYEAR,
  STATCASEBYMOUNTH,
  STATCASETYPEBYYEAR,
  STATCASESTATUSBYYEAR,
  STATCASETABLEBYMOUNTH,
};
