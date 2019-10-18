import Vue from 'vue'
import gql from 'graphql-tag'

const auth = new Vue({
  data: {
    client: null,
    user: {
      id: null
    }
  },
  methods: {
    async loggedIn () {
      try {
        let {data} = await this.client.query({
          query: gql`{
            currentUser {
              id
            }
          }`
        })
        console.log(data)
        if (data.currentUser) {
          this.user.id = data.currentUser.id
        }
        return data.currentUser !== null
      } catch (e) {
        this.user.loggedIn = false
        return false
      }
    },
    async login (name, password, commonComputer) {
      try {
        let {data} = await this.client.mutate({
          mutation: gql`
            mutation ($params: LoginInput!) {
              login(input: $params) {
                success,
                user {
                  id
                  shortName
                  isSuperuser
                  avatar
                  company
                }
              }
          }`,
          variables: {
            params: {
              login: name,
              password: password,
              commonComputer: commonComputer
            }
          }
        })
        if (data.login.success) {
          this.user.id = data.login.user.id
          this.user.isSuperuser = data.login.user.isSuperuser
          this.user.shortName = data.login.user.shortName
          this.user.avatar = data.login.user.avatar
          const {data: perms} = await this.client.query({
            fetchPolicy: 'network-only',
            query: gql`{
              currentUserPermissions
            }`
          })
          this.user.permissions = perms.currentUserPermissions
          const {data: realPerms} = await this.client.query({
            fetchPolicy: 'network-only',
            query: gql`{
              realUserPermissions
            }`
          })
          this.user.realPermissions = realPerms.realUserPermissions
          const {data: commonComputer} = await this.client.query({
            fetchPolicy: 'network-only',
            query: gql`{
              commonComputerStatus
            }`
          })
          this.user.commonComputer = commonComputer.commonComputerStatus
          this.user.companyIDs = data.login.user.company
          this.user.loggedIn = true
        } else {
          this.user.id = 0
          this.user.shortName = ''
          this.user.isSuperuser = false
          this.user.permissions = []
          this.user.realPermissions = []
          this.user.avatar = ''
          this.user.commonComputer = false
          this.user.companyIDs = []
          this.user.loggedIn = true
        }
        return data.login.success
      } catch (e) {
        return false
      }
    }
  }
})

export default auth
