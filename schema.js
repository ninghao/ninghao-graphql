import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql'

import axios from 'axios'

const API_BASE = 'http://localhost:3300'

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    }
  }
})

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: {
      type: GraphQLString
    },
    title: {
      type: GraphQLString
    },
    content: {
      type: GraphQLString
    },
    author: {
      type: UserType,
      resolve: (obj) => {
        return axios.get(`${ API_BASE }/users/${ obj.author }`)
          .then(response => response.data)
      }
    }
  }
})

const QueryRootType = new GraphQLObjectType({
  name: 'QueryRoot',
  fields: {
    greeting: {
      type: GraphQLString,
      resolve: () => 'hello ~'
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: () => {
        return axios.get(`${ API_BASE }/posts`)
          .then(response => response.data)
      }
    },
    post: {
      type: PostType,
      args: {
        id: {
          type: GraphQLString
        }
      },
      resolve: (obj, args, context) => {
        return axios.get(`${ API_BASE }/posts/${ args.id }`)
          .then(response => response.data)
      }
    }
  }
})

export default new GraphQLSchema({
  query: QueryRootType
})
