import { middlewares } from './middlewares'
import { createHttpLink } from "apollo-link-http";
import {setContext} from "apollo-link-context";
import { from, split, concat, ApolloLink} from 'apollo-link'

export default function(context) {
  // const httpLink = new createHttpLink({
  //   uri: 'http://localhost:8000/graphql/',
  //   credentials: 'include'
  // })

  const csrfMiddleware = setContext((_, { headers }) => {
    console.log(context.app.$cookies.get('csrftoken'))
    console.log(headers)
    return {
      headers: {
        ...headers,
        'X-CSRFToken': context.app.$cookies.get('csrftoken') || null
      }
    }
  })

  const authMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    console.log('authMiddleware')
    console.log(context.app.$cookies.get('csrftoken'))
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        'X-CSRFToken': context.app.$cookies.get('csrftoken') || null
      }
    }));

    return forward(operation);
  })

  const httpLink = new createHttpLink({
    uri: 'http://localhost:8000/graphql/',
    credentials: 'include'
  });

  return {
    link: concat(csrfMiddleware, concat(authMiddleware, httpLink)),
    defaultHttpLink: false,
  }
}
