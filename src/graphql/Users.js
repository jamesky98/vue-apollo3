import gql from "graphql-tag";

const LOGINMU = gql`
  mutation Login($username: String!, $userpassword: String!) {
    login(user_name: $username, user_password: $userpassword) {
      token
      user {
        user_id
        user_name
      }
    }
  }
`;

const GETALLUSERs = gql`
  query Allusers {
    allusers {
      user_name
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


export default {
  LOGINMU,
  GETUSER,
  GETALLUSERs,
};
