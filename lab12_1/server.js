const express = require('express');
const app = express();
const mongoose = require('mongoose');

const routes = require("./App");


//Server side
var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port
   app.use(routes);
   console.log("Example app listening at http://%s:%s", host, port)
});

const DB = "mongodb+srv://HasnatKhan:Bindas@mongodb1@firstlab11-as8yj.mongodb.net/Menu?retryWrites=true&w=majority";
mongoose.connect(DB, {
useNewUrlParser: true,
useCreateIndex: true,
useUnifiedTopology:true,
useFindAndModify: false
}).then(() => console.log("DB connection successful!"));