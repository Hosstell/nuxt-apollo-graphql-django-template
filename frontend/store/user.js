import { getCurrentUser } from "../graphql/users/queries";

function apollo(ctx) {
  return ctx.app.apolloProvider.defaultClient
}

export const state = () => ({
  id: null,
  username: '',
  email: '',
  avatar: null
})

export const mutations = {
  setUser(state, user) {
    Object.assign(state, user)
  }
}

export const actions = {
  getCurrentUser(ctx) {
    console.log('getCurrentUser')
    return apollo(this)
      .query({
        query: getCurrentUser,
        fetchPolicy: 'no-cache'
      })
      .then(({ data }) => {
        console.log(data)
        ctx.commit('setUser', data.getCurrentUser)
      })
  }
}

