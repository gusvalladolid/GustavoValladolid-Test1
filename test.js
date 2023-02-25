const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
require('dotenv').config();
const PORT = 3035;
const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({limit : "100mb"}));

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
});

app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    next()
})

const students = {
    data: [
        { id: 1, name: 'Gustavo', lastname: 'Valladolid', username: 'gusvalladolid', pass:'pass'},
        { id: 2, name: 'Student1', lastname: 'o', username: 'user4', pass:'pass'},
        { id: 3, name: 'Student2', lastname: 'o', username: 'user3', pass:'pass'},
        { id: 4, name: 'Student3', lastname: 'o', username: 'user2', pass:'pass'},
        { id: 5, name: 'Student4', lastname: 'o', username: 'user1', pass:'pass'}
        
    ]
}

app.post('/students', (req, res) =>{
    const { id } = req.body;
    const { name } = req.body;
    const { lastname } = req.body;
    const { username } = req.body;
    const { pass } = req.body;

    const newStudent = {
        id,name, lastname, username, pass
    }
    students.data.push(newStudent);
    res.send(`Student ${name} ${lastname} added`)
});

app.delete('/students/:id', (req, res) =>{
    const { id } = req.params;
    const student = students.data.find( student => student.id === Number(id))
    students.data = students.data.filter( student => student.id !== Number(id) )
    res.send(student);
});

app.put('/students/:id', (req, res) =>{
    const { id } = req.params;
    const { name } = req.body;
    const { lastname } = req.body;
    const { username } = req.body;
    const { pass } = req.body;

    const student = students.data.find(student => student.id === Number(id))
    student.name = name;
    student.lastname = lastname;
    student.username = username;
    student.pass = pass;
    res.send(student)

});

app.get('/students', (req,res)=>{
    res.send(students.data)
});

app.get('/students/:id', (req,res)=>{
    const { id } = req.params;
    const student = students.data.find(student => student.id === Number(id))
    res.send(student)
});

app.post('/register', (req, res) => {
    const { id } = req.body;
    const { name } = req.body;
    const { lastname } = req.body;
    const { username } = req.body;
    const { pass } = req.body;
    const hashPass = bcrypt.hash(pass, 10, async(err, hash) =>{
        const newStudent = {
            id,name, lastname, username, hash
        }
       return students.data.push(newStudent)
    })
    res.send(`Student ${name} ${lastname} added`)
});

app.post('/login', async(req, res)=>{
    const { username } = req.body;
    const { pass } = req.body;
    const student = students.data.find(student => student.username == String(username))
    const hashedpass = student.hash

    const comp = await bcrypt.compare(pass, hashedpass);
    res.send(comp)
});

