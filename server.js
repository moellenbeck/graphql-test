'use strict';

const express = require('express');
const http = require('http');
const graphql = require('graphql');
const graphqlHTTP = require('express-graphql');
const bodyParser = require('body-parser');

const debug = require('debug')('server:app');

const data = require('./data.json');

const app  = express();
const PORT = 3000;

// TODO: MM
// --> http://graphql.org/docs/getting-started/

// Define the User type with two string fields: `id` and `name`.
// The type of User is GraphQLObjectType, which has child fields
// with their own types (in this case, GraphQLString).
const userType = new graphql.GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
  }
});

// Define the schema with one top-level field, `user`, that
// takes an `id` argument and returns the User with that ID.
// Note that the `query` is a GraphQLObjectType, just like User.
// The `user` field, however, is a userType, which we defined above.
const schema = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
      user: {
        type: userType,
        // `args` describes the arguments that the `user` query accepts
        args: {
          id: { type: graphql.GraphQLString }
        },
        // The resolve function describes how to "resolve" or fulfill
        // the incoming query.
        // In this case we use the `id` argument from above as a key
        // to get the User from `data`
        resolve: function (_, args) {
          return data[args.id];
        }
      }
    }
  })
});

// parse POST body as text
app.use(bodyParser.text({ type: 'application/graphql' }));

// routes will be works by stack and the first match wins

app.get('/api/users/:userId([0-9]{3,8})', (req, res) => {
  res.send(`GET /api/users/:userId -> with ${req.params.userId}`);
});

// TODO: mm - check with postman: http://localhost:3000/api/users?query={user(id:"1"){name}} 
app.get('/api/users', graphqlHTTP({schema: schema, pretty: true}));

app.post('/api/users', (req, res) => {
  res.send('POST /api/users');
});

app.put('/api/users/:userId', (req, res) => {
  res.send(`PUT /api/users/:userId -> with ${req.params.userId}`);
});

app.delete('/api/users/:userId', (req, res) => {
  res.send(`DELETE /api/users/:userId -> with ${req.params.userId}`);
});

const server = app.listen(PORT, function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log('GraphQL listening at http://%s:%s', host, port);
});