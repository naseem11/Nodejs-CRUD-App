const express = require('express');
const passport=require('passport');

const bcrypt = require('bcryptjs');
const router = express.Router();
const { User } = require('../models/User')


const { mongoose } = require('../db/mongoose');

//GET  /users/login route

router.get('/login', (req, res) => {
    res.render('users/login');

});


//GET  /users/register route

router.get('/register', (req, res) => {
    res.render('users/register');

});

// POST /users/register route

router.post('/register', (req, res) => {

    let errors = [];
    if (req.body.regPassword !== req.body.conPassword) {

        errors.push({ message: 'Passwords do not match.' })
    }
    if (req.body.regPassword.length < 5) {

        errors.push({ message: 'Password must be atleast 5 characters long.' });
    }



    if (errors.length > 0) {

        res.render('users/register', {
            errors: errors,
            name: req.body.userName,
            email: req.body.regEmail,
            password: req.body.regPassword,
            password2: req.body.conPassword
        });

    } else {

        User.findOne({ email: req.body.regEmail })
            .then((user) => {
                if (user) {

                    req.flash('error_msg','Email already taken');
                    res.redirect('/users/register');

                } else {

                    const newUser = new User({
                        name: req.body.userName,
                        email: req.body.regEmail,
                        password: req.body.regPassword
                       
                    });

                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(newUser.password, salt, function (err, hash) {
                            if (err) {

                                throw err;

                            } else {
                                newUser.password = hash;



                                newUser.save()
                                    .then(() => {
                                        req.flash('success_msg', 'Registration Successfull, You can login now');
                                        res.redirect('/users/login');
                                    });



                            }
                        });
                    });

                }

            })


    }
})



    // POSt /users/login route


router.post('/login', (req,res, next)=>{

passport.authenticate('local',{

    successRedirect: '/posts',
    failureRedirect: '/users/login',
    failureFlash:true
})(req,res,next);
})


// users/logout route 

router.get('/logout',(req,res)=>{

    req.logout();
    req.flash('success_msg', 'You are logged out successfully.');
    res.redirect('/users/login');

})

module.exports = router;