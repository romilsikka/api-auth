const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Database connection Error');
  }
  console.log('Connected to Database');
  client.close();
});
