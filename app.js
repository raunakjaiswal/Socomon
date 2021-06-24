const express = require("express");
const path = require("path");
const hbs = require("hbs");
const bodyparser = require("body-parser");
const mysqlconection = require("./connection");
const session = require("express-session");
var fileupload = require("express-fileupload");
const multer = require("multer");





const app = express();
const http = require('http').createServer(app);
const port = process.env.PORT || 3000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(fileupload());
// app.use(express.urlencoded({extended: false}));
// app.use(express.static(path.join(__dirname,'/public')));
app.use(express.static(__dirname + "/public"));
// console.log(__dirname,'public');
// app.use(express.static(path.join(__dirname,'templates/views/username')));
// app.use(express.static(path.join(__dirname,'public')));
// console.log(path.join(__dirname,'public/index.html'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// hbs.registerPartials(partial_Path);
hbs.handlebars.registerHelper("json", function (context) {
  return JSON.stringify(context);
});

app.use(
  session({
    // store,
    resave: false,
    saveUninitialized: true,
    secret: "secret",
  })
);

const partial_Path = path.join(__dirname, "templates/partials");

app.set("views", path.join(__dirname, "templates/views"));
app.set("view engine", "hbs");
hbs.registerPartials(partial_Path);

//define routes
app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));
app.use("/welcome", require("./routes/pages"));
app.use("/profile", require("./routes/pages"));
app.use("/editprofile", require("./routes/pages"));
app.use("/update_profile_pic", require("./routes/pages"));
// app.use('/auth',require('./routes/auth'));

http.listen(port, () => {
  console.log(`servewr is on port ${port}`);
});


//socket

const io = require('socket.io')(http)

io.on('connection',(socket)=>{
console.log("connected");

socket.on('message1', (msg)=>{
    console.log(msg)
    socket.broadcast.emit('message1',msg)
})
})
module.exports = app;
