let mongoose=require('mongoose');

//  ARTICLE COLLECTION SCHEMA
let articleSchema= mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    }
})
const Articles =mongoose.model('Articles',articleSchema);
module.exports= Articles;