const mongoose=require('mongoose');

const Schema=mongoose.Schema;

var PostSchema=new Schema({

    title:{
        type:String,
        required:true,

    },
    contents:{
        type:String,
        required:true


    },
    user:{
        type:String,
        required:true

    },
    date:{

        type:Date,
        default:Date.now()
    }

});

const Post=mongoose.model('Post',PostSchema);

module.exports={Post};

