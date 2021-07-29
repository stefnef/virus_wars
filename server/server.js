require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

// EXPRESS SETUP
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(express.static("public"));

app.use(session({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: false
  }));
app.use(passport.initialize());
app.use(passport.session());
app.set("port", process.env.PORT || 3000);

// MONGOOSE & USER REGISTER
mongoose.connect(process.env.MONGOOSE_HOST + process.env.MONGO_USER_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
    username: String,
    password: String
  });
  userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const roleSchema = new mongoose.Schema( {
  username: String,
  roles: [String]
});
const Role = new mongoose.model("Role", roleSchema);
  

// ROUTING
app.get("/", function(req, res){
  let logout = false;
  if (req.isAuthenticated()) {
    logout = true;
  } 
  res.render("home", {logout: logout});
})

app.get("/intro", function(req,res){    
    if (req.isAuthenticated()) {
        Role.findOne({ username: req.user.username}, function(err, foundRole){
          if(!err && foundRole) {
            res.render("intro", { videoSrc: process.env.VIDEO_SRC, 
                                  admin:true, username:"Gefahrenpool", 
                                  socketAdr: `${process.env.SOCKET_ORIGIN}`});
          } else {
            res.render("intro", { videoSrc: process.env.VIDEO_SRC, 
                                  admin:false, username:req.user.username, 
                                  socketAdr: `${process.env.SOCKET_ORIGIN}`});
          }
        });
    } else {
        res.redirect("/");
    }
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.post("/login", function(req, res) {
    const user = new User({
      username: req.body.username,
      password: req.body.password
    });
  
    req.login(user, function(err) {
      if (err) {
        console.log(err);        
        res.redirect("/login");
      } else {        
        passport.authenticate("local", {successRedirect: '/intro', failureRedirect: '/login'})(req, res, function() {            
             res.redirect("/intro");
        });
      }
    });
  });

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
})


app.get("/register", function(req, res) {
    let withRegister = process.env.REGISTER;
    if(withRegister === "WithRegister"){
      res.render("register");
    } else {
      res.render("noRegister");
    }
});

app.post("/register", function(req, res) {
    User.register({
      username: req.body.username
    }, req.body.password, function(err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function() {
          res.redirect("/intro");
        });
      }
    })
  });

const server = app.listen(app.get("port"), function(){
    console.log("listen!");
});

// SOCKET
const io = socketio(server,{
    cors: {
        origin: `${process.env.SOCKET_ORIGIN}`,//:${app.get("port")}`,
        methods: ["GET", "POST"],
        allowedHeaders: [process.env.SOCKET_HEADER],
        credentials: true
      }
});

io.on('connection', function(socket) {
    console.log("connection!");

    socket.on("playPauseToServer", ()=>{
        console.log("event!");
        io.emit("playPause");
    })

    socket.on("readyForVideo", (msg)=>{
      console.log(msg.user + " is ready for video");
      io.emit("readyForVideo", msg);
    })

    socket.on("initPlaygroundToServer", () => {
      console.log("initPlayground");
      io.emit("initPlayground");
    });

    socket.on("dicesSL", (msg)=>{      
      io.emit("newDicesSL", msg);
    });

    socket.on("dicesPlayer", (msg)=>{      
      io.emit("newDicesPlayer", msg);
    });

    socket.on("updateNrDicesSL", (msg)=>{
      io.emit("updateNrDicesSL", msg);
    });

    socket.on("disconnect", ()=>{
        console.log("disconnection event received");
    })
});