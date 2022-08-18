import gql from "graphql-tag";

const CHECKTOKEN = gql`
  query checktoken {
    checktoken
  }
`;

const LOGINMU = gql`
  mutation Login($username: String!, $userpassword: String!) {
    login(user_name: $username, user_password: $userpassword) {
      token
      user {
        user_id
        user_name
        active
        role
      }
    }
  }
`;

const GETALLUSERs = gql`
  query Allusers {
    allusers {
      user_name
      user_id
    }
  }
`;

const GETUSER = gql`
  query getUserById($userId: Int!) {
    getUserById(user_id: $userId) {
      user_name
      user_mail
    }
  }
`;

const CHKUSERBYNAME = gql`
  mutation ChkUserByName($userName: String) {
    chkUserByName(user_name: $userName) {
      user_name
    }
  }
`;

const SIGNUPMU = gql`
  mutation Login(
    $userName: String!
    $userPassword: String!
    $userMail: String!
  ) {
    signup(
      user_name: $userName
      user_password: $userPassword
      user_mail: $userMail
    ) {
      token
      user {
        user_id
        user_name
        active
        role
      }
    }
  }
`;

export default {
  CHECKTOKEN,
  LOGINMU,
  GETUSER,
  CHKUSERBYNAME,
  GETALLUSERs,
  SIGNUPMU,
};
