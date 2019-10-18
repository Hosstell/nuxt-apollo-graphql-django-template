import gql from 'graphql-tag'

const getCurrentUser = gql`
  query {
    getCurrentUser {
      id
      username
      email
      avatar {
        link
      }
    }
  }
`

export { getCurrentUser }
