import { setContext } from 'apollo-link-context'
import { from, split, concat } from 'apollo-link'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'

export const middlewares = ctx => {
  const httpLink = new HttpLink({ uri: 'http://localhost:8000/graphql/' });
  // Добавление CSRF-токена к запросу
  const csrfMiddleware = setContext((_, { headers }) => {
    console.log('csrftoken')
    return {
      headers: {
        ...headers,
        'X-CSRFToken': ctx.app.$cookies.get('csrftoken') || null
      }
    }
  })

  return {
    csrfMiddleware
  }
}
