const express = require('express');
const http = require('http');
const graphql = require('graphql');
const bodyParser = require('body-parser');
const debug = require('debug')('server:app');

const app  = express();
const PORT = 3000;

const count = 0;

const schema = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      count: {
        type: graphql.GraphQLInt,
        resolve: function() {
          return count;
        }
      }
    }
  })
});



// parse POST body as text
app.use(bodyParser.text({ type: 'application/graphql' }));
app.get('/api', (req, res) => {
  debug(req.body);
    // execute GraphQL!
    graphql.graphql(schema, req.body)
    .then((result) => {
        res.send(JSON.stringify(result, null, 2));
    });
});


var server = app.listen(PORT, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('GraphQL listening at http://%s:%s', host, port);
});