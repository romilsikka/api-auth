const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {ObjectID} = require('mongodb');
const port = process.env.PORT || 3000;

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
app.delete('/todos/:id',async (req,res)=>{
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  try{
      const todo = await Todo.findByIdAndRemove(id);
      if(!todo){
        return res.status(404).send();
      }
       res.send({todo});
        }catch(e){
          return res.status(404).send();
        }

});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.createdAt = new Date().getTime();
  } else {
    body.completed = false;
    body.createdAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  })
});

app.listen(port,()=>{
   console.log('Server is up on port',port);
});
module.exports = {app};
