const express = require ('express');
const app = express();
const Joi = require('joi'); //Joi is a class and for JS we use capital first letters for every class 

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", 
  database: "Course"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");



  
});

app.use(express.json());

const courses = [
    {id: 1, name: 'course1'}, 
    {id: 2, name: 'course2'}, 
    {id: 3, name: 'course3'}
];

//we specify the route and the callback function 
app.get('/', (req, res) => {
    res.send('Hello World');
});


app.get('/api/courses', (req, res) => {

        
        con.query("SELECT * FROM Course", function (err, result, fields) {
          if (err) throw err;
          console.log(result);
          res.send(result);
        });
      


   
});

app.get('/api/courses/:id', (req, res) => {
    //let is for a variable that we will reset later
    //const if we will always have it the same
    let course = courses.find( c => c.id === parseInt(req.params.id));

    //if client asks for resource, but resource doesn't exist on server - return a 404
    if(!course) res.status(404).send('The course with the given ID was not found');
    res.send(course);

});
e
app.get('/api/courses/:id/:month', (req, res) => {
    res.send(req.params);
    //route parameters are for required values, query parameters or for optional paramters 
    //res.send(req.query);
});

app.post('/api/courses/', (req, res) => {

    const { error } = validateCourse(req.body); //equivalent to result.error
    
    if(error){
        //400 give them a bad reqeust 
        let errorMessage = '';

        for (var i = 0; i < error.details.length; i++){
            errorMessage = errorMessage + '\n' + error.details[i].message;
        }
        return res.status(400).send(errorMessage);
        
    }



    //will be moved someplace else
    var sql = "Insert into Course (CourseName) Values(\'" + req.body.name + "\')";
    con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted. ID: " + result.insertId);
    });

    res.send(result);
});

//put is for updating an existing record
app.put('/api/courses/:id', (req, res) => {
    //look up the course by whatever :id is passed 
    //If the course does not exist, throw a 404
    let course = courses.find( c => c.id === parseInt(req.params.id));

    if(!course){
        return res.status(404).send('We could not locate that course based on the credentials provided');
    }


    //validate
    //if invalid, return a 400 - Bad Request
    
    //object destructuring syntax
    const { error } = validateCourse(req.body); //equivalent to result.error
    
    if(error){
        //400 give them a bad reqeust 
        let errorMessage = '';

        for (var i = 0; i < error.details.length; i++){
            errorMessage = errorMessage + '\n' + error.details[i].message;
        }
        return res.status(400).send(errorMessage);
        
    }

    //update course
    course.name = req.body.name;
    //Return the updated course to the client
    res.send(course);
    

     
});

app.delete('/api/courses/:id', (req, res) =>{
    //Look up the course
    //If it doesn't exist, throw at 404 
    let course = courses.find( c => c.id === parseInt(req.params.id));

    if(!course){
        return res.status(404).send('We could not locate that course based on the credentials provided');
    }

    //Delete the course if found
    const index = courses.indexOf(course);
    courses.splice(index, 1); //removes 1 object at the specified index


    //Return the same course
    res.send(course);

});

function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    };

    return result = Joi.validate(course, schema);
    
}



//we cannot rely on 3000 to be available in PROD
//to set the port on local terminam "export PORT=5100"
//PORT
const port = process.env.PORT || 5100;
app.listen(port, () => console.log(`listening on port ${port}...`));


