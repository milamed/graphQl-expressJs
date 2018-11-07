var express = require('express');
var express_graphql = require('express-graphql');
var {buildSchema} = require('graphql');

//graphQl schema
var schema = buildSchema(`
    type Query{
        message: String
    }
`);

var root = {
    message: () => 'hello world !'
};

// create an express server and a graphQl endpoint
var app = express();
app.use('/graphql', express_graphql({
   schema: schema,
   rootValue: root,
   graphiql: true  
}));

app.listen(4000, () => console.log('Express graphQl running on localhost:4000'));