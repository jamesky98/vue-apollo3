import gql from "graphql-tag";

const login_mutation = gql`
  mutation Login($userName: String!, $userPassword: String!) {
    login(user_name: $userName, user_password: $userPassword) {
      token
      user {
        user_id
        user_name
      }
    }
  }
`;

export default {
  login_mutation,
};
