const express = require('express');

const path=require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride=require('method-override');
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');



// Passport Config

require('./config/passport')(passport);

//Routes 
const postsRouter=require('./routes/posts');
const usersRouter=require('./routes/users');


const app = express();
const port = process.env.PORT || 3000;

// public folder middleware

app.use(express.static(path.join(__dirname,'public')));

// handlebars middleware
app.engine('handlebars', exphbs({
    'defaultLayout': 'main'
}));
app.set('view engine', 'handlebars');

//   bodyParser middleware

app.use(bodyParser.urlencoded({

    extended: false
}));

app.use(bodyParser.json());

// method-override middleware


// express-session midleware

app.use(session({
    secret: 'secrety',
    resave: true,
    saveUninitialized: true,
  
  }));

  // passport middleware

  app.use(passport.initialize());
  app.use(passport.session());

app.use(methodOverride('_method'));

// connect-flash middleware

app.use(flash());




// adding global variables

app.use(function(req,res,next){

 
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    res.locals.user=req.user||null;
    next();
});
  



//Index route
app.get('/', (req, res) => {

    res.render('index');

});




// Add post form



//About route

app.get('/about', (req, res) => {

    res.render('about')
});

// use routes

app.use('/posts', postsRouter);
app.use('/users',usersRouter);

app.listen(port, () => {

    console.log(`Server is up and running on port ${port}`);
});