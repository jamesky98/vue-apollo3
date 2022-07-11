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

export default {
  LOGINMU,
};
