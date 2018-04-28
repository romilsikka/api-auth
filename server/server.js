var express = require('express');
var bodyParser = require('body-parser');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require('mongodb');
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

app.get('/todos/:id',async (req,res)=>{
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  try{
      const todo = await Todo.findById(id);
      if(!todo){
        return res.status(404).send();
      }
       res.send({todo});
        }catch(e){
          return res.status(404).send();
        }

});

app.listen(port,()=>{
   console.log('Server is up on port',port);
});
module.exports = {app};
