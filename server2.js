var express = require('express');
var express_graphql = require('express-graphql');
var {buildSchema} = require('graphql');
var crypto = require('crypto');

//graphQl schema
var schema = buildSchema(`
    type Query{
        course(id: Int!): Course
        courses(topic: String): [Course]
        authors: [Author]
    }
    type Mutation {
        updateCourseTopic(id: Int!, topic: String): Course
        addCourse(topic: String, authorId: String, description: String, title: String, url: String): Course
    }
    type Course {
        id: Int!
        title: String
        authorId: Int!
        description: String
        topic: String
        url: String
    }
    type Author{
        id: Int!
        FullName: String
        courses: [Course!]!
    }
`);

class Author {
    constructor (author){
        Object.assign(this,author)
    }
    get courses (){
        return coursesData.filter(course => course.authorId === this.id)
    }
}

var coursesData = [
    {
        id: 1,
        title: 'The Complete Node.js Developer Course',
        authorId: 1,
        description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs/'
    },
    {
        id: 2,
        title: 'Node.js, Express & MongoDB Dev to Deployment',
        authorId: 1,
        description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
    },
    {
        id: 3,
        title: 'JavaScript: Understanding The Weird Parts',
        authorId: 2,
        description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        topic: 'JavaScript',
        url: 'https://codingthesmartway.com/courses/understand-javascript/'
    }
]
var authorsData = [
    {id: 1, FullName: "Mohamed Miladi"},
    {id: 2, FullName: "Khalil Bibi"}
]

var getCourse = function(args){
    var id = args.id;
    return coursesData.filter(course => {
        return course.id == id;
    })[0];
}

var getCourses = function(args) {
    if(args.topic){
        var topic = args.topic;
        return coursesData.filter(course => course.topic === topic);
    } else {
        return coursesData;
    }
}
var updateCourseTopic = function({id,topic}){
    coursesData.map(course => {
        if(course.id === id){
            course.topic = topic;
            return course;
        }
    });
    return coursesData.filter(course => course.id === id)[0];
}

var addCourse = function({topic,authorId, description, title, url}){
    const course = {
        id: '5',
        topic: topic,
        authorId: author,
        description: description,
        title: title,
        url: url
    }
    coursesData.push(course);
    return course;
}

var getAuthors = function(){
    return authorsData.map(author => new Author(author));
}

// root reseolver
var root = {
    course: getCourse,
    courses: getCourses,
    updateCourseTopic: updateCourseTopic,
    addCourse: addCourse,
    authors: getAuthors
};

// create an express server and a graphQl endpoint
var app = express();
app.use('/graphql', express_graphql({
   schema: schema,
   rootValue: root,
   graphiql: true  
}));

app.listen(4000, () => console.log('Express graphQl running on localhost:4000'));