const express=require('express');
const router=express.Router();


const { mongoose } = require('../db/mongoose');
const { Post } = require('../models/Post');
const{ensureAuthenticated}=require('../helpers/auth');




router.get('/add', ensureAuthenticated, (req, res) => {

    res.render('posts/add');
});




// /posts route
router.post('/',ensureAuthenticated, (req, res) => {
    var errors = [];
    if (!req.body.title) {

        errors.push({ message: 'Please specify the title of the post.' });
    }
    if (!req.body.contents) {

        errors.push({ message: 'A post can not be empty.' });
    }

    if (errors.length > 0) {

        res.render('posts/add', {
            errors: errors,
            title: req.body.title,
            contents: req.body.contents
        });

    }
    else {

        const newPost = {
            title: req.body.title,
            contents: req.body.contents,
            user:req.user.id
            
        }

        new Post(newPost)
        .save()
        .then((post)=>{
            req.flash('success_msg','New post created successfully');
            res.redirect('/posts');
            
        });
    }



});

// posts index route
router.get('/',ensureAuthenticated, (req,res)=>{

    Post.find({user:req.user.id})
    .sort({date: 'desc'})
    .then((posts)=>{

        res.render('posts/index',{posts});
    });

  
});

// edit post form

router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
    Post.findOne({

        _id:req.params.id
    }).then((post)=>{

        if(post.user!=req.user.id){

            req.flash('error_msg', 'Not Authorized');
            res.redirect('/users/login')
        }else{

            res.render('posts/edit',{post});
        }


       

    })
  

});


// Put route

router.put('/update/:id',ensureAuthenticated,(req,res)=>{

Post.findOne({

    _id:req.params.id
}).then((post)=>{


    post.title=req.body.title;
    post.contents=req.body.contents;
    post.save()
     .then(()=>{
        req.flash('success_msg','Post updated successfully');
        res.redirect('/posts');
     });
});

});


// Delete route
router.delete('/delete/:id',ensureAuthenticated, (req,res)=>{

Post.findByIdAndRemove({

    _id:req.params.id

}).then(()=>{
    req.flash('success_msg', 'Post deleted successfully');
    res.redirect('/posts');
});

})

module.exports=router