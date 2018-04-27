var express = require('express');
var bodyParser = require('body-parser');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());

app.post('/todos', async (req,res)=>{
var todo = new Todo({
  text:req.body.text
});
try{
  const doc = await todo.save();
   res.send(doc);
}catch(e){
   res.status(400).send(e);
}
});
app.get('/todos',async (req,res)=>{
try{
    const todos = await Todo.find();
    res.send({todos});
}catch(e){
   res.status(400).send(e);
}


});

app.listen(port,()=>{
   console.log('Server is up on port',port);
});
module.exports = {app};
