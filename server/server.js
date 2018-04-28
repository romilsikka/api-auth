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
app.delete('/todos/:id', async (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  try {
    const todo = await Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    });
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  } catch (e) {
    res.status(400).send();
  }
});

app.patch('/todos/:id', async (req, res) =>  {
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

try{
  var todo =  await Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
  if (!todo) {
    return res.status(404).send();
  }
  res.send({todo});
}
    catch(e){
        res.status(400).send();
    }
});

app.post('/users',async (req,res)=>{

  try{
    var body = _.pick(req.body,['email','password']);
    var user = new User(body);
   var u = await user.save();
    res.send(u);
  }catch(e){
    res.status(400).send(e);
  }

});

app.listen(port,()=>{
   console.log('Server is up on port',port);
});
module.exports = {app};
