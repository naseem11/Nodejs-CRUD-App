const mongoose=require('mongoose');

mongoose.Promise=global.Promise;
mongoose.connect('process.env.MONGODB_URI ||mongodb://localhost:27017/BlogApp',{


}).then(()=>{

    console.log('Connected to blog database..');
}).catch((err)=>{

    console.log(err);
});



module.exports={mongoose};